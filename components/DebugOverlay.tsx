/**
 * DebugOverlay Component
 * 
 * A reusable, non-intrusive overlay for visualizing DOM element IDs. When active, it scans
 * the DOM for all elements with an `id` attribute and displays a floating label next to each one.
 * It's designed to be completely separate from the main app's styling and layout, preventing
 * any visual glitches.
 * 
 * --- HOW TO SET UP IN A NEW PROJECT ---
 * 
 * 1.  **Add the component file:**
 *     Copy this `DebugOverlay.tsx` file into your project's `components` directory.
 * 
 * 2.  **Integrate into your main App component (e.g., `App.tsx`):**
 *     a. Import the component:
 *        `import DebugOverlay from './components/DebugOverlay';`
 * 
 *     b. Manage a state for debug mode:
 *        `const [isDebugMode, setIsDebugMode] = useState(false);`
 * 
 *     c. Set up a keyboard shortcut (e.g., Ctrl+E) to toggle the state:
 *        ```
 *        useEffect(() => {
 *          const handleKeyDown = (event: KeyboardEvent) => {
 *            if (event.ctrlKey && event.key === 'e') {
 *              event.preventDefault();
 *              setIsDebugMode(prev => !prev);
 *            }
 *          };
 *          window.addEventListener('keydown', handleKeyDown);
 *          return () => {
 *            window.removeEventListener('keydown', handleKeyDown);
 *          };
 *        }, []);
 *        ```
 * 
 *     d. Conditionally render the component at the top level of your app's return statement:
 *        ```
 *        return (
 *          <div id="app-container">
 *            {isDebugMode && <DebugOverlay />}
 *            
 *            // ... rest of your application components ... 
 *        );
 *        ```
 * 
 * 3.  **Ensure elements have IDs:**
 *     For the overlay to be useful, your components must have `id` attributes (e.g., `<button id="submit-button">...`).
 */
// FIX: Corrected malformed JSX and invalid syntax throughout the component's return statement.
// This resolves the parsing error that prevented the file from being recognized as a module and caused numerous subsequent errors.
import React, { useState, useLayoutEffect } from 'react';

interface LabelInfo {
  id: string;
  top: number;
  left: number;
}

const DebugOverlay: React.FC = () => {
  const [labels, setLabels] = useState<LabelInfo[]>([]);

  const updateLabels = () => {
    const elementsWithId = document.querySelectorAll<HTMLElement>('[id]');
    const newLabels: LabelInfo[] = [];
    elementsWithId.forEach(el => {
      // Exclude the overlay's own elements from being labeled
      if (el.id.startsWith('debug-overlay')) return;

      const rect = el.getBoundingClientRect();
      // Only show labels for visible elements
      if (rect.width > 0 && rect.height > 0 && rect.top < window.innerHeight && rect.bottom > 0) {
        newLabels.push({
          id: el.id,
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
        });
      }
    });
    setLabels(newLabels);
  };

  useLayoutEffect(() => {
    // A small delay to ensure the UI has settled before the first scan
    const initialTimeout = setTimeout(updateLabels, 50);

    const handleResize = () => updateLabels();
    window.addEventListener('resize', handleResize);

    // Use a mutation observer to detect when the DOM changes (e.g., modals opening)
    const observer = new MutationObserver(updateLabels);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });


    return () => {
      clearTimeout(initialTimeout);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      id="debug-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none', // Allow clicks to pass through the overlay itself
        zIndex: 99999,
      }}
    >
      {labels.map(({ id, top, left }) => (
        <div
          key={id}
          id={`debug-overlay-label-${id}`}
          style={{
            position: 'absolute',
            top: `${top}px`,
            left: `${left}px`,
            backgroundColor: 'rgba(255, 0, 0, 0.85)',
            color: 'white',
            padding: '1px 4px',
            fontSize: '10px',
            fontFamily: 'monospace',
            whiteSpace: 'nowrap',
            borderRadius: '3px',
            lineHeight: '1.2',
            // Ensure the label itself doesn't capture mouse events, just in case
            pointerEvents: 'none', 
          }}
        >
          {id}
        </div>
      ))}
    </div>
  );
};

export default DebugOverlay;
