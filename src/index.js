import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import WebFont from "webfontloader";

// Initialize WebFontLoader to load initial set of fonts
WebFont.load({
  google: {
    families: [
      "Playfair Display:400,700",
      "Source Sans Pro:400,600,700",
      "Inter:400,500,600,700",
      "Merriweather:400,700",
      "Montserrat:400,500,600,700",
      "Open Sans:400,600,700",
      "Poppins:400,500,600,700",
      "Roboto:400,500,700"
    ]
  }
});

// Create a root for React to render into
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the App component
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);