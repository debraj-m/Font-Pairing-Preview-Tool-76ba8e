import React, { Fragment, useRef, useState, useEffect } from "react";
import { toPng } from "html-to-image";
import { saveAs } from "file-saver";
import { generateCSS, generateHTMLPreview } from "../utils/fontUtils";
import { Dialog, Transition } from "@headlessui/react";
import {
  ArrowDownTrayIcon,
  ClipboardDocumentIcon,
  CheckCircleIcon,
  XMarkIcon,
  CodeBracketIcon,
  PhotoIcon,
  InformationCircleIcon,
  CogIcon,
  CubeTransparentIcon
} from "@heroicons/react/24/outline";
import { SparklesIcon } from "@heroicons/react/20/solid";


const ExportPanel = ({ headingFont, bodyFont, previewRef }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("css"); // css, html, download
  const [cssFormat, setCssFormat] = useState("standard"); // standard or tailwind
  
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });
  const [isLoading, setIsLoading] = useState({ copy: false, downloadPng: false, downloadHtml: false });

  const textAreaRef = useRef(null);

  const cssCode = generateCSS(headingFont, bodyFont);
  const htmlPreviewCode = generateHTMLPreview(headingFont, bodyFont);
  const tailwindConfig = `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        heading: ['${headingFont?.family || "sans-serif"}', '${headingFont?.category || "sans-serif"}'],
        body: ['${bodyFont?.family || "sans-serif"}', '${bodyFont?.category || "sans-serif"}'],
      },
      fontSize: {
        'heading-base': '${headingFont?.size || "2.5"}rem',
        'body-base': '${bodyFont?.size || "1"}rem',
      },
      lineHeight: {
        'heading': '${headingFont?.lineHeight || "1.2"}',
        'body': '${bodyFont?.lineHeight || "1.6"}',
      },
      colors: {
        'heading': '${headingFont?.color || "#111827"}',
        'body': '${bodyFont?.color || "#374151"}',
      }
    }
  }
};`;

  const showNotification = (message, type = "success", duration = 3000) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "success" });
    }, duration);
  };

  const handleCopy = async () => {
    if (!textAreaRef.current && activeTab !== "css" && activeTab !== "html") return;
    setIsLoading(prev => ({ ...prev, copy: true }));

    let textToCopy = "";
    if (activeTab === "css") {
      textToCopy = cssFormat === "standard" ? cssCode : tailwindConfig;
    } else if (activeTab === "html") {
      textToCopy = htmlPreviewCode;
    }

    try {
      await navigator.clipboard.writeText(textToCopy);
      showNotification("Copied to clipboard!", "success");
    } catch (err) {
      console.error("Failed to copy text: ", err);
      showNotification("Failed to copy. Please try again.", "error");
    } finally {
      setIsLoading(prev => ({ ...prev, copy: false }));
    }
  };

  const handleDownloadImage = async () => {
    if (!previewRef?.current) {
      showNotification("Preview element not found.", "error");
      return;
    }
    setIsLoading(prev => ({ ...prev, downloadPng: true }));
    try {
      const dataUrl = await toPng(previewRef.current, {
        quality: 0.98, // Slightly reduced for faster processing but still high quality
        pixelRatio: window.devicePixelRatio * 1.5, // Higher pixel ratio for sharpness
        backgroundColor: "#FFFFFF", // Ensure consistent background
        style: {
            transition: "none", // Disable transitions during capture
            transform: "none" // Ensure no transforms interfere
        }
      });
      saveAs(dataUrl, `font-pairing-${headingFont?.family || "heading"}-${bodyFont?.family || "body"}.png`);
      showNotification("PNG image downloaded!", "success");
    } catch (error) {
      console.error("Error generating image:", error);
      showNotification("Error generating image. Please try again.", "error");
    } finally {
      setIsLoading(prev => ({ ...prev, downloadPng: false }));
    }
  };

  const handleDownloadHTML = () => {
    setIsLoading(prev => ({ ...prev, downloadHtml: true }));
    try {
      const blob = new Blob([htmlPreviewCode], { type: "text/html;charset=utf-8" });
      saveAs(blob, `font-pairing-${headingFont?.family || "heading"}-${bodyFont?.family || "body"}.html`);
      showNotification("HTML file downloaded!", "success");
    } catch (error)
    {
      console.error("Error generating HTML:", error);
      showNotification("Error generating HTML. Please try again.", "error");
    } finally {
      setIsLoading(prev => ({ ...prev, downloadHtml: false }));
    }
  };
  
  useEffect(() => {
    if (isModalOpen && activeTab === "css" && textAreaRef.current) {
        textAreaRef.current.value = cssFormat === "standard" ? cssCode : tailwindConfig;
    } else if (isModalOpen && activeTab === "html" && textAreaRef.current) {
        textAreaRef.current.value = htmlPreviewCode;
    }
  }, [isModalOpen, activeTab, cssFormat, cssCode, tailwindConfig, htmlPreviewCode]);


  const TabButton = ({ id, label, icon }) => (
    <button
      type="button"
      className={`flex items-center justify-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out
                  ${activeTab === id ? "bg-indigo-600 text-white shadow-md" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
      onClick={() => setActiveTab(id)}
    >
      {icon && React.cloneElement(icon, { className: "w-5 h-5 mr-2" })}
      {label}
    </button>
  );

  const ActionButton = ({ onClick, isLoading, icon, children, primary = false }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className={`flex items-center justify-center w-full px-5 py-3 text-sm font-semibold rounded-lg shadow-sm transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                  ${isLoading ? "bg-slate-300 text-slate-500 cursor-not-allowed" : 
                    (primary ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-slate-100 text-slate-700 hover:bg-slate-200")}`}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        icon && React.cloneElement(icon, { className: "w-5 h-5 mr-2" })
      )}
      {isLoading ? "Processing..." : children}
    </button>
  );


  return (
    <>
      <div className="bg-white shadow-lg rounded-xl p-6 transition-all duration-300 ease-in-out">
        <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
          <SparklesIcon className="w-6 h-6 text-indigo-600 mr-3" />
          Export Your Creation
        </h2>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="w-full flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:scale-105"
        >
          <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
          Open Export Options
        </button>
      </div>

      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-2xl transition-all">
                  <Dialog.Title as="h3" className="text-2xl font-bold leading-6 text-slate-900 mb-2 flex items-center">
                     <CubeTransparentIcon className="w-7 h-7 mr-3 text-indigo-600"/> Export Options
                  </Dialog.Title>
                  <button
                    type="button"
                    className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
                    onClick={() => setIsModalOpen(false)}
                  >
                    <XMarkIcon className="w-7 h-7" />
                  </button>

                  <div className="mt-6 grid grid-cols-3 gap-3 mb-6">
                    <TabButton id="css" label="CSS" icon={<CodeBracketIcon />} />
                    <TabButton id="html" label="HTML" icon={<CodeBracketIcon />} />
                    <TabButton id="download" label="Download" icon={<ArrowDownTrayIcon />} />
                  </div>

                  <div className="mt-4 min-h-[300px]">
                    {activeTab === "css" && (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4 bg-slate-50 p-3 rounded-lg">
                          <label className="flex items-center text-sm text-slate-700 cursor-pointer">
                            <input
                              type="radio"
                              className="form-radio h-4 w-4 text-indigo-600 border-slate-300 focus:ring-indigo-500 transition"
                              name="cssFormat"
                              checked={cssFormat === "standard"}
                              onChange={() => setCssFormat("standard")}
                            />
                            <span className="ml-2">Standard CSS</span>
                          </label>
                          <label className="flex items-center text-sm text-slate-700 cursor-pointer">
                            <input
                              type="radio"
                              className="form-radio h-4 w-4 text-indigo-600 border-slate-300 focus:ring-indigo-500 transition"
                              name="cssFormat"
                              checked={cssFormat === "tailwind"}
                              onChange={() => setCssFormat("tailwind")}
                            />
                            <span className="ml-2 flex items-center"><CogIcon className="w-4 h-4 mr-1 text-slate-500"/>Tailwind Config</span>
                          </label>
                        </div>
                        <textarea
                          ref={textAreaRef}
                          readOnly
                          className="w-full h-64 p-4 border border-slate-300 rounded-lg font-mono text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none shadow-inner"
                          value={cssFormat === "standard" ? cssCode : tailwindConfig}
                        />
                        <ActionButton onClick={handleCopy} isLoading={isLoading.copy} icon={<ClipboardDocumentIcon />} primary>
                          Copy Code
                        </ActionButton>
                      </div>
                    )}

                    {activeTab === "html" && (
                      <div className="space-y-4">
                        <textarea
                          ref={textAreaRef}
                          readOnly
                          className="w-full h-64 p-4 border border-slate-300 rounded-lg font-mono text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none shadow-inner"
                          value={htmlPreviewCode}
                        />
                        <ActionButton onClick={handleCopy} isLoading={isLoading.copy} icon={<ClipboardDocumentIcon />} primary>
                          Copy HTML
                        </ActionButton>
                      </div>
                    )}

                    {activeTab === "download" && (
                      <div className="space-y-6">
                        <div className="bg-slate-50 p-6 rounded-xl shadow-inner space-y-4">
                          <h4 className="text-md font-semibold text-slate-700 flex items-center"><PhotoIcon className="w-5 h-5 mr-2 text-indigo-500"/>Download as Image</h4>
                          <p className="text-sm text-slate-600">
                            Save the current preview panel as a high-resolution PNG image. Perfect for presentations or sharing.
                          </p>
                          <ActionButton onClick={handleDownloadImage} isLoading={isLoading.downloadPng} icon={<ArrowDownTrayIcon />} primary>
                            Download PNG
                          </ActionButton>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-xl shadow-inner space-y-4">
                          <h4 className="text-md font-semibold text-slate-700 flex items-center"><CodeBracketIcon className="w-5 h-5 mr-2 text-indigo-500"/>Download as HTML</h4>
                          <p className="text-sm text-slate-600">
                            Get a standalone HTML file with your selected fonts and styles embedded. Ready to use or inspect.
                          </p>
                          <ActionButton onClick={handleDownloadHTML} isLoading={isLoading.downloadHtml} icon={<ArrowDownTrayIcon />}>
                            Download HTML
                          </ActionButton>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-8 bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-md">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <InformationCircleIcon className="h-5 w-5 text-indigo-500" aria-hidden="true" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-indigo-700">
                          Remember to include the Google Fonts links in your project's HTML head or install fonts locally. Exported CSS/HTML includes direct Google Fonts imports.
                        </p>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Notification Panel */}
      <div
        aria-live="assertive"
        className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-[100]"
      >
        <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
          <Transition
            show={notification.show}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className={`max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden
                            ${notification.type === "success" ? "border-l-4 border-green-500" : "border-l-4 border-red-500"}`}>
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {notification.type === "success" ? (
                      <CheckCircleIcon className="h-6 w-6 text-green-500" aria-hidden="true" />
                    ) : (
                      <XMarkIcon className="h-6 w-6 text-red-500" aria-hidden="true" />
                    )}
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-medium text-slate-900">{notification.message}</p>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex">
                    <button
                      type="button"
                      className="bg-white rounded-md inline-flex text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={() => {
                        setNotification(prev => ({ ...prev, show: false }));
                      }}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </>
  );
};

export default ExportPanel;