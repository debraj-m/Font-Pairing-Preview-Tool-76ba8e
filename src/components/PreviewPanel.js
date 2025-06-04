import React, { useState } from "react";
import { getSampleText } from "../utils/fontUtils";
import { EyeIcon, DocumentTextIcon, ComputerDesktopIcon, CalendarDaysIcon, UserGroupIcon } from "@heroicons/react/20/solid";

const PreviewPanel = ({ headingFont, bodyFont, previewRef }) => {
  const [template, setTemplate] = useState("standard");
  const [sampleType, setSampleType] = useState("lorem");

  const createFontStyle = (fontConfig, defaultValues) => ({
    fontFamily: `${fontConfig?.family || defaultValues.family}, ${fontConfig?.category || defaultValues.category}`,
    fontWeight: fontConfig?.weight || defaultValues.weight,
    fontSize: `${fontConfig?.size || defaultValues.size}rem`,
    lineHeight: fontConfig?.lineHeight || defaultValues.lineHeight,
    color: fontConfig?.color || defaultValues.color,
    transition: "all 0.3s ease-in-out", // Smooth transition for font changes
  });

  const headingStyle = createFontStyle(headingFont, {
    family: "sans-serif", category: "sans-serif", weight: 700, size: 2.5, lineHeight: 1.2, color: "#111827"
  });

  const bodyStyle = createFontStyle(bodyFont, {
    family: "sans-serif", category: "sans-serif", weight: 400, size: 1, lineHeight: 1.6, color: "#374151"
  });

  const sampleTexts = {
    lorem: {
      heading: getSampleText("heading"),
      body: getSampleText("body")
    },
    article: {
      heading: "The Symphony of Type: Crafting Harmonious Font Pairings",
      body: "Typography is the art and technique of arranging type to make written language legible, readable, and appealing when displayed. It involves selecting typefaces, point sizes, line lengths, line-spacing (leading), and letter-spacing (tracking), and adjusting the space between pairs of letters (kerning). The right font pairing breathes life into content, guiding the reader\"s eye and establishing a clear visual hierarchy that enhances comprehension and engagement."
    },
    callToAction: {
      heading: "Unlock Visual Harmony: Discover Your Perfect Font Duo",
      body: "Elevate your designs from mundane to mesmerizing. Our tool empowers you to experiment with diverse font combinations, ensuring your message not only speaks but sings. Find the ideal typographic voice that resonates with your brand and captivates your audience."
    }
  };

  const currentSample = sampleTexts[sampleType];

  const renderFontInfo = (fontConfig, type) => (
    <div className="transform transition-all duration-300 hover:scale-105 p-4 bg-slate-50 rounded-lg shadow-inner">
      <h4 className="text-xs font-semibold text-indigo-700 mb-2 uppercase tracking-wider">{type} Font Details</h4>
      {fontConfig?.family && <p className="text-xs text-slate-600"><strong>Family:</strong> {fontConfig.family}</p>}
      {fontConfig?.category && <p className="text-xs text-slate-600"><strong>Category:</strong> {fontConfig.category}</p>}
      {fontConfig?.weight && <p className="text-xs text-slate-600"><strong>Weight:</strong> {fontConfig.weight}</p>}
      {fontConfig?.size && <p className="text-xs text-slate-600"><strong>Size:</strong> {fontConfig.size}rem</p>}
      {fontConfig?.lineHeight && <p className="text-xs text-slate-600"><strong>Line Height:</strong> {fontConfig.lineHeight}</p>}
      {fontConfig?.color && (
        <div className="flex items-center text-xs text-slate-600">
          <strong className="mr-1">Color:</strong>
          <span
            className="inline-block w-3 h-3 rounded-full mr-1 border border-slate-400 shadow-sm"
            style={{ backgroundColor: fontConfig.color }}
          />
          {fontConfig.color}
        </div>
      )}
    </div>
  );


  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-300 ease-in-out">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-xl font-semibold text-slate-800 flex items-center">
          <EyeIcon className="w-6 h-6 mr-2 text-indigo-600" />
          Live Preview
        </h2>

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center bg-white rounded-lg shadow-sm border border-slate-300 overflow-hidden">
            {[
              { id: "standard", label: "Standard", icon: <DocumentTextIcon className="w-4 h-4 mr-1.5" /> },
              { id: "article", label: "Article", icon: <DocumentTextIcon className="w-4 h-4 mr-1.5" /> },
              { id: "website", label: "Website", icon: <ComputerDesktopIcon className="w-4 h-4 mr-1.5" /> }
            ].map((btn, index) => (
              <button
                key={btn.id}
                className={`px-4 py-2 text-sm font-medium flex items-center transition-colors duration-150
                  ${template === btn.id ? "bg-indigo-600 text-white" : "text-slate-700 hover:bg-slate-100"}
                  ${index === 0 ? "" : "border-l border-slate-300"}`}
                onClick={() => setTemplate(btn.id)}
              >
                {btn.icon} {btn.label}
              </button>
            ))}
          </div>

          <select
            value={sampleType}
            onChange={(e) => setSampleType(e.target.value)}
            className="text-sm border-slate-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all px-3 py-2 bg-white"
          >
            <option value="lorem">Lorem Ipsum</option>
            <option value="article">Article Example</option>
            <option value="callToAction">Call to Action</option>
          </select>
        </div>
      </div>

      <div ref={previewRef} className="p-6 sm:p-10 bg-gradient-to-br from-slate-50 to-slate-100 min-h-[400px] transition-all duration-300 ease-in-out">
        {/* Standard Template */}
        {template === "standard" && (
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <h1 style={headingStyle} className="mb-6 break-words">
              {currentSample.heading}
            </h1>
            <p style={bodyStyle} className="mb-4 break-words">
              {currentSample.body}
            </p>
            <p style={bodyStyle} className="text-slate-600 break-words">
              A well-chosen font pairing like <strong style={{fontFamily: headingStyle.fontFamily, fontWeight: headingStyle.fontWeight}}>{headingFont?.family || "this heading font"}</strong> with <strong style={{fontFamily: bodyStyle.fontFamily, fontWeight: bodyStyle.fontWeight}}>{bodyFont?.family || "this body font"}</strong> can significantly enhance readability and user experience.
            </p>
          </div>
        )}

        {/* Article Template */}
        {template === "article" && (
          <article className="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <div className="mb-8 text-center">
              <h2 style={{ ...headingStyle, fontSize: `${Math.max(1, parseFloat(headingFont?.size || "2.5") * 0.5)}rem` }} className="uppercase tracking-wider text-indigo-600 mb-2">
                Typographic Insights
              </h2>
              <h1 style={headingStyle} className="mb-4 break-words">
                {currentSample.heading}
              </h1>
              <div style={bodyStyle} className="flex flex-wrap justify-center items-center text-sm text-slate-500 gap-x-6 gap-y-2">
                <div className="flex items-center">
                  <CalendarDaysIcon className="w-4 h-4 mr-1.5 text-slate-400" />
                  <span>Published: May 20, 2024</span>
                </div>
                <div className="flex items-center">
                  <UserGroupIcon className="w-4 h-4 mr-1.5 text-slate-400" />
                  <span>By The Design Collective</span>
                </div>
              </div>
            </div>
            <figure className="my-8">
              <img src="https://images.unsplash.com/photo-1633596683562-4a47eb4983c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDg5NDg3NTV8&ixlib=rb-4.1.0&q=80&w=1080" alt="abstract typography design elements" />
            </figure>
            <div style={bodyStyle} className="prose prose-slate max-w-none break-words">
              <p className="lead mb-6 text-lg">
                {currentSample.body.substring(0, currentSample.body.indexOf(".") + 1 || currentSample.body.length)}
              </p>
              <p className="mb-4">
                {currentSample.body.substring(currentSample.body.indexOf(".") + 1 || 0)}
              </p>
              <h2 style={{ ...headingStyle, fontSize: `${Math.max(1.2, parseFloat(headingFont?.size || "2.5") * 0.7)}rem` }} className="mt-10 mb-4">
                Key Considerations for Font Selection
              </h2>
              <p>
                When pairing fonts, aim for a balance of contrast and harmony. A common strategy is to combine a serif typeface for headings with a sans-serif for body text, or vice versa. This distinction aids in differentiating content hierarchy. Also, consider the x-height, character width, and overall mood each font evokes.
              </p>
            </div>
          </article>
        )}

        {/* Website Template */}
        {template === "website" && (
          <div className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
            <header className="bg-slate-800 text-white px-6 py-5">
              <div className="max-w-5xl mx-auto flex flex-wrap justify-between items-center gap-4">
                <h2 style={{ ...headingStyle, fontSize: `${Math.max(1.2, parseFloat(headingFont?.size || "2.5") * 0.6)}rem`, color: "white" }}>
                  TypeCraft Pro
                </h2>
                <nav>
                  <ul className="flex space-x-6" style={{ ...bodyStyle, fontSize: `${Math.max(0.8, parseFloat(bodyFont?.size || "1") * 0.9)}rem`, color: "rgb(203 213 225)" }}>
                    {["Home", "Features", "Pricing", "Blog"].map(item => (
                      <li key={item} className="hover:text-white transition-colors cursor-pointer">{item}</li>
                    ))}
                  </ul>
                </nav>
              </div>
            </header>

            <section className="bg-indigo-600 text-white px-6 py-16 sm:py-24 text-center">
              <div className="max-w-3xl mx-auto">
                <h1 style={{ ...headingStyle, color: "white" }} className="mb-6 break-words">
                  {currentSample.heading}
                </h1>
                <p style={{ ...bodyStyle, color: "rgba(255,255,255,0.85)", fontSize: `${Math.max(0.9, parseFloat(bodyFont?.size || "1") * 1.1)}rem` }} className="mb-10 max-w-xl mx-auto break-words">
                  {currentSample.body.split(" ").slice(0, 25).join(" ") + "..."}
                </p>
                <button
                  style={{ fontFamily: bodyFont?.family || "sans-serif", fontWeight: bodyFont?.weight || "600" }}
                  className="px-8 py-3 bg-white text-indigo-700 font-semibold rounded-lg shadow-md hover:bg-slate-100 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-75"
                >
                  Start Your Journey
                </button>
              </div>
            </section>

            <section className="px-6 py-12 sm:py-16 bg-slate-50">
              <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
                {[
                  { title: "Intuitive Controls", icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><line x1="200" y1="56" x2="200" y2="36" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="200" y1="56" x2="180.98" y2="49.82" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="200" y1="56" x2="188.24" y2="72.18" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="200" y1="56" x2="211.76" y2="72.18" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="200" y1="56" x2="219.02" y2="49.82" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="128" cy="120" r="40" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M63.8,199.37a72,72,0,0,1,128.4,0" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M222.67,112A95.92,95.92,0,1,1,144,33.33" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg> },
                  { title: "Live Preview", icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><line x1="216" y1="128" x2="216" y2="176" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="192" y1="152" x2="240" y2="152" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="80" y1="40" x2="80" y2="88" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="56" y1="64" x2="104" y2="64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="168" y1="184" x2="168" y2="216" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="152" y1="200" x2="184" y2="200" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="144" y1="80" x2="176" y2="112" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><rect x="21.49" y="105.37" width="213.02" height="45.25" rx="8" transform="translate(-53.02 128) rotate(-45)" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg> },
                  { title: "Easy Export", icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><path d="M84,208H72A56,56,0,1,1,85.92,97.74" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="120 176 152 208 184 176" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="152" y1="128" x2="152" y2="208" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M80,128a80,80,0,1,1,151.46,36" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg> }
                ].map((item, index) => (
                  <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                    <div className="text-indigo-600 mb-3 w-8 h-8 flex items-center justify-center bg-indigo-100 rounded-full">
                      {item.icon}
                    </div>
                    <h3 style={{ ...headingStyle, fontSize: `${Math.max(1, parseFloat(headingFont?.size || "2.5") * 0.55)}rem` }} className="mb-3 break-words">
                      {item.title}
                    </h3>
                    <p style={{ ...bodyStyle, fontSize: `${Math.max(0.8, parseFloat(bodyFont?.size || "1") * 0.9)}rem` }} className="text-slate-600 break-words">
                      {currentSample.body.split(" ").slice(index * 5, index * 5 + 15).join(" ") + "..."}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>

      <div className="bg-slate-100 border-t border-slate-200 px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderFontInfo(headingFont, "Heading")}
          {renderFontInfo(bodyFont, "Body")}
        </div>
      </div>
    </div>
  );
};

export default PreviewPanel;