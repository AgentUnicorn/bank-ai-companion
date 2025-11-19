# Contributing to the AI Banking Companion

Thank you for your interest in contributing to the AI Banking Companion project. This document provides guidelines to ensure a smooth and consistent development process.

---

## 1. Core Principles

### 1.1. AI Persona and Scope
The AI's persona is that of a professional, secure, and helpful banking assistant. Its knowledge and responses must be strictly limited to banking functions and information relevant to the user's account. This is a critical security and branding requirement. The system prompts in `useGemini.ts` and `useLiveSession.ts` are the source of truth for this behavior.

### 1.2. Security-First Operations
Any action that initiates a financial transaction (e.g., transferring money) **must** be handled via a Gemini tool call (`FunctionDeclaration`). The AI is not permitted to perform the final action itself; it may only pre-fill information and present it to the user for explicit confirmation via the UI. This is a fundamental security principle.

### 1.3. Code and Feature Removal
Legacy code, components, or data related to previous themes (e.g., companions, games, lottery) should be considered deprecated. When modifying a related area, please remove any unused legacy code to keep the codebase clean and focused on the banking theme.

---

## 2. Code Structure & Architecture

### 2.1. Modular Architecture
The current code structure, which separates logic into hooks (`/hooks`), components (`/components`), and utilities (`/utils`), must be maintained. `App.tsx` should remain a lean coordinator of state and components. All new logic should be properly modularized.

### 2.2. Single Responsibility Principle (SRP)
Every file, component, and hook should have a single, well-defined purpose.
- **Components:** Primarily focus on rendering UI and handling user events.
- **Hooks:** Manage a specific piece of state or self-contained logic (e.g., API calls, session management).
- **Utilities:** Contain pure, reusable functions that are not tied to React's lifecycle.

---

## 3. UI & UX Conventions ("Cyan Future" Design System)

All new UI components must adhere to the established "Cyan Future" design system to maintain visual consistency.

### 3.1. Color Palette
- **Background:** Light gray (`#F3F4F6` / `bg-gray-100`).
- **Surfaces:** White (`bg-white`) for primary surfaces and semi-transparent white with a background blur (`bg-white/80 backdrop-blur-xl`) for modals.
- **Borders:** Subtle light gray (`border-gray-200`).
- **Text:** Dark gray (`#1F2937` / `text-gray-800`) for primary text, medium gray (`#6B7281` / `text-gray-500`) for secondary.
- **Accents:**
  - **Primary:** Vibrant Cyan (`#06b6d4` / `cyan-500`) for all interactive elements, highlights, and focus rings.
  - **Destructive:** Rose/Red (`#F43F5E` / `rose-500`) for stop/close actions or alerts.

### 3.2. Typography
- **Font Family:** `Plus Jakarta Sans`, sans-serif.
- **Weights:** Use `font-normal` (400), `font-medium` (500), and `font-semibold` (600).
- **Headings:** Apply `tracking-wide` for a clean, modern look.

### 3.3. Layout & Shapes
- **Rounding:** Use rounded corners (`rounded-lg`, `rounded-xl`, `rounded-full`) for a soft, modern aesthetic.
- **Glow Effects:** Use `icon-glow` and `text-glow` styles sparingly on the primary AI character to indicate an active state.

---

## 4. Development and Debugging

### 4.1. Component Identification
To facilitate clear communication and debugging, all significant UI components and interactive elements **MUST** have a unique `id` attribute.
- **Naming Convention:** Use `kebab-case` (e.g., `transfer-modal`, `confirm-transfer-button`).
- **Purpose:** This allows developers and testers to precisely identify components when discussing changes or reporting issues.

### 4.2. Debug Mode (`Ctrl + E`)
A built-in debug mode is available to visualize component IDs directly on the UI.
- **Activation:** Press `Ctrl + E` to toggle the debug overlay on and off.
- **Functionality:** When active, a transparent overlay is rendered on top of the entire application. This overlay scans the DOM and displays a small, floating red label next to every element that has an `id`. This is a non-intrusive way to identify components without affecting the application's layout or styling.
