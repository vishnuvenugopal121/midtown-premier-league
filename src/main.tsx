
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { isSupabaseAvailable } from './lib/supabase'
import { StrictMode } from 'react'

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

// Render app function
const renderApp = () => {
  console.log("Rendering app, Supabase available:", isSupabaseAvailable());
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
};

// Render with slight delay to ensure all resources are loaded
// but not too long to prevent blank screen
setTimeout(renderApp, 100);
