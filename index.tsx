
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// Suppress the ResizeObserver loop limit exceeded error
if (typeof window !== 'undefined') {
  const resizeObserverError = "ResizeObserver loop completed with undelivered notifications.";
  const originalError = window.console.error;
  window.console.error = (...args) => {
    if (args[0]?.message === resizeObserverError || args[0] === resizeObserverError) {
      return;
    }
    originalError.apply(window.console, args);
  };

  window.addEventListener('error', (e) => {
    if (e.message === resizeObserverError || e.message === 'ResizeObserver loop limit exceeded') {
      e.stopImmediatePropagation();
    }
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
