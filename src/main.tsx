
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add meta tags for viewport settings
const meta = document.createElement('meta');
meta.name = 'viewport';
meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
document.getElementsByTagName('head')[0].appendChild(meta);

// Add style to prevent text selection
const style = document.createElement('style');
style.innerHTML = `
  body {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
`;
document.getElementsByTagName('head')[0].appendChild(style);

createRoot(document.getElementById("root")!).render(<App />);
