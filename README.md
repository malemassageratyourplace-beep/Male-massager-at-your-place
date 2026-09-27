# Male Massager at Your Place 💆‍♂️✨

> **Premium, professional in-home and hotel doorstep male massage service platform.**

A full-featured, responsive web application for booking certified male massage therapy sessions directly at home, hotel, or private residences. Includes complete booking workflows, schedule management, live UPI QR generation, dynamic discounts, admin dashboard, and WhatsApp integration.

---

## 🌟 Key Features

* **Doorstep Booking Flow**: Seamless 2-step booking system with location auto-detection, hotel/room inputs, and outcall preferences.
* **Smart Profile & Schedule Selection**:
  * **Gender Identity Picker**: Male, Female, and Shemale options with discrete outcall badges.
  * **Marital Status Options**: Single, Married, Divorced, Independent Women, Single Mom, Single Lady.
  * **Interactive Date & Time Selector**: Anchored popover trays displaying smoothly above buttons with quick day presets (`Today (ASAP)`, `Tomorrow`, `Day After`) and chronological hourly time slots.
* **Flexible Payment Options**:
  * **Pay After Meeting Therapist**: Flat ₹299 travel advance booking fee, remaining balance paid in cash/UPI after therapist arrives.
  * **Full Online Payment**: ₹200 instant discount with full digital settlement.
* **Dynamic UPI QR & App Links**:
  * Real-time UPI QR code generated with exact payable amount and booking reference.
  * Direct one-tap deep links for **Google Pay**, **PhonePe**, **Paytm**, and **BHIM**.
  * Payment screenshot upload and UTR / Transaction ID verification.
* **Admin Dashboard**:
  * Passcode-protected administration area to view bookings, review client profiles, check payment receipts, and manage appointments.
* **WhatsApp Booking Confirmation**:
  * Auto-formatted WhatsApp summary message sent directly to therapist dispatch for immediate coordination.
* **Refund & Cancellation Policy**:
  * Transparent policies with an in-app refund request form.

---

## 🛠️ Tech Stack

* **Framework**: [React 19](https://react.dev/) + [Vite 6](https://vite.dev/)
* **Language**: [TypeScript](https://www.typescriptlang.org/)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
* **Icons**: [Lucide React](https://lucide.dev/)
* **Maps**: [Leaflet](https://leafletjs.com/)

---

## 🚀 Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) (version 18.0.0 or higher recommended)
* `npm` or `bun`

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/<YOUR_GITHUB_USERNAME>/male-massager-at-your-place.git
cd male-massager-at-your-place

# Install dependencies
npm install
```

### 2. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production

```bash
npm run build
```

The production-ready assets will be compiled into the `dist/` directory.

### 4. Preview Production Build

```bash
npm run preview
```

---

## 📦 How to Push and Deploy to GitHub

### Step 1: Initialize Git and Commit Your Code

```bash
# Initialize git repository
git init

# Stage all files
git add .

# Create initial commit
git commit -m "Initial commit: Male Massager at Your Place web app"
```

### Step 2: Create a New Repository on GitHub

1. Go to [github.com/new](https://github.com/new).
2. Set repository name (e.g., `male-massager-at-your-place`).
3. Set visibility to **Public** or **Private**.
4. Leave "Add a README" unchecked (we already created one).
5. Click **Create repository**.

### Step 3: Link and Push to GitHub

```bash
# Rename branch to main
git branch -M main

# Add your GitHub remote URL
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/male-massager-at-your-place.git

# Push code to GitHub
git push -u origin main
```

---

## 🌐 Deployment Options

### Option A: GitHub Pages (Recommended with GitHub Actions)

> ⚠️ **IMPORTANT: Fixing the "Blank Page" issue on GitHub Pages:**
> If you see a blank white page on GitHub Pages, it is almost always because the GitHub Pages settings are set to **"Deploy from a branch -> main / root"**. 
> Browsers cannot execute raw TypeScript (`.tsx`) files directly from the root folder!
> 
> **To fix it immediately:**
> 1. In your GitHub repository, click **Settings** (top menu).
> 2. In the left sidebar, click **Pages**.
> 3. Under **Build and deployment** > **Source**, change the dropdown to **GitHub Actions** (NOT "Deploy from a branch").
> 4. Go to the **Actions** tab in your repository and you will see the **Deploy to GitHub Pages** workflow run and publish your site with the compiled code!
> 5. Your site will be live and functional at: `https://<YOUR_GITHUB_USERNAME>.github.io/<REPO_NAME>/`.

### Option B: 1-Command Deploy with `gh-pages` Branch

If you prefer deploying via a Git branch instead of GitHub Actions:

```bash
# Automatically builds dist/ and pushes the compiled production bundle to gh-pages branch
npm run deploy
```

Then in GitHub **Settings** > **Pages**:
1. Select **Source**: `Deploy from a branch`.
2. Select **Branch**: `gh-pages` and folder `/ (root)`.
3. Click **Save**.

### Option C: Vercel (1-Click Instant Deploy)

1. Sign in to [Vercel](https://vercel.com/).
2. Click **Add New** > **Project**.
3. Import your GitHub repository.
4. Leave framework preset as **Vite** (Build command: `npm run build`, Output directory: `dist`).
5. Click **Deploy**.

### Option C: Netlify

1. Sign in to [Netlify](https://www.netlify.com/).
2. Click **Add new site** > **Import an existing project**.
3. Select GitHub and choose your repository.
4. Set Build command: `npm run build` and Publish directory: `dist`.
5. Click **Deploy site**.

---

## 🔐 Environment Variables

If you configure additional external APIs, copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable | Description |
| :--- | :--- |
| `GEMINI_API_KEY` | Optional: Gemini API Key for AI features |
| `APP_URL` | Application base hosting URL |

---

## 📄 License

Private & Proprietary. All rights reserved.
