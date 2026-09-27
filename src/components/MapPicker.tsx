import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  Building, 
  Info, 
  ShieldCheck, 
  Navigation, 
  Loader2, 
  MapPin, 
  CheckCircle2, 
  Crosshair, 
  Sparkles, 
  Search, 
  Layers, 
  RotateCcw,
  Compass,
  X
} from 'lucide-react';
import L from 'leaflet';

interface MapPickerProps {
  address: string;
  setAddress: (address: string) => void;
}

interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type?: string;
}

// Major cities coordinates lookup (Goa exclusive doorstep service)
const CITY_COORDINATES: Record<string, { coords: [number, number]; zoom: number }> = {
  'Goa': { coords: [15.4989, 73.8278], zoom: 13 }
};

// Popular Goa Outcall Hotspots for instant one-click jump
const GOA_HOTSPOTS: Record<string, [number, number]> = {
  'Candolim': [15.5173, 73.7628],
  'Calangute': [15.5439, 73.7553],
  'Baga': [15.5553, 73.7516],
  'Anjuna': [15.5841, 73.7439],
  'Vagator': [15.5997, 73.7441],
  'Panaji': [15.4909, 73.8278],
  'Porvorim': [15.5348, 73.8279],
  'Morjim / Mandrem': [15.6358, 73.7378],
  'Margao / Colva': [15.2783, 73.9189]
};

// Luxury Custom Gold Leaflet Pin Icon
const createGoldIcon = () => {
  return L.divIcon({
    className: 'custom-gold-marker',
    html: `
      <div style="position: relative; width: 38px; height: 48px; transform: translate(-50%, -100%); pointer-events: none;">
        <!-- Pulsing radar ring -->
        <div style="position: absolute; bottom: 2px; left: 50%; transform: translate(-50%, 50%); width: 24px; height: 10px; background: rgba(212, 175, 55, 0.5); border-radius: 50%; animation: pulse-ring 2s infinite ease-out;"></div>
        <!-- Pin Body -->
        <div style="position: relative; width: 36px; height: 36px; background: linear-gradient(135deg, #f6e08f 0%, #d4af37 60%, #997316 100%); border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 22px rgba(212, 175, 55, 0.55), 0 3px 8px rgba(0,0,0,0.9); border: 2.5px solid #ffffff;">
          <div style="width: 14px; height: 14px; background-color: #0b0b0c; border-radius: 50%; margin: auto; transform: rotate(45deg); display: flex; align-items: center; justify-content: center;">
            <div style="width: 5px; height: 5px; background-color: #f6e08f; border-radius: 50%;"></div>
          </div>
        </div>
      </div>
    `,
    iconSize: [38, 48],
    iconAnchor: [19, 48],
    popupAnchor: [0, -48]
  });
};

export default function MapPicker({ address, setAddress }: MapPickerProps) {
  // Structured address fields
  const [flatNo, setFlatNo] = useState('');
  const [buildingName, setBuildingName] = useState('');
  const [landmark, setLandmark] = useState('');
  const [locality, setLocality] = useState('');
  const [city, setCity] = useState('Goa');
  const [pincode, setPincode] = useState('');

  const lastCompiledRef = useRef('');

  // Search input state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // GPS Coordinates & Accuracy Tracking
  const [coords, setCoords] = useState<[number, number]>([15.4989, 73.8278]); // Default to Goa
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [loadingGPS, setLoadingGPS] = useState(false);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>('📍 Map active: Tap anywhere on the map or search to pin your doorstep.');
  const [statusType, setStatusType] = useState<'success' | 'info' | 'warning'>('info');

  // Tile layer style toggle (Standard Street / Luxury Dark)
  const [tileStyle, setTileStyle] = useState<'osm' | 'voyager'>('osm');

  // Leaflet map refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const circleRef = useRef<L.Circle | null>(null);
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Compile clean, structured address format with GPS metadata for Admin & Tracker
  useEffect(() => {
    const parts = [
      flatNo.trim() ? `Flat/Room: ${flatNo.trim()}` : '',
      buildingName.trim() ? buildingName.trim() : '',
      landmark.trim() ? `Landmark: ${landmark.trim()}` : '',
      locality.trim() ? locality.trim() : '',
      city ? city : '',
      pincode.trim() ? `Pincode: ${pincode.trim()}` : ''
    ].filter(Boolean);

    // If coordinates exist, append high-precision GPS string & Maps link
    if (coords && coords[0] && coords[1]) {
      const latStr = coords[0].toFixed(6);
      const lngStr = coords[1].toFixed(6);
      parts.push(`GPS Coordinates: ${latStr}, ${lngStr}`);
      parts.push(`Google Maps Link: https://www.google.com/maps?q=${latStr},${lngStr}`);
    }

    const compiled = parts.join(', ');
    if (compiled && compiled !== address) {
      lastCompiledRef.current = compiled;
      setAddress(compiled);
    }
  }, [flatNo, buildingName, landmark, locality, city, pincode, coords[0], coords[1]]);

  // 2. Parse initial outer address back to fields ONLY if changed from external source
  useEffect(() => {
    if (!address || address === lastCompiledRef.current) return;

    const gpsMatch = address.match(/GPS Coordinates:\s*(-?\d+\.\d+),\s*(-?\d+\.\d+)/);
    if (gpsMatch) {
      const lat = parseFloat(gpsMatch[1]);
      const lng = parseFloat(gpsMatch[2]);
      if (!isNaN(lat) && !isNaN(lng)) {
        if (Math.abs(coords[0] - lat) > 0.0001 || Math.abs(coords[1] - lng) > 0.0001) {
          setCoords([lat, lng]);
        }
      }
    }

    const segments = address.split(',').map(s => s.trim());
    if (segments.length >= 2) {
      segments.forEach(seg => {
        if (seg.startsWith('Flat/Room:')) {
          setFlatNo(prev => prev || seg.replace('Flat/Room:', '').trim());
        } else if (seg.startsWith('Landmark:')) {
          setLandmark(prev => prev || seg.replace('Landmark:', '').trim());
        } else if (seg.startsWith('Pincode:')) {
          setPincode(prev => prev || seg.replace('Pincode:', '').trim());
        } else if (seg === 'Goa') {
          setCity('Goa');
        }
      });
    }
  }, [address]);

  // Helper to get active Tile Layer URL
  const getTileLayer = (style: 'osm' | 'voyager') => {
    if (style === 'voyager') {
      return L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: ['a', 'b', 'c', 'd'],
        attribution: '&copy; OpenStreetMap contributors'
      });
    }
    // High-performance OpenStreetMap
    return L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      subdomains: ['a', 'b', 'c'],
      attribution: '&copy; OpenStreetMap contributors'
    });
  };

  // 3. Initialize Leaflet Live Map instance with multiple layout fixes
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialCoords = coords;

      const map = L.map(mapContainerRef.current, {
        center: initialCoords,
        zoom: 14,
        zoomControl: true,
        attributionControl: false
      });

      // Add Tile Layer
      const initialLayer = getTileLayer(tileStyle);
      initialLayer.addTo(map);
      tileLayerRef.current = initialLayer;

      // Create Draggable Pin Marker
      const marker = L.marker(initialCoords, {
        icon: createGoldIcon(),
        draggable: true,
        autoPan: true
      }).addTo(map);

      marker.bindPopup(
        `<div style="font-family: sans-serif; font-size: 12px; color: #f4f4f5; font-weight: 600; padding: 2px;">
          📍 <strong>Your Doorstep Location</strong><br/>
          <span style="font-size: 11px; color: #d4af37;">Therapist will arrive here</span>
        </div>`
      );

      // Handle Marker Drag End
      marker.on('dragend', () => {
        const position = marker.getLatLng();
        handleMapCoordinateSelection(position.lat, position.lng, true);
      });

      // Handle Map Direct Click
      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        handleMapCoordinateSelection(lat, lng, true);
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;

      // Comprehensive size invalidations to guarantee perfect tile rendering
      const invalidate = () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      };

      requestAnimationFrame(invalidate);
      const t1 = setTimeout(invalidate, 100);
      const t2 = setTimeout(invalidate, 400);
      const t3 = setTimeout(invalidate, 1000);

      window.addEventListener('resize', invalidate);

      // ResizeObserver to handle tab changes or layout expands
      let resizeObserver: ResizeObserver | null = null;
      if (typeof ResizeObserver !== 'undefined' && mapContainerRef.current) {
        resizeObserver = new ResizeObserver(() => {
          invalidate();
        });
        resizeObserver.observe(mapContainerRef.current);
      }

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        window.removeEventListener('resize', invalidate);
        if (resizeObserver) {
          resizeObserver.disconnect();
        }
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
          tileLayerRef.current = null;
          markerRef.current = null;
          circleRef.current = null;
        }
      };
    }
  }, []);

  // 4. Update tile layer when style toggles
  useEffect(() => {
    if (mapInstanceRef.current && tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
      const newLayer = getTileLayer(tileStyle);
      newLayer.addTo(mapInstanceRef.current);
      tileLayerRef.current = newLayer;
    }
  }, [tileStyle]);

  // 5. Update Map view whenever coords change
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current && coords) {
      markerRef.current.setLatLng(coords);

      // Update accuracy circle if accuracy exists
      if (accuracy && mapInstanceRef.current) {
        if (circleRef.current) {
          circleRef.current.setLatLng(coords);
          circleRef.current.setRadius(accuracy);
        } else {
          circleRef.current = L.circle(coords, {
            radius: accuracy,
            color: '#d4af37',
            fillColor: '#d4af37',
            fillOpacity: 0.15,
            weight: 2
          }).addTo(mapInstanceRef.current);
        }
      } else if (circleRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(circleRef.current);
        circleRef.current = null;
      }
    }
  }, [coords, accuracy]);

  // 6. Reverse Geocode Coordinates to 100% Precise Address with fallbacks
  const reverseGeocode = async (lat: number, lng: number) => {
    setIsReverseGeocoding(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&addressdetails=1`,
        {
          signal: controller.signal,
          headers: {
            'User-Agent': 'MaleMassagerAtYourPlace/4.0 (contact@malemassageratyourplace.com)',
            'Accept-Language': 'en'
          }
        }
      );
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && data.address) {
          const addr = data.address;
          
          const house = addr.house_number || addr.building || addr.room || addr.suite || '';
          const complex = addr.building || addr.apartment || addr.complex || addr.hotel || addr.residential || addr.road || '';
          const localArea = addr.neighbourhood || addr.suburb || addr.residential || addr.city_district || addr.quarter || addr.village || '';
          const landmarkPoint = addr.amenity || addr.tourism || addr.historic || addr.leisure || addr.shop || addr.place || '';
          const pc = addr.postcode || '';
          const detectedCityName = addr.city || addr.town || addr.municipality || addr.state_district || addr.state || '';

          if (house) setFlatNo(house);
          if (complex) setBuildingName(complex);
          if (localArea) setLocality(localArea);
          if (landmarkPoint) setLandmark(`Near ${landmarkPoint}`);
          if (pc) setPincode(pc);

          setCity('Goa');

          setStatusType('success');
          setStatusMessage('✅ Doorstep address auto-synchronized with live map pin!');
          setIsReverseGeocoding(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Reverse geocoding note:', err);
    }

    setBuildingName(prev => prev || `Doorstep Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
    setStatusType('success');
    setStatusMessage('📍 Live Pin placed! GPS Coordinates attached.');
    setIsReverseGeocoding(false);
  };

  // 7. Handle Map Click / Marker Drag
  const handleMapCoordinateSelection = (lat: number, lng: number, shouldGeocode = true) => {
    setCoords([lat, lng]);
    setAccuracy(null);
    if (shouldGeocode) {
      reverseGeocode(lat, lng);
    }
  };

  // 8. Place Search via OpenStreetMap Nominatim with debouncing
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    if (!query.trim() || query.length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    searchDebounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(query)}&countrycodes=in&limit=6&addressdetails=1`,
          {
            headers: {
              'User-Agent': 'MaleMassagerAtYourPlace/4.0',
              'Accept-Language': 'en'
            }
          }
        );
        if (response.ok) {
          const results = await response.json();
          setSearchResults(results);
          setShowSearchResults(results.length > 0);
        }
      } catch (err) {
        console.warn('Search failed:', err);
      } finally {
        setIsSearching(false);
      }
    }, 400);
  };

  // 9. Select Place from Search Result Dropdown
  const handleSelectSearchResult = (result: SearchResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    if (!isNaN(lat) && !isNaN(lng)) {
      setCoords([lat, lng]);
      setSearchQuery(result.display_name);
      setShowSearchResults(false);

      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([lat, lng], 16, {
          animate: true,
          duration: 1.2
        });
      }

      reverseGeocode(lat, lng);
    }
  };

  // 10. Auto-detect Live GPS Satellite Position (High Accuracy Mode)
  const handleAutoDetectGPS = () => {
    if (!navigator.geolocation) {
      setStatusType('warning');
      setStatusMessage('⚠️ Geolocation is not supported by your browser.');
      return;
    }

    setLoadingGPS(true);
    setStatusType('info');
    setStatusMessage('🛰️ Detecting high-precision GPS satellite location...');

    const onPositionSuccess = (pos: GeolocationPosition) => {
      const { latitude, longitude, accuracy: meterAccuracy } = pos.coords;
      const newCoords: [number, number] = [latitude, longitude];
      
      setCoords(newCoords);
      setAccuracy(meterAccuracy || 10);
      setLoadingGPS(false);

      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo(newCoords, 17, {
          animate: true,
          duration: 1.2
        });
      }

      reverseGeocode(latitude, longitude);
    };

    const onPositionError = (err: GeolocationPositionError, isRetry = false) => {
      if (!isRetry && (err.code === err.TIMEOUT || err.code === err.POSITION_UNAVAILABLE)) {
        setStatusType('info');
        setStatusMessage('Retrying with standard network GPS...');
        navigator.geolocation.getCurrentPosition(
          onPositionSuccess,
          (retryErr) => onPositionError(retryErr, true),
          { enableHighAccuracy: false, timeout: 10000, maximumAge: 30000 }
        );
        return;
      }

      const reason = err.code === 1 
        ? 'Location permission denied. Please click on the map or search your area to pin your location.' 
        : err.code === 3 
        ? 'GPS request timed out. You can tap anywhere on the live map to pin your location.'
        : 'Could not obtain automatic GPS. Please tap your location on the map below.';

      setStatusType('warning');
      setStatusMessage(`⚠️ ${reason}`);
      setLoadingGPS(false);
    };

    navigator.geolocation.getCurrentPosition(
      onPositionSuccess,
      (err) => onPositionError(err, false),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // 11. Handle City Change to smoothly fly map
  const handleCityChange = (newCity: string) => {
    setCity(newCity);
    const target = CITY_COORDINATES[newCity];
    if (target) {
      setCoords(target.coords);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo(target.coords, target.zoom, { animate: true, duration: 1 });
      }
      reverseGeocode(target.coords[0], target.coords[1]);
    }
  };

  // 12. Quick Hotspot jump for Goa
  const handleGoaHotspotJump = (hotspotName: string) => {
    const hotspotCoord = GOA_HOTSPOTS[hotspotName];
    if (hotspotCoord) {
      setCity('Goa');
      setCoords(hotspotCoord);
      setLocality(hotspotName);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo(hotspotCoord, 16, { animate: true, duration: 1.2 });
      }
      reverseGeocode(hotspotCoord[0], hotspotCoord[1]);
    }
  };

  return (
    <div className="bg-zinc-950 border border-gold/30 p-4 sm:p-6 rounded-3xl space-y-5 relative shadow-2xl">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/20 pb-4">
        <div className="space-y-1">
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <Building className="w-4 h-4 text-gold" />
            Live Doorstep Location & Outcall Map
          </h4>
          <p className="text-xs text-zinc-400">
            Search your hotel/area, tap the map, or use GPS to pin your exact doorstep location.
          </p>
        </div>

        {/* GPS Auto-Fill Action Button */}
        <button
          type="button"
          onClick={handleAutoDetectGPS}
          disabled={loadingGPS || isReverseGeocoding}
          className="px-4 py-2.5 bg-gold hover:bg-gold-hover text-black active:scale-95 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-gold/20 disabled:opacity-60 shrink-0"
        >
          {loadingGPS || isReverseGeocoding ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-black" />
              <span>{loadingGPS ? 'Locating GPS...' : 'Updating Pin...'}</span>
            </>
          ) : (
            <>
              <Navigation className="w-4 h-4 fill-black text-black" />
              <span>Use Current GPS Location</span>
            </>
          )}
        </button>
      </div>

      {/* Instant Search Bar on Map */}
      <div className="relative z-30">
        <div className="relative">
          <Search className="w-4 h-4 text-gold absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => {
              if (searchResults.length > 0) setShowSearchResults(true);
            }}
            placeholder="Search hotel, resort, apartment, beach, area (e.g. Candolim, Taj Fort Aguada, Baga, Bandra)..."
            className="w-full bg-zinc-900/90 border border-gold/40 focus:border-gold rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSearchResults([]);
                setShowSearchResults(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          {isSearching && (
            <Loader2 className="w-4 h-4 text-gold animate-spin absolute right-3 top-1/2 -translate-y-1/2" />
          )}
        </div>

        {/* Search Results Autocomplete Dropdown */}
        {showSearchResults && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-zinc-900 border border-gold/40 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto divide-y divide-zinc-800 z-50">
            {searchResults.map((item) => (
              <button
                key={item.place_id}
                type="button"
                onClick={() => handleSelectSearchResult(item)}
                className="w-full text-left px-4 py-3 hover:bg-zinc-800/80 flex items-start gap-2.5 transition-colors cursor-pointer group"
              >
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="text-xs text-zinc-200 leading-snug font-medium line-clamp-2">
                  {item.display_name}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick Goa Service Hotspot Selector Pills - Showing Only Goa & Goa Areas */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
          <span className="font-bold text-gold flex items-center gap-1">
            <Compass className="w-3.5 h-3.5" />
            Goa Service Hotspots:
          </span>
          <span className="text-[11px] text-zinc-500">Tap to jump map</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar">
          <button
            type="button"
            onClick={() => handleCityChange('Goa')}
            className={`px-3 py-1 text-xs rounded-lg font-mono font-medium transition-all whitespace-nowrap cursor-pointer shrink-0 border ${
              city === 'Goa' && !locality
                ? 'bg-gold text-black border-gold font-bold shadow-sm shadow-gold/20'
                : 'bg-zinc-900 text-zinc-300 border-border/60 hover:border-gold/40'
            }`}
          >
            All Goa
          </button>
          {Object.keys(GOA_HOTSPOTS).map((hName) => (
            <button
              key={hName}
              type="button"
              onClick={() => handleGoaHotspotJump(hName)}
              className={`px-2.5 py-1 text-xs rounded-lg font-mono transition-all whitespace-nowrap cursor-pointer shrink-0 border ${
                locality === hName
                  ? 'bg-gold text-black border-gold font-bold shadow-sm shadow-gold/20'
                  : 'bg-zinc-900/90 text-amber-300/90 hover:text-white hover:bg-gold/20 border border-gold/30 font-medium'
              }`}
            >
              {hName}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Live Map View Container */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
          <span className="flex items-center gap-1.5 text-zinc-300 font-semibold">
            <Crosshair className="w-3.5 h-3.5 text-gold" />
            Interactive Pinpoint Map (Tap or drag pin to adjust)
          </span>
          {coords && (
            <span className="text-[11px] text-gold font-bold bg-gold/10 px-2 py-0.5 rounded border border-gold/30">
              GPS: {coords[0].toFixed(5)}, {coords[1].toFixed(5)}
              {accuracy ? ` (±${Math.round(accuracy)}m)` : ''}
            </span>
          )}
        </div>

        {/* Map Container */}
        <div className="relative rounded-2xl overflow-hidden border-2 border-gold/40 shadow-inner bg-zinc-950 h-72 sm:h-80 w-full z-10">
          <div ref={mapContainerRef} className="w-full h-full" />

          {/* Floating Controls on Map */}
          <div className="absolute top-3 right-3 z-[400] flex flex-col gap-2">
            {/* Tile Layer Toggle */}
            <button
              type="button"
              onClick={() => setTileStyle(tileStyle === 'osm' ? 'voyager' : 'osm')}
              title="Toggle Map Style"
              className="bg-zinc-950/90 hover:bg-zinc-900 text-gold p-2 rounded-xl border border-gold/40 shadow-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            >
              <Layers className="w-4 h-4" />
              <span className="text-[10px] font-mono hidden sm:inline">
                {tileStyle === 'osm' ? 'Standard Map' : 'Voyager Map'}
              </span>
            </button>

            {/* Recenter Button */}
            <button
              type="button"
              onClick={() => {
                if (mapInstanceRef.current) {
                  mapInstanceRef.current.flyTo(coords, 16, { animate: true });
                }
              }}
              title="Recenter on Pin"
              className="bg-zinc-950/90 hover:bg-zinc-900 text-white p-2 rounded-xl border border-gold/40 shadow-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            >
              <RotateCcw className="w-4 h-4 text-gold" />
              <span className="text-[10px] font-mono hidden sm:inline">Center Pin</span>
            </button>
          </div>

          {/* Recenter / GPS Floating Action inside Map */}
          <button
            type="button"
            onClick={handleAutoDetectGPS}
            title="Locate Live GPS"
            className="absolute bottom-3 right-3 z-[400] bg-gold hover:bg-gold-hover text-black px-3 py-2 rounded-xl border border-white/40 shadow-2xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold active:scale-95"
          >
            <Navigation className="w-4 h-4 fill-black" />
            <span>Locate Me</span>
          </button>

          {/* Live Status Overlay when Geocoding */}
          {isReverseGeocoding && (
            <div className="absolute top-3 left-3 z-[400] bg-zinc-950/90 border border-gold/40 text-gold text-xs px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-lg animate-pulse">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Fetching exact street & building details...</span>
            </div>
          )}
        </div>
      </div>

      {/* Status Feedback Notice */}
      {statusMessage && (
        <div className={`text-xs p-3.5 rounded-xl border font-mono flex items-start gap-2.5 transition-all ${
          statusType === 'success' 
            ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' 
            : statusType === 'warning' 
            ? 'bg-amber-950/30 border-amber-500/40 text-amber-300' 
            : 'bg-zinc-900/70 border-gold/30 text-zinc-200'
        }`}>
          {statusType === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <Sparkles className="w-4 h-4 text-gold shrink-0 mt-0.5" />
          )}
          <span className="leading-relaxed font-sans text-xs">{statusMessage}</span>
        </div>
      )}

      {/* Auto-filled Structured Address Fields */}
      <div className="space-y-4 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-gold font-bold flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-gold" />
            Verified Doorstep Address Details
          </span>
          <span className="text-[11px] text-zinc-400 font-mono">Auto-populates from Live Map</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          {/* Flat/Room */}
          <div className="sm:col-span-3 space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block font-semibold">
              Flat / Room / Villa / Suite *
            </label>
            <input
              required
              type="text"
              value={flatNo}
              onChange={(e) => setFlatNo(e.target.value)}
              placeholder="e.g. Room 302 / Villa 4"
              className="w-full bg-zinc-900/80 border border-border/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-gold transition-all"
            />
          </div>

          {/* Building Name */}
          <div className="sm:col-span-5 space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block font-semibold">
              Building / Hotel / Resort / Society *
            </label>
            <input
              required
              type="text"
              value={buildingName}
              onChange={(e) => setBuildingName(e.target.value)}
              placeholder="e.g. Taj Fort Aguada / W Goa / Sea Breeze Resort"
              className="w-full bg-zinc-900/80 border border-border/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-gold transition-all"
            />
          </div>

          {/* Pincode */}
          <div className="sm:col-span-4 space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block font-semibold">
              Pincode / Zip Code *
            </label>
            <input
              required
              type="text"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              placeholder="e.g. 403515"
              className="w-full bg-zinc-900/80 border border-border/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-gold transition-all font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          {/* Landmark */}
          <div className="sm:col-span-4 space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block font-semibold">
              Nearby Landmark *
            </label>
            <input
              required
              type="text"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder="e.g. Near Candolim Beach Road"
              className="w-full bg-zinc-900/80 border border-border/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-gold transition-all"
            />
          </div>

          {/* Locality */}
          <div className="sm:col-span-5 space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block font-semibold">
              Locality / Beach / Area *
            </label>
            <input
              required
              type="text"
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              placeholder="e.g. Candolim, North Goa"
              className="w-full bg-zinc-900/80 border border-border/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-gold transition-all"
            />
          </div>

          {/* City Selector */}
          <div className="sm:col-span-3 space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block font-semibold">
              Service City *
            </label>
            <select
              required
              value={city}
              onChange={(e) => handleCityChange(e.target.value)}
              className="w-full bg-zinc-900/80 border border-border/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-gold transition-all cursor-pointer appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23D4AF37' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                backgroundSize: '14px'
              }}
            >
              <option value="Goa">Goa (All North &amp; South Areas)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Discretion & Privacy Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900/40 p-3.5 rounded-xl border border-border/20 text-xs text-zinc-400">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-gold shrink-0 mt-0.5" />
          <span>
            Pin coordinates are securely formatted into private Google Maps navigation links for the therapist and never shared or logged publicly.
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 text-gold font-mono text-[10px] uppercase font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>100% Private Doorstep Service</span>
        </div>
      </div>
    </div>
  );
}
