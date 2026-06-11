# Tabbed Content Section

A premium, production-ready tabbed content UI component built with modern web standards. Designed for dashboards, product pages, documentation interfaces, and SaaS platforms where organized content presentation is critical.

---

## 📌 Overview

The Tabbed Content Section is a reusable UI component that enables users to navigate between multiple content panels seamlessly. It features smooth transitions, active state highlighting, and a sliding indicator that follows user interactions. Built with performance and accessibility in mind, this component demonstrates professional-grade DOM manipulation, event handling, and state management using vanilla JavaScript.

**Use Cases:**
- Product feature showcases
- Documentation navigation
- Dashboard widget organization
- Multi-step form flows
- Settings panels
- FAQ sections

---

## 🖼️ Preview

Screenshots demonstrating different active states and content switching:

![Light Mode](/assets/LightMode.png)
![Docs](/assets/Docs.png)
![Dark Mode](/assets/DarkMode.png)

---

## 🚀 Features

- **Dynamic Tab Switching** — Seamless content transitions with sliding indicator
- **Active State Highlighting** — Visual feedback for selected tabs with smooth animations
- **Content Rendering** — Efficient DOM updates using `requestAnimationFrame`
- **Smooth UI Interactions** — Micro-animations for hover, click, and focus states
- **Responsive Design** — Mobile-first approach with Tailwind CSS utilities
- **Dark/Light Theme** — Class-based theme toggle with smooth transitions
- **Form Validation** — Client-side validation with regex patterns and length limits
- **Documentation Drawer** — Slide-out panel for additional content
- **Feedback Toasts** — Non-intrusive success/error notifications
- **Accessibility Support** — ARIA attributes, keyboard navigation, and `prefers-reduced-motion`
- **Performance Optimized** — Minimal re-renders, event delegation, and CSS animations
- **Scalable Structure** — Easy to add new tabs and content panels

---

## 🛠️ Tech Stack

- **HTML5** — Semantic markup with ARIA attributes
- **Tailwind CSS (CLI)** — Utility-first CSS framework v3.4.17
- **JavaScript (Vanilla)** — ES6+ with no framework dependencies
- **DOM Manipulation** — Efficient querySelector and event handling
- **CSS Animations** — Hardware-accelerated transitions and keyframes

---

## 📂 Project Structure

```
Tabbed_Content_Section/
├── dest/
│   └── output.css          # Compiled and minified CSS
├── src/
│   └── input.css           # Source Tailwind CSS with custom components
├── index.html              # Main HTML structure
├── script.js               # JavaScript logic for tabs, forms, and UI
├── tailwind.config.js      # Tailwind configuration
├── package.json            # Dependencies and build scripts
└── README.md               # Documentation
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Tabbed_Content_Section
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build Tailwind CSS**
   ```bash
   npm run build:css
   ```

   For development with auto-rebuild:
   ```bash
   npm run watch:css
   ```

4. **Open in browser**
   ```bash
   # Simply open index.html in your browser
   # Or use a local server:
   npx serve .
   ```

---

## 🧠 Key Learnings & Highlights

### DOM Manipulation
- Efficient element selection using `querySelector` and `querySelectorAll`
- Dynamic class toggling for state management
- CSS.escape for safe selector construction

### Event Handling
- Event delegation for scalable interaction handling
- `requestAnimationFrame` for smooth animations
- Proper event cleanup with `{ once: true }`

### State Management
- Tab state tracking with `aria-selected` attributes
- Form submission state to prevent duplicate submissions
- Theme persistence with class-based toggling

### UI Component Structuring
- Semantic HTML with proper ARIA roles (`tablist`, `tabpanel`, `tab`)
- Separation of concerns (structure, style, behavior)
- Reusable component patterns

### Active State Handling
- Sliding indicator that tracks active tab position
- CSS transitions for smooth state changes
- Visual feedback with hover and active states

### Clean & Reusable Logic
- Modular IIFE patterns for initialization
- Validation utilities with regex patterns
- Truncation functions for input sanitization

---

## 🛡️ Performance & Code Quality

### Minimal DOM Re-renders
- Content panels use `hidden` attribute instead of removing from DOM
- Batched class updates to reduce layout thrashing
- CSS-based animations for GPU acceleration

### Efficient Event Listeners
- Single event listener for tab navigation
- Event delegation for dynamic elements
- Proper cleanup to prevent memory leaks

### Clean & Modular JavaScript
- IIFE patterns to avoid global scope pollution
- Clear function separation (validation, UI, navigation)
- Descriptive variable naming and comments

### Optimized Tailwind Usage
- Custom component classes in `@layer components`
- JIT compilation for smaller bundle size
- Dark mode variants with custom color palette

### Maintainable Code Structure
- Logical file organization
- Consistent code style
- Comprehensive inline documentation

---

## 📱 Responsiveness

The component is fully responsive and works seamlessly across:

- **Mobile** (< 640px) — Stacked layout with touch-friendly targets
- **Tablet** (640px - 1024px) — Optimized spacing and typography
- **Desktop** (> 1024px) — Full-featured layout with hover states

---

## 📌 Future Improvements

- **Keyboard Navigation** — Full arrow key and Tab/Shift+Tab support
- **ARIA Enhancements** — Live regions for dynamic content updates
- **Animated Transitions** — Slide/fade effects between tab panels
- **Dynamic Data Loading** — API-based content fetching with loading states
- **Component Extraction** — Web Component or React/Vue wrapper
- **Persistence** — Remember last active tab across sessions
- **Analytics Integration** — Track tab engagement metrics
- **i18n Support** — Multi-language content switching

---

## 👨‍💻 Author

**Krish**

Built with ❤️ and Code

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

Feel free to use, modify, and distribute in your personal and commercial projects.

---

## 🧩 Internship Note

Built as part of a hands-on internship, emphasizing real-world problem solving, performance optimization, and modern UI/UX practices.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📞 Support

For questions or issues, please open an issue on the repository.

---

**Built with modern web standards and best practices.**
