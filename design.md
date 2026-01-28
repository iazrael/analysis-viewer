# Homework Analysis Viewer - Technical Design

## 1. Overview
The goal is to build a React application that parses a specific JSON structure related to student homework analysis. The core feature is rendering text fields containing LaTeX mathematics (delimited by `$`) using the KaTeX library.

## 2. Architecture

### 2.1 Component Structure
*   **App (Root)**: Manages the global state (input content, parse mode).
    *   **State Persistence**: Uses `localStorage` to save `inputContent` and `mode` automatically.
    *   **Mode Switcher**: Toggles between 'JSON' and 'Text' modes.
*   **Layout**: A two-column layout (on desktop).
    *   **InputPanel**: A text area for the user to paste/edit content.
    *   **PreviewPanel**: The main display area.
*   **AnalysisViewer**: The container for visualizing parsed JSON data.
    *   **HeaderSection**: Displays `homework_title` (supports LaTeX).
    *   **QuestionCard**: A repeated component for each item in `wrong_questions`.
*   **MarkdownWithLatex**: Renders string input using `react-markdown` and `remark-gfm` for structure, injecting `LatexText` logic for text nodes to support math.

### 2.2 LatexText Component (Core Utility)
*   **Responsibility**: Takes a string input, detects LaTeX patterns, and renders them using `katex`.
*   **Logic**:
    *   `renderLatexToFragment(text)`: Exported utility that performs the actual regex splitting and KaTeX rendering.
    1.  **Primary Pass**: Split by explicit delimiters `(\$[^$]+\$)`.
    2.  **Secondary Pass (Heuristic)**: For text segments not wrapped in `$`, detect implicit math patterns.
        *   **Pattern**: Sequences containing numbers, geometry variables, LaTeX commands (`\times`, `\div`, `\pi`, etc.), and operators (`=`, `+`, `-`).
    3.  Render math segments using `katex.renderToString`.
*   **Usage**: Used directly in JSON viewer (preserving newlines manually) and via helper in Markdown renderer.

### 2.3 Data Schema (TypeScript Interfaces)
We will define strict interfaces matching the provided JSON to ensure type safety.
*   `AnalysisData`
*   `WrongQuestion`

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
*   `react-markdown`, `remark-gfm`: For Text/Markdown mode rendering.

## 5. Error Handling
*   If `JSON.parse` fails, the App will display a friendly error message in the preview area indicating syntax errors.
*   **Compatibility**: The viewer handles two JSON structures:
    1. Standard: `{ "analysis": { ... } }`
    2. Flat: `{ "homework_title": "...", "wrong_questions": [...] }` (direct analysis object)
