import React, { useState, useRef, useEffect } from "react";
import FontControls from "./components/FontControls";
import PreviewPanel from "./components/PreviewPanel";
import ExportPanel from "./components/ExportPanel";
import { loadFonts, fetchGoogleFonts } from "./utils/fontUtils";

const App = () => {
  const [headingFont, setHeadingFont] = useState({
    family: "Playfair Display",
    category: "serif",
    weight: "700",
    size: "2.5",
    lineHeight: "1.2",
    color: "#1a1a1a",
    variants: ["400", "700"],
  });

  const [bodyFont, setBodyFont] = useState({
    family: "Source Sans Pro",
    category: "sans-serif",
    weight: "400",
    size: "1",
    lineHeight: "1.6",
    color: "#333333",
    variants: ["400", "600", "700"],
  });

  const [allAvailableFonts, setAllAvailableFonts] = useState([]);
  const previewRef = useRef(null);
  const exportSectionRef = useRef(null); // Ref for the section containing export panel

  useEffect(() => {
    const initializeAppFonts = async () => {
      try {
        const { fonts: fetchedFonts } = await fetchGoogleFonts();
        setAllAvailableFonts(fetchedFonts || []);

        await loadFonts([
          { family: headingFont.family, variants: [headingFont.weight] },
          { family: bodyFont.family, variants: [bodyFont.weight] },
        ]);
      } catch (error) {
        console.error("Error initializing fonts in App.js:", error);
      }
    };

    initializeAppFonts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApplyPairing = (pairing) => {
    if (pairing && pairing.heading && pairing.body) {
      setHeadingFont(pairing.heading);
      setBodyFont(pairing.body);
    } else {
      console.error("Invalid pairing object received in App.js:", pairing);
    }
  };

  const handleFabClick = () => {
    exportSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans transition-all duration-300 ease-in-out">
      <header className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mb-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">
              Font Pairing Preview
            </h1>
            <p className="mt-2 text-lg text-slate-600">
              Craft and visualize stunning font combinations for your projects.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="https://fonts.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><path d="M128,128h88a88,88,0,1,1-20.11-56" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              <span className="ml-2">Browse Google Fonts</span>
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
          {/* Left Column: Controls & Export */}
          <div ref={exportSectionRef} className="xl:col-span-4 transition-all duration-300 ease-in-out">
            <div className="sticky top-8 space-y-10">
              <FontControls
                headingFont={headingFont}
                setHeadingFont={setHeadingFont}
                bodyFont={bodyFont}
                setBodyFont={setBodyFont}
                onApplyPairing={handleApplyPairing}
                allAvailableFonts={allAvailableFonts}
              />
              <ExportPanel
                headingFont={headingFont}
                bodyFont={bodyFont}
                previewRef={previewRef}
              />
            </div>
          </div>

          {/* Right Column: Preview */}
          <div className="xl:col-span-8 transition-all duration-300 ease-in-out">
            <PreviewPanel
              headingFont={headingFont}
              bodyFont={bodyFont}
              previewRef={previewRef}
            />
          </div>
        </div>
      </main>

      <footer className="max-w-screen-xl mx-auto mt-20 py-10 border-t border-slate-200">
        <div className="text-center text-sm text-slate-500">
          <p>
            Built with React & Tailwind CSS. Fonts sourced via Google Fonts API.
          </p>
          <p className="mt-1">
            Explore, experiment, and export your favorite font pairings.
          </p>
        </div>
      </footer>

      {/* Floating Action Button */}
      <button
        onClick={handleFabClick}
        className="fixed bottom-8 right-8 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-xl transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 z-50"
        aria-label="Scroll to export options"
        title="Scroll to Export Options"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><line x1="128" y1="144" x2="128" y2="32" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="216 144 216 208 40 208 40 144" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="168 104 128 144 88 104" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
      </button>
    </div>
  );
};

export default App;