# 💌 Birthday Letter Contribution Website

A dedicated, decoupled Letter Contribution & Scrapbook Generation module built for the Birthday Project.

---

## 🌟 Key Features

1. **Contributor Portal (`/`)**:
   - Clean, minimal, distraction-free submission form.
   - Strict **150-word cap** with live word counter (`X / 150 words`).
   - Multiple image uploader with drag-and-drop support (up to 15 photos).
   - Image validation, automatic WebP optimization, aspect-ratio extraction, and collision-free storage via Sharp.
   - Warm post-submission confirmation card with zero design leakage.

2. **Admin Portal (`/admin`)**:
   - Secure server-side authentication (Initial password: `chaithu061013` hashed with bcrypt, JWT in httpOnly cookie).
   - Metrics overview (Total received, Published, Pending, Total Photos).
   - Submission inspector (raw message text, word counts, high-res photos).
   - **Automatic Letter Generator**: Generates beautiful scrapbook layouts with non-colliding photo orbits and vintage themes.
   - **Regenerate Design 🎲**: Remixes photo arrangements, tape colors, stamps, and themes while preserving contributor data.
   - **Live Preview & Mobile Viewport Simulator**: Preview final rendering before publishing.
   - **Publish / Unpublish Toggle**: Controls visibility in the public API.

3. **Emotional Scrapbook Letter Renderer (`/letters/:id`)**:
   - Emotional, warm, personal, birthday-themed scrapbook page.
   - 6 aesthetic themes (Vintage Scrapbook, Pastel Dream, Golden Nostalgia, Midnight Confetti, Botanical Journal, Retro 90s).
   - Interactive Polaroids with realistic washi tape, pins, hover physics, and click-to-zoom lightbox.
   - Interactive wax seal & confetti celebration fireworks.
   - Responsive layout: Scattered memory canvas on desktop, adaptive scrapbook stack on mobile/tablet.

4. **Integration API for Main Birthday Website**:
   - `GET /api/letters`: Public CORS-enabled endpoint returning published letters for the main website's grid.
   - `GET /api/letters/:id`: Public single letter endpoint.
   - Complete documentation in [`docs/INTEGRATION.md`](./docs/INTEGRATION.md).

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser:
- **Contributor Form**: `http://localhost:3000/`
- **Admin Dashboard**: `http://localhost:3000/admin` (Password: `chaithu061013`)

---

## 📁 Project Structure

```
d:\birthday\
├── src\
│   ├── app\
│   │   ├── page.tsx                    # Contributor Form
│   │   ├── layout.tsx                  # Root Layout & Typography
│   │   ├── letters\[id]\page.tsx       # Standalone Scrapbook Letter View
│   │   ├── admin\
│   │   │   ├── page.tsx                # Admin Dashboard
│   │   │   ├── login\page.tsx          # Admin Login
│   │   │   └── preview\[id]\page.tsx   # Live Preview & Theme Tweaker
│   │   └── api\
│   │       ├── contributions\route.ts  # Contributor Submission & Sharp Uploads
│   │       ├── admin\                  # Admin Auth, Submissions, Generator, Publish
│   │       └── letters\                # Public CORS-enabled Integration API
│   ├── components\
│   │   ├── contributor\                # ContributorForm & SuccessCard
│   │   ├── admin\                      # SubmissionDetailModal & ThemeSelectorModal
│   │   └── letter\                     # ScrapbookLetter, PolaroidPhoto, LetterCard, Lightbox
│   ├── lib\
│   │   ├── db.ts                       # Persistent Storage Repository
│   │   ├── auth.ts                     # Admin Password Verification & JWT Auth
│   │   ├── image-processor.ts          # Sharp Image Optimization & WebP Conversion
│   │   ├── themes.ts                   # 6 Scrapbook Themes
│   │   └── generator\layout-engine.ts  # Responsive Collision-Free Layout Algorithm
│   └── types\index.ts                  # TypeScript Types
├── public\uploads\                     # Stored WebP images
├── data\                               # Database JSON storage
└── docs\INTEGRATION.md                 # Main Birthday Website Integration Guide
```
