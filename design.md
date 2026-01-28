# Homework Analysis Viewer - Technical Design

## 1. Overview
The goal is to build a React application that parses a specific JSON structure related to student homework analysis. The core feature is rendering text fields containing LaTeX mathematics (delimited by `$` or `$$`) using the KaTeX library.

## 2. Architecture

### 2.1 Component Structure
*   **App (Root)**: Manages the global state (input content, parse mode).
    *   **State Persistence**: Uses `localStorage` to save `inputContent` and `mode` automatically.
    *   **Mode Switcher**: Toggles between 'JSON' and 'Text' modes.
*   **Layout**: A two-column layout (on desktop).
    *   **InputPanel**: A text area for the user to paste/edit content.
    *   **PreviewPanel**: The main display area.
*   **AnalysisViewer**: The container for visualizing parsed JSON data.
    *   **Core Logic**: Handles the `analysis` field from the JSON.
    *   **Behavior**: If `analysis` is a string, it renders it as Markdown with LaTeX support.
*   **MarkdownWithLatex**: A reusable component that renders string content using `react-markdown`.
    *   **Pipeline**: 
        1.  Pre-process: Replace literal `\n` with real newlines.
        2.  `remark-math`: Identifies `$$...$$` and `$...$` blocks as math nodes, preventing them from being split by line breaks.
        3.  `remark-gfm`: Tables, strikethrough, etc.
        4.  `remark-breaks`: Converts soft line breaks (newlines) to `<br>`, but ignores math blocks.
        5.  `rehype-katex`: Renders the identifiable math nodes to HTML using KaTeX.
        6.  **Implicit Math**: Custom logic in the `components` prop intercepts text nodes in paragraphs/lists to detect and render "implicit" math (math without delimiters) using `LatexText`.

### 2.2 LatexText Component (Core Utility)
*   **Responsibility**: Takes a string input, detects LaTeX patterns, and renders them using `katex`.
*   **Logic**:
    *   `renderLatexToFragment(text)`: Exported utility.
    *   **Primary Use**: Handling *implicit* math (e.g., `1+2=3` or `△ABC`) found in plain text nodes that `remark-math` didn't catch.
    *   **Legacy Support**: Can still handle explicit `$$` or `$` if `remark-math` is disabled or misses something, but primarily acts as a fallback now.

### 2.3 Data Schema
*   `AnalysisRoot`: `{ analysis: string, thinking?: string }`
    *   The `analysis` field is now a single string containing Markdown formatted text.

## 3. Styling
*   **Framework**: Tailwind CSS.
*   **Theme**: Academic/Clean.
    *   Backgrounds: `bg-slate-50` for the app, `bg-white` for cards.
    *   Typography: `text-slate-900` for headings, `text-slate-700` for body.
    *   Accents: `blue-600` for primary elements, `red-500` for errors.

## 4. Dependencies
*   `react`, `react-dom`: UI library.
*   `katex`: Math rendering engine.
*   `lucide-react`: Icons for UI enhancement.
*   `react-markdown`, `remark-gfm`: For Markdown rendering.
*   `remark-breaks`: For rendering newlines as hard breaks.
*   `remark-math`, `rehype-katex`: For proper Markdown math parsing and rendering.
