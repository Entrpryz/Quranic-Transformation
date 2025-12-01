# 📖 Quranic Transformation - Digital Syllabus & Study Companion

![Project Banner](https://img.shields.io/badge/Status-Active-emerald) ![Next.js](https://img.shields.io/badge/Next.js-16.0-black) ![React](https://img.shields.io/badge/React-19.0-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38bdf8)

**Quranic Transformation** is a modern, interactive web application designed to facilitate the study of a comprehensive Islamic syllabus. It serves as a digital companion for students, allowing them to browse lessons, access study materials (PDFs), write personal reflections, and track their progress.

---

## 🚀 Features

- **📚 Interactive Syllabus**: Browse a structured curriculum of 28+ lessons covering Foundations, Iman, Character, and Social Life.
- **🔍 Smart Search & Filter**: Instantly find lessons by topic, Surah, or category.
- **📝 Personal Reflections**: Write and save notes for each lesson. Supports **Urdu** and **English** typing modes.
- **💾 Offline Tracking**: Mark lessons as "Downloaded" to track your offline study progress.
- **📄 Integrated PDF Viewer**: Read lesson presentations directly within the app without leaving the interface.
- **🌙 Premium Dark Mode**: A beautiful, eye-friendly dark interface designed for focused reading.
- **📱 Fully Responsive**: Optimized experience for Mobile, Tablet, and Desktop devices.

---

## 🛠️ Tech Stack

This project is built with the latest web technologies for performance and scalability:

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Components**: [Radix UI](https://www.radix-ui.com/) (Headless accessible components)
- **State**: React Hooks (`useState`, `useReducer`) + LocalStorage for persistence.

---

## 📂 Project Structure

For a detailed technical breakdown, please refer to:

- [Architecture Guide](docs/ARCHITECTURE.md)
- [Auth Module Documentation](docs/AUTH_MODULE.md)

```bash
src/
├── app/                 # Main Application Logic
├── components/          # UI Components (LessonCard, Sidebar, etc.)
└── lib/                 # Data Constants & Utilities
```

---

## ⚡ Getting Started

Follow these steps to set up the project locally:

### Prerequisites

- Node.js 18+ installed.
- npm, yarn, or pnpm.

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/yourusername/quranic-transformation.git
    cd quranic-transformation
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Run the development server:**

    ```bash
    npm run dev
    ```

4.  **Open the app:**
    Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📖 Usage Guide

### Browsing Lessons

- Use the **Sidebar** to filter lessons by category (e.g., "Foundations").
- Use the **Search Bar** at the top to find specific topics or Surahs.

### Studying

1.  Click on a **Lesson Card** to view details.
2.  Click **"Read PDF"** to view the presentation slides.
3.  Click **"Add Reflection"** to open the note editor.
4.  Toggle **"Urdu Mode"** in the editor if you wish to write in Urdu.

### Managing Progress

- Click **"Download"** (or the download icon) to mark a lesson as available offline.
- Switch to the **"Offline Library"** view in the sidebar to see only your downloaded lessons.
- Switch to **"My Reflections"** to see lessons where you have added notes.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

_Developed with ❤️ for the students of the Quran._
