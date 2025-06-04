import WebFont from "webfontloader";

// Array of preloaded Google Fonts for selection and initial display
const PRELOADED_FONTS = [
  { family: "Inter", category: "sans-serif", variants: ["300", "400", "500", "600", "700", "800", "900"] },
  { family: "Roboto", category: "sans-serif", variants: ["300", "400", "500", "700", "900"] },
  { family: "Open Sans", category: "sans-serif", variants: ["300", "400", "500", "600", "700", "800"] },
  { family: "Poppins", category: "sans-serif", variants: ["300", "400", "500", "600", "700", "800", "900"] },
  { family: "Montserrat", category: "sans-serif", variants: ["300", "400", "500", "600", "700", "800", "900"] },
  { family: "Source Sans Pro", category: "sans-serif", variants: ["300", "400", "600", "700", "900"] },
  { family: "Merriweather", category: "serif", variants: ["300", "400", "700", "900"] },
  { family: "Playfair Display", category: "serif", variants: ["400", "500", "600", "700", "800", "900"] },
  { family: "Lato", category: "sans-serif", variants: ["300", "400", "700", "900"] },
  { family: "Nunito Sans", category: "sans-serif", variants: ["200", "300", "400", "600", "700", "800", "900"] },
  { family: "Raleway", category: "sans-serif", variants: ["300", "400", "500", "600", "700", "800", "900"] },
  { family: "Oswald", category: "sans-serif", variants: ["300", "400", "500", "600", "700"] },
  { family: "PT Serif", category: "serif", variants: ["400", "700"] },
  { family: "Lora", category: "serif", variants: ["400", "500", "600", "700"] },
  { family: "Inconsolata", category: "monospace", variants: ["300", "400", "500", "600", "700", "800", "900"] },
  { family: "Dancing Script", category: "handwriting", variants: ["400", "500", "600", "700"] },
  { family: "Caveat", category: "handwriting", variants: ["400", "500", "600", "700"] },
  { family: "Fira Code", category: "monospace", variants: ["300", "400", "500", "600", "700"] },
  { family: "Ubuntu", category: "sans-serif", variants: ["300", "400", "500", "700"] },
  { family: "Cormorant Garamond", category: "serif", variants: ["300", "400", "500", "600", "700"] },
];

// Popular font pairing suggestions using fonts from PRELOADED_FONTS
const FONT_PAIRINGS = [
  {
    heading: { family: "Playfair Display", category: "serif", variants: ["700"] },
    body: { family: "Source Sans Pro", category: "sans-serif", variants: ["400"] }
  },
  {
    heading: { family: "Montserrat", category: "sans-serif", variants: ["600"] },
    body: { family: "Merriweather", category: "serif", variants: ["400"] }
  },
  {
    heading: { family: "Poppins", category: "sans-serif", variants: ["600"] },
    body: { family: "Open Sans", category: "sans-serif", variants: ["400"] }
  },
  {
    heading: { family: "Oswald", category: "sans-serif", variants: ["700"] },
    body: { family: "Lato", category: "sans-serif", variants: ["400"] }
  },
  {
    heading: { family: "Lora", category: "serif", variants: ["700"] },
    body: { family: "Nunito Sans", category: "sans-serif", variants: ["400"] }
  }
];

// Font categories for filtering
const FONT_CATEGORIES = ["serif", "sans-serif", "display", "handwriting", "monospace"];

/**
 * Loads Google Fonts dynamically using WebFontLoader.
 * @param {Array} fontsToLoadConfig - Array of font objects, e.g., [{ family: "Roboto", variants: ["400", "700italic"] }]
 * @returns {Promise} Promise that resolves when fonts are loaded, or rejects on failure.
 */
const loadFonts = (fontsToLoadConfig) => {
  return new Promise((resolve, reject) => {
    if (!fontsToLoadConfig || fontsToLoadConfig.length === 0) {
      resolve(); 
      return;
    }

    const googleFontFamilies = fontsToLoadConfig
      .filter(font => font && font.family && typeof font.family === "string" && font.family.trim() !== "")
      .map(font => {
        const family = font.family.trim().replace(/ /g, "+");
        let variantsString = "";
        if (font.variants && Array.isArray(font.variants) && font.variants.length > 0) {
          const validVariants = font.variants.filter(v => typeof v === "string" && v.trim() !== "");
          if (validVariants.length > 0) {
            variantsString = `:${validVariants.join(",")}`;
          }
        }
        return `${family}${variantsString}`;
      });

    if (googleFontFamilies.length === 0) {
      if (fontsToLoadConfig && fontsToLoadConfig.length > 0) {
        console.warn("loadFonts: No valid font configurations to load after filtering. Input:", fontsToLoadConfig);
        reject(new Error("Invalid font configuration. Please check font names and variants."));
      } else {
        resolve();
      }
      return;
    }

    WebFont.load({
      google: {
        families: googleFontFamilies
      },
      active: () => {
        resolve();
      },
      inactive: () => {
        reject(new Error(`Failed to load: ${googleFontFamilies.join(", ")}. Ensure font names are correct and network is stable.`));
      },
      timeout: 5000 
    });
  });
};


/**
 * Returns the predefined list of available Google Fonts and pairings.
 * @returns {Promise} Promise with an object containing 'fonts' (list) and 'pairings'.
 */
const fetchGoogleFonts = async () => {
  // Always return the static, preloaded fonts and pairings
  return Promise.resolve({
    fonts: PRELOADED_FONTS,
    pairings: FONT_PAIRINGS
  });
};


/**
 * Generates CSS snippet for the selected fonts
 * @param {Object} headingFont - Heading font configuration
 * @param {Object} bodyFont - Body font configuration 
 * @returns {String} CSS code snippet
 */
const generateCSS = (headingFont, bodyFont) => {
  const importStatements = new Set(); 
  const cssRules = [];

  if (headingFont?.family && headingFont.family.trim() !== "") {
    const headingFontFamilyQuery = headingFont.family.replace(/ /g, "+");
    const headingWeight = headingFont.weight || "700";
    importStatements.add(
      `@import url("https://fonts.googleapis.com/css2?family=${headingFontFamilyQuery}:wght@${headingWeight}&display=swap");`
    );
    
    cssRules.push(`
h1, h2, h3, h4, h5, h6 {
  font-family: "${headingFont.family}", ${headingFont.category || "sans-serif"};
  font-weight: ${headingWeight};
  color: ${headingFont.color || "#000000"};
  font-size: ${headingFont.size || "2.5"}rem;
  line-height: ${headingFont.lineHeight || "1.2"};
}

/* Example for more specific heading styles if needed */
h1 {
  /* font-size already set above, this is an example if you need specific h1 size */
}`);
  }

  if (bodyFont?.family && bodyFont.family.trim() !== "") {
    const bodyFontFamilyQuery = bodyFont.family.replace(/ /g, "+");
    const bodyWeight = bodyFont.weight || "400";
    
    importStatements.add(
      `@import url("https://fonts.googleapis.com/css2?family=${bodyFontFamilyQuery}:wght@${bodyWeight}&display=swap");`
    );
    
    cssRules.push(`
body, p, div, span, li, a, button, input, select, textarea {
  font-family: "${bodyFont.family}", ${bodyFont.category || "sans-serif"};
  font-weight: ${bodyWeight};
  font-size: ${bodyFont.size || "1"}rem;
  line-height: ${bodyFont.lineHeight || "1.6"};
  color: ${bodyFont.color || "#333333"};
}`);
  }

  if (importStatements.size === 0 && cssRules.length === 0) {
    return "/* No fonts selected or invalid font configuration. */";
  }

  return Array.from(importStatements).join("\n") + "\n\n" + cssRules.join("\n\n");
};

/**
 * Generates HTML preview with selected fonts
 * @param {Object} headingFont - Heading font configuration
 * @param {Object} bodyFont - Body font configuration
 * @returns {String} HTML snippet
 */
const generateHTMLPreview = (headingFont, bodyFont) => {
  const headingStyle = (headingFont?.family && headingFont.family.trim() !== "")
    ? `font-family: "${headingFont.family}", ${headingFont.category || "sans-serif"}; 
       font-weight: ${headingFont.weight || "700"}; 
       color: ${headingFont.color || "#000000"};
       font-size: ${headingFont.size || "2.5"}rem;
       line-height: ${headingFont.lineHeight || "1.2"};` 
    : "font-family: sans-serif; font-weight: 700; color: #000000; font-size: 2.5rem; line-height: 1.2;"; 

  const bodyStyle = (bodyFont?.family && bodyFont.family.trim() !== "")
    ? `font-family: "${bodyFont.family}", ${bodyFont.category || "sans-serif"}; 
       font-weight: ${bodyFont.weight || "400"}; 
       color: ${bodyFont.color || "#333333"};
       font-size: ${bodyFont.size || "1"}rem;
       line-height: ${bodyFont.lineHeight || "1.6"};` 
    : "font-family: sans-serif; font-weight: 400; color: #333333; font-size: 1rem; line-height: 1.6;"; 
  
  const fontImports = new Set();
  if (headingFont?.family && headingFont.family.trim() !== "") {
    fontImports.add(`<link href="https://fonts.googleapis.com/css2?family=${headingFont.family.replace(/ /g, "+")}:wght@${headingFont.weight || "700"}&display=swap" rel="stylesheet">`);
  }
  if (bodyFont?.family && bodyFont.family.trim() !== "") {
    fontImports.add(`<link href="https://fonts.googleapis.com/css2?family=${bodyFont.family.replace(/ /g, "+")}:wght@${bodyFont.weight || "400"}&display=swap" rel="stylesheet">`);
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Font Pairing Preview</title>
  ${Array.from(fontImports).join("\n  ")}
  <style>
    body { margin: 0; padding: 2rem; max-width: 800px; margin-left: auto; margin-right: auto; }
    h1, h2, h3, h4, h5, h6 {
      ${headingStyle}
      margin-bottom: 0.5em;
    }
    body, p {
      ${bodyStyle}
      margin-bottom: 1em;
    }
  </style>
</head>
<body>
  <h1>The quick brown fox jumps over the lazy dog</h1>
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum. Donec in efficitur leo. In hac habitasse platea dictumst. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</p>
</body>
</html>`;
};

/**
 * Gets a clean font family name suitable for CSS
 * @param {String} fontFamily - The font family name
 * @returns {String} Clean font family name
 */
const getCleanFontFamily = (fontFamily) => {
  if (!fontFamily || typeof fontFamily !== "string") return "sans-serif";
  return fontFamily.trim();
};

/**
 * Gets sample text for previewing fonts
 * @param {String} type - Type of sample text ("heading" or "body")
 * @returns {String} Sample text
 */
const getSampleText = (type = "heading") => {
  const headingSamples = [
    "The quick brown fox jumps over the lazy dog",
    "Typography is what language looks like",
    "Good design is invisible",
    "Crafting digital experiences",
    "Design is intelligence made visible"
  ];
  const bodySamples = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum. Donec in efficitur leo. Maecenas vel ante ut enim mollis finibus. Aliquam tincidunt, magna a vestibulum cursus, magna nisi tincidunt orci, eu lobortis sem purus in diam.",
    "Effective typography is a cornerstone of compelling design. It guides the reader, establishes hierarchy, and conveys personality. Choosing the right fonts can transform a simple message into a powerful statement.",
    "Consider the context in which your typography will be used. Is it for a bold headline, an easy-to-read paragraph, or a subtle caption? Each requires a different typographic approach to achieve its purpose."
  ];

  if (type === "heading") {
    return headingSamples[Math.floor(Math.random() * headingSamples.length)];
  } else {
    return bodySamples[Math.floor(Math.random() * bodySamples.length)];
  }
};

export {
  loadFonts,
  fetchGoogleFonts,
  generateCSS,
  generateHTMLPreview,
  getCleanFontFamily,
  getSampleText,
  PRELOADED_FONTS,
  FONT_PAIRINGS,
  FONT_CATEGORIES
};