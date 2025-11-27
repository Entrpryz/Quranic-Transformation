# Architecture & Codebase Guide

This document provides a comprehensive technical overview of the **Quranic Transformation** project. It is designed to help developers understand the project structure, data flow, and core logic.

## 🏗️ Project Structure

The project follows the standard **Next.js App Router** architecture.

```
src/
├── app/                 # App Router pages and layouts
│   ├── layout.tsx       # Root layout (fonts, metadata)
│   ├── page.tsx         # Main application logic (Dashboard)
│   └── globals.css      # Global styles and Tailwind directives
├── components/          # Reusable UI components
│   ├── ui/              # Shadcn/Radix UI primitives
│   ├── LessonCard.tsx   # Display card for individual lessons
│   ├── LessonDetail.tsx # Modal for lesson details & actions
│   ├── NoteEditor.tsx   # Text editor for reflections
│   ├── PdfViewer.tsx    # Embedded PDF viewer
│   └── Sidebar.tsx      # Navigation and filtering sidebar
└── lib/                 # Utilities and Constants
    ├── constants.ts     # Static data (Syllabus) & Types
    └── utils.ts         # Helper functions (Tailwind merge)
```

## 🧠 Core Logic & State Management

The application logic is centralized in `src/app/page.tsx` but modularized through components.

### 1. State Management (`page.tsx`)

The app uses React's `useState` for local state and `localStorage` for persistence.

- **View State**: `view` ('home' | 'notes' | 'downloads') controls the main content area.
- **Data State**:
  - `notes`: A record of user reflections indexed by lesson ID.
  - `downloadedIds`: A Set of lesson IDs marked as "downloaded" (simulated for offline tracking).
- **Persistence**: `useEffect` loads data from `localStorage` on mount (`qt_notes_v3`, `qt_downloads`).

### 2. Data Model (`lib/constants.ts`)

The application relies on a static data file acting as a "database".

**`Lesson` Interface:**

- `id`: Unique identifier.
- `topicName`: Main title of the lesson.
- `surahReference`: Quranic source.
- `presentationLink`: Google Drive link for the PDF.
- `part`: Category (e.g., "Foundations", "Iman & Aqeedah").

**`Note` Interface:**

- `content`: User's reflection text.
- `isUrdu`: Flag for RTL text direction.
- `lastModified`: Timestamp.

### 3. Component Deep Dive

#### `LessonDetail.tsx`

This component handles the interaction layer for a selected lesson.

- **Features**: Displays detailed info, handles PDF opening, and manages "Download" status.
- **Logic**: It uses a `Dialog` (modal) to present information without navigating away from the dashboard.

#### `NoteEditor.tsx`

A focused writing environment.

- **Features**: Supports Urdu (RTL) and English (LTR) typing modes.
- **Logic**: Updates the parent state in `page.tsx` upon saving, which then persists to `localStorage`.

#### `PdfViewer.tsx`

Embeds Google Drive PDFs directly into the app.

- **Implementation**: Uses an `iframe` with the Google Drive preview URL.

## 🎨 Design System

- **Tailwind CSS**: Used for all styling.
- **Radix UI**: Provides accessible primitives (Dialog, Tabs, etc.).
- **Theme**: A custom dark mode theme with Emerald/Teal accents to reflect the Islamic nature of the content.
- **Responsiveness**: Fully responsive design with a mobile sidebar and adaptive grids.

## 🔍 Filtering & Search Logic

The `filteredData` memoized value in `page.tsx` is the heart of the content display.

1.  **View Filter**: Filters by "All", "My Reflections" (has notes), or "Offline Library" (downloaded).
2.  **Category Filter**: Filters by `part` (e.g., "Social Life").
3.  **Search**: Performs a case-insensitive search across `topicName`, `surahName`, and `urduTitle`.
