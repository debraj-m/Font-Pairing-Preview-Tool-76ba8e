import React, { useState, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import {
  Disclosure,
  Transition
} from "@headlessui/react";
import {
  ChevronUpIcon,
  TagIcon,
  Bars3BottomLeftIcon,
  AdjustmentsHorizontalIcon,
  SparklesIcon,
  PaintBrushIcon,
  ArrowDownTrayIcon
} from "@heroicons/react/20/solid";
import {
  FONT_PAIRINGS,
  FONT_CATEGORIES,
  loadFonts
} from "../utils/fontUtils";

const FontControls = ({
  headingFont,
  setHeadingFont,
  bodyFont,
  setBodyFont,
  onApplyPairing,
  allAvailableFonts
}) => {
  const [showHeadingColorPicker, setShowHeadingColorPicker] = useState(false);
  const [showBodyColorPicker, setShowBodyColorPicker] = useState(false);
  const [availableFonts, setAvailableFonts] = useState(allAvailableFonts || []);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    if (allAvailableFonts && Array.isArray(allAvailableFonts)) {
      setAvailableFonts(allAvailableFonts);
    }
  }, [allAvailableFonts]);

  const filteredFonts = availableFonts.filter(font => {
    if (!font || !font.family) return false;
    return selectedCategory === "all" || font.category === selectedCategory;
  });

  const handleFontSelection = (selectedFontFamily, fontType) => {
    if (!selectedFontFamily) {
      const resetConfig = { family: "", category: "sans-serif" };
      if (fontType === "heading") {
        setHeadingFont(prev => ({ ...prev, ...resetConfig }));
      } else {
        setBodyFont(prev => ({ ...prev, ...resetConfig }));
      }
      return;
    }

    const selectedFontObject = availableFonts.find(font => font.family === selectedFontFamily);

    if (selectedFontObject) {
      const newFontConfig = {
        family: selectedFontObject.family,
        category: selectedFontObject.category,
      };

      if (fontType === "heading") {
        setHeadingFont(prev => ({ ...prev, ...newFontConfig }));
      } else {
        setBodyFont(prev => ({ ...prev, ...newFontConfig }));
      }

      loadFonts([selectedFontObject]).catch(err => {
        console.error(`Error loading ${fontType} font "${selectedFontFamily}":`, err);
      });
    } else {
      console.warn(`Font "${selectedFontFamily}" was selected, but not found in the current availableFonts list.`);
    }
  };

  const handleHeadingFontChange = (e) => {
    handleFontSelection(e.target.value, "heading");
  };

  const handleBodyFontChange = (e) => {
    handleFontSelection(e.target.value, "body");
  };

  const handleApplyPairingSuggestion = (pairingSuggestion) => {
    const headingFontDetails = pairingSuggestion.heading;
    const bodyFontDetails = pairingSuggestion.body;

    if (!headingFontDetails?.family || !bodyFontDetails?.family) {
      console.error("Invalid font details in pairing suggestion:", pairingSuggestion);
      return;
    }

    loadFonts([headingFontDetails, bodyFontDetails])
      .then(() => {
        const newHeadingConfig = {
          family: headingFontDetails.family,
          category: headingFontDetails.category,
          weight: headingFontDetails.variants?.[0] || headingFont.weight || "700",
          size: headingFont.size || "2.5",
          lineHeight: headingFont.lineHeight || "1.2",
          color: headingFont.color || "#1a1a1a"
        };

        const newBodyConfig = {
          family: bodyFontDetails.family,
          category: bodyFontDetails.category,
          weight: bodyFontDetails.variants?.[0] || bodyFont.weight || "400",
          size: bodyFont.size || "1",
          lineHeight: bodyFont.lineHeight || "1.6",
          color: bodyFont.color || "#333333"
        };

        onApplyPairing({
          heading: newHeadingConfig,
          body: newBodyConfig
        });
      })
      .catch(err => {
        console.error("Error loading font pairing suggestion:", err);
      });
  };

  const ControlSection = ({ title, icon, children, defaultOpen = false }) => (
    <Disclosure as="div" className="bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-300 ease-in-out" defaultOpen={defaultOpen}>
      {({ open }) => (
        <>
          <Disclosure.Button className="flex items-center justify-between w-full px-6 py-4 text-left text-lg font-semibold text-slate-800 hover:bg-slate-50 focus:outline-none focus-visible:ring focus-visible:ring-indigo-500 focus-visible:ring-opacity-75 transition-colors">
            <div className="flex items-center">
              {icon && React.cloneElement(icon, { className: "w-6 h-6 text-indigo-600 mr-3" })}
              <span>{title}</span>
            </div>
            <ChevronUpIcon
              className={`${open ? "transform rotate-180" : ""} w-6 h-6 text-indigo-500 transition-transform duration-200`}
            />
          </Disclosure.Button>
          <Transition
            show={open}
            enter="transition-all duration-300 ease-out"
            enterFrom="transform -translate-y-2 opacity-0 max-h-0"
            enterTo="transform translate-y-0 opacity-100 max-h-screen"
            leave="transition-all duration-200 ease-in"
            leaveFrom="transform translate-y-0 opacity-100 max-h-screen"
            leaveTo="transform -translate-y-2 opacity-0 max-h-0"
          >
            <Disclosure.Panel className="px-6 pb-6 pt-2 text-sm text-slate-600 space-y-6">
              {children}
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );

  const renderFontControls = (type) => {
    const font = type === "heading" ? headingFont : bodyFont;
    const setFont = type === "heading" ? setHeadingFont : setBodyFont;
    const handleFontChange = type === "heading" ? handleHeadingFontChange : handleBodyFontChange;
    const showColorPicker = type === "heading" ? showHeadingColorPicker : showBodyColorPicker;
    const setShowColorPicker = type === "heading" ? setShowHeadingColorPicker : setShowBodyColorPicker;
    const defaultWeight = type === "heading" ? "700" : "400";
    const defaultSize = type === "heading" ? "2.5" : "1";
    const defaultLineHeight = type === "heading" ? "1.2" : "1.6";
    const defaultColor = type === "heading" ? "#1a1a1a" : "#333333";

    return (
      <div className="space-y-6">
        {/* Font Family */}
        <div className="relative">
          <select
            id={`${type}-font-family`}
            value={font.family || ""}
            onChange={handleFontChange}
            style={{ fontFamily: font.family || "inherit", fontWeight: font.weight || defaultWeight }}
            className="block w-full px-4 pt-5 pb-2 text-base text-slate-900 bg-slate-50 rounded-lg border border-slate-300 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 peer transition-colors"
          >
            <option value="" disabled className="text-slate-400">Select a font</option>
            {filteredFonts.map((f) => (
              <option key={f.family} value={f.family} style={{ fontFamily: f.family }}>
                {f.family}
              </option>
            ))}
          </select>
          <label
            htmlFor={`${type}-font-family`}
            className={`absolute text-sm text-slate-500 duration-300 transform origin-[0] start-4 z-[1] pointer-events-none bg-slate-50 px-1
                       ${font.family ? "-translate-y-3 scale-75 top-2.5" : "translate-y-0 scale-100 top-1/2 -mt-2.5"} 
                       peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:top-2.5 peer-focus:text-indigo-600`}
          >
            Font Family
          </label>
        </div>

        {/* Font Weight */}
        <div className="relative">
          <select
            id={`${type}-font-weight`}
            value={font.weight || defaultWeight}
            onChange={(e) => setFont({ ...font, weight: e.target.value })}
            className="block w-full px-4 pt-5 pb-2 text-base text-slate-900 bg-slate-50 rounded-lg border border-slate-300 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 peer transition-colors"
          >
            <option value="300">Light (300)</option>
            <option value="400">Normal (400)</option>
            <option value="500">Medium (500)</option>
            <option value="600">Semi-Bold (600)</option>
            <option value="700">Bold (700)</option>
            {type === "heading" && <option value="800">Extra Bold (800)</option>}
            {type === "heading" && <option value="900">Black (900)</option>}
          </select>
          <label
            htmlFor={`${type}-font-weight`}
            className="absolute text-sm text-slate-500 duration-300 transform -translate-y-3 scale-75 top-2.5 z-[1] origin-[0] start-4 pointer-events-none bg-slate-50 px-1 peer-focus:text-indigo-600"
          >
            Font Weight
          </label>
        </div>

        {/* Font Size */}
        <div>
          <label htmlFor={`${type}-size`} className="block text-sm font-medium text-slate-700 mb-1">
            Size: {parseFloat(font.size || defaultSize).toFixed(2)}rem
          </label>
          <input
            id={`${type}-size`}
            type="range"
            min={type === "heading" ? "1" : "0.7"}
            max={type === "heading" ? "5" : "2"}
            step={type === "heading" ? "0.1" : "0.05"}
            value={font.size || defaultSize}
            onChange={(e) => setFont({ ...font, size: e.target.value })}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
          />
        </div>

        {/* Line Height */}
        <div>
          <label htmlFor={`${type}-line-height`} className="block text-sm font-medium text-slate-700 mb-1">
            Line Height: {parseFloat(font.lineHeight || defaultLineHeight).toFixed(2)}
          </label>
          <input
            id={`${type}-line-height`}
            type="range"
            min={type === "heading" ? "0.8" : "1"}
            max={type === "heading" ? "2" : "2.5"}
            step="0.05"
            value={font.lineHeight || defaultLineHeight}
            onChange={(e) => setFont({ ...font, lineHeight: e.target.value })}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
          />
        </div>

        {/* Color Picker */}
        <div className="relative">
          <label className="block text-sm font-medium text-slate-700 mb-1">Color</label>
          <div className="flex items-center space-x-3">
            <div
              className="w-10 h-10 rounded-md border border-slate-300 cursor-pointer shadow-sm transition-transform hover:scale-105"
              style={{ backgroundColor: font.color || defaultColor }}
              onClick={() => setShowColorPicker(!showColorPicker)}
            />
            <input
              type="text"
              value={font.color || defaultColor}
              onChange={(e) => setFont({ ...font, color: e.target.value })}
              className="block w-full px-3 py-2 text-sm text-slate-900 bg-slate-50 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="#RRGGBB"
            />
          </div>
          {showColorPicker && (
            <div className="absolute z-20 mt-2 right-0 sm:left-0 sm:w-auto w-full" 
                 onMouseLeave={() => setShowColorPicker(false)}>
              <div className="p-2 bg-white rounded-lg shadow-xl border border-slate-200">
                <HexColorPicker
                  color={font.color || defaultColor}
                  onChange={(color) => setFont({ ...font, color })}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <ControlSection title="Font Options" icon={<AdjustmentsHorizontalIcon />} defaultOpen={true}>
        <div className="relative">
          <select
            id="font-category"
            className="block w-full px-4 pt-5 pb-2 text-base text-slate-900 bg-slate-50 rounded-lg border border-slate-300 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 peer transition-colors"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {FONT_CATEGORIES.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
           <label
            htmlFor="font-category"
            className="absolute text-sm text-slate-500 duration-300 transform -translate-y-3 scale-75 top-2.5 z-[1] origin-[0] start-4 pointer-events-none bg-slate-50 px-1 peer-focus:text-indigo-600"
          >
            Filter by Category
          </label>
        </div>
      </ControlSection>

      <ControlSection title="Suggested Pairings" icon={<SparklesIcon />}>
        <div className="flex flex-wrap gap-2">
          {FONT_PAIRINGS.map((pairing, index) => (
            <button
              key={index}
              className="text-xs px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 rounded-full text-indigo-700 font-medium transition-all duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
              onClick={() => handleApplyPairingSuggestion(pairing)}
              title={`Heading: ${pairing.heading.family}, Body: ${pairing.body.family}`}
            >
              {pairing.heading.family} + {pairing.body.family}
            </button>
          ))}
        </div>
      </ControlSection>

      <ControlSection title="Heading Font" icon={<TagIcon />} defaultOpen={true}>
        {renderFontControls("heading")}
      </ControlSection>

      <ControlSection title="Body Font" icon={<Bars3BottomLeftIcon />}>
        {renderFontControls("body")}
      </ControlSection>
    </div>
  );
};

export default FontControls;