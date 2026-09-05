# Birthday Letters Integration Guide

This document outlines how the **Main Birthday Website** can retrieve and display published letters from the **Letter Contribution Website**.

---

## 🌟 Integration Overview

The Letter Contribution Website is a standalone service that manages contributor submissions, image processing, automatic scrapbook layout generation, and letter publishing.

The Main Birthday Website interacts with this service purely via **HTTP REST APIs** or by linking directly to individual published letter pages.

```
+------------------------------------+
|  Letter Contribution Website       |
|  - Contributor Submission Portal   |
|  - Admin Dashboard & Generator     |
|  - Automatic Scrapbook Engine      |
+-----------------+------------------+
                  |
                  | GET /api/letters (CORS enabled)
                  v
+------------------------------------+
|  Main Birthday Website             |
|  - Birthday Letter Grid            |
|  - Links/Embeds to /letters/:id    |
+------------------------------------+
```

---

## 📡 Public API Endpoints

All public endpoints are **CORS-enabled (`Access-Control-Allow-Origin: *`)** and safe to call directly from any client-side frontend or server.

### 1. Get All Published Letters

Retrieves a list of all currently published letters for rendering in your main birthday grid.

- **Endpoint**: `GET /api/letters`
- **Authentication**: None (Public)
- **Filters**: Returns **ONLY** letters that the admin has explicitly marked as **Published**.

#### Example Request:
```bash
curl -X GET https://your-contribution-site.com/api/letters
```

#### Example Response (`200 OK`):
```json
{
  "success": true,
  "count": 2,
  "letters": [
    {
      "id": "let_aB8x9Y2kL0",
      "contributorName": "Arun Kumar",
      "letterUrl": "https://your-contribution-site.com/letters/let_aB8x9Y2kL0",
      "coverImage": "https://your-contribution-site.com/uploads/img_x8Y9q12.webp",
      "photoCount": 4,
      "wordCount": 118,
      "excerpt": "Happy Birthday! May this milestone year bring you endless happiness, good health, and joyful memories...",
      "publishedAt": "2026-09-05T18:30:00.000Z"
    },
    {
      "id": "let_k9L3mP0qR1",
      "contributorName": "Priya Sharma",
      "letterUrl": "https://your-contribution-site.com/letters/let_k9L3mP0qR1",
      "coverImage": "https://your-contribution-site.com/uploads/img_m1Q8p90.webp",
      "photoCount": 6,
      "wordCount": 94,
      "excerpt": "Wishing you the absolute happiest of birthdays! Thank you for always being such a wonderful friend...",
      "publishedAt": "2026-09-05T19:15:00.000Z"
    }
  ]
}
```

---

### 2. Get Single Published Letter Details

Retrieves the full letter content, images, and layout configuration for a specific published letter.

- **Endpoint**: `GET /api/letters/:id`
- **Authentication**: None (Public)
- **Status Codes**:
  - `200 OK`: Letter exists and is published.
  - `404 Not Found`: Letter does not exist or is unpublished/draft.

#### Example Request:
```bash
curl -X GET https://your-contribution-site.com/api/letters/let_aB8x9Y2kL0
```

#### Example Response (`200 OK`):
```json
{
  "success": true,
  "letter": {
    "id": "let_aB8x9Y2kL0",
    "contributorName": "Arun Kumar",
    "letterContent": "Happy Birthday! May this milestone year bring you endless happiness...",
    "wordCount": 118,
    "publishedAt": "2026-09-05T18:30:00.000Z",
    "images": [
      {
        "id": "img_x8Y9q12",
        "url": "https://your-contribution-site.com/uploads/img_x8Y9q12.webp",
        "width": 1920,
        "height": 1440
      }
    ],
    "layout": { ... }
  }
}
```

---

## 💻 Frontend Code Examples for Main Birthday Website

### React / Next.js Component Example

```tsx
import React, { useEffect, useState } from 'react';

interface LetterItem {
  id: string;
  contributorName: string;
  letterUrl: string;
  coverImage: string | null;
  photoCount: number;
  wordCount: number;
  excerpt: string;
  publishedAt: string;
}

const CONTRIBUTION_API_BASE = process.env.NEXT_PUBLIC_CONTRIBUTION_API_URL || 'http://localhost:3000';

export function BirthdayLettersGrid() {
  const [letters, setLetters] = useState<LetterItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLetters() {
      try {
        const res = await fetch(`${CONTRIBUTION_API_BASE}/api/letters`);
        const data = await res.json();
        if (data.success) {
          setLetters(data.letters);
        }
      } catch (err) {
        console.error('Failed to load birthday letters:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchLetters();
  }, []);

  if (loading) return <div>Loading birthday letters...</div>;

  return (
    <div className="birthday-grid">
      {letters.map((letter) => (
        <a
          key={letter.id}
          href={letter.letterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="letter-card"
        >
          {letter.coverImage && (
            <img src={letter.coverImage} alt={letter.contributorName} />
          )}
          <div className="card-body">
            <h3>{letter.contributorName}</h3>
            <p>{letter.excerpt}</p>
            <span>{letter.photoCount} photos • Read Letter 💌</span>
          </div>
        </a>
      ))}
    </div>
  );
}
```

---

## 🔒 Security & Decoupling Guarantees

1. **Unpublished Submissions are Protected**: The public API `/api/letters` will never leak draft/pending submissions or unpublished letters.
2. **Admin Credentials Hidden**: The initial admin password `chaithu061013` is never sent in frontend bundles.
3. **No Direct Component Coupling**: Integration is strictly API/URL-based, meaning changes in one project will not break the other.
