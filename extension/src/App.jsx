import { useState } from "react";
import "./App.css";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css"; // choose a style you like
import { useEffect } from "react";
import { getHintsFromBackend, getSolutionFromBackend } from "./api";

function App() {
  const [title, setTitle] = useState("");
  const [hints, setHints] = useState([]);
  const [solution, setSolution] = useState("");
  const [showSolution, setShowSolution] = useState(false);
  const [loadingHints, setLoadingHints] = useState(false);
  const [loadingSolution, setLoadingSolution] = useState(false);
  const [collapsed, setCollapsed] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(solution);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // show "Copied!" for 2 sec
    } catch (err) {
      console.error("❌ Failed to copy:", err);
    }
  };

  const toggleHint = (i) => {
    setCollapsed((prev) =>
      prev.includes(i) ? prev.filter((j) => j !== i) : [...prev, i]
    );
  };

  useEffect(() => {
    if (showSolution) {
      setTimeout(() => {
        document.querySelectorAll("pre code").forEach((block) => {
          hljs.highlightElement(block);
        });
      }, 100); // slight delay to ensure DOM update
    }
  }, [showSolution, solution]);

  const fetchHints = async () => {
    setLoadingHints(true); // Start loader
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const url = tabs[0].url;
      if (!url || !url.includes("leetcode.com/problems/")) {
        console.warn("⚠️ Not a LeetCode problem page.");
        setLoadingHints(false);
        return;
      }
      if (url && url.includes("leetcode.com")) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: "getProblemStatement" },
          async (res) => {
            if (chrome.runtime.lastError) {
              console.error(
                "❌ Could not connect to content script:",
                chrome.runtime.lastError.message
              );
              setLoadingHints(false);
              return;
            }
            console.log("📥 Received statement:", res.statement);
            // if (!res || !res.title) return;
            // console.log("📥 Received title:", res?.title);

            try {
              setTitle(res.statement);
              const rawHints = await getHintsFromBackend(res.statement);
              console.log("🧠 Raw Hints:", rawHints);
              const parsedHints = rawHints
                .split("\n")
                .filter((line) => line.trim().match(/^\d+\./));
              console.log("✅ Parsed Hints:", parsedHints);
              setHints(parsedHints);
              setCollapsed([]); // reset collapse state
            } catch (err) {
              console.error("❌ Error fetching hints:", err);
            } finally {
              setLoadingHints(false); // Stop loader
            }
          }
        );
        console.log("📤 Sending message to content script");
      }
    });
  };

  const fetchSolution = async () => {
    setLoadingSolution(true);
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const url = tabs[0].url;
      if (!url || !url.includes("leetcode.com/problems/")) {
        console.warn("⚠️ Not a LeetCode problem page.");
        setLoadingSolution(false);
        return;
      }
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "getLanguage" },
        async (res) => {
          if (chrome.runtime.lastError) {
            console.error(
              "❌ Could not get language from content script:",
              chrome.runtime.lastError.message
            );
            return;
          }

          const lang = res?.lang;
          if (!lang) {
            console.warn("⚠️ No language returned.");
            return;
          }

          console.log("📥 Language received:", lang);
          console.log("🚀 Fetching solution for:", title);
          try {
            const rawSolution = await getSolutionFromBackend(title, lang);
            setSolution(rawSolution);
            setShowSolution(true);
          } catch (err) {
            console.error("❌ Error fetching solution:", err);
          } finally {
            setLoadingSolution(false);
          }
        }
      );
    });
  };

  return (
    <div
      className={`w-[480px] min-h-screen p-4 font-sans ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold">💡 AlgoAid</h1>
        <label className="flex items-center gap-1 cursor-pointer">
          <input
            type="checkbox"
            className="hidden"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
          <div
            className={`w-10 h-5 rounded-full ${
              darkMode ? "bg-blue-600" : "bg-gray-300"
            } relative`}
          >
            <div
              className={`h-5 w-5 bg-white rounded-full absolute top-0 transition ${
                darkMode ? "left-5 -translate-x-full" : "left-0"
              }`}
            ></div>
          </div>
        </label>
      </div>

      <button
        onClick={fetchHints}
        disabled={loadingHints}
        className={`w-full py-2 px-4 rounded-md shadow font-medium transition ${
          loadingHints
            ? "bg-blue-400 cursor-not-allowed text-white"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {loadingHints ? "Loading..." : "Get AI Hints"}
      </button>

      {loadingHints && (
        <div className="flex justify-center mt-4">
          <Spinner />
        </div>
      )}

      <div className="space-y-3 mt-4">
        {hints.map((hint, i) => (
          <div
            key={i}
            className={`rounded-md shadow-sm text-sm cursor-pointer border-l-4 ${
              darkMode
                ? "bg-gray-800 border-blue-500"
                : "bg-white border-blue-500"
            }`}
            onClick={() => toggleHint(i)}
          >
            <div className="p-3 font-medium">
              Hint {i + 1}
              <span className="float-right">
                {collapsed.includes(i) ? "➕" : "➖"}
              </span>
            </div>
            {!collapsed.includes(i) && (
              <div className="px-3 pb-3 pt-1 text-sm">{hint}</div>
            )}
          </div>
        ))}
      </div>

      {!showSolution && hints.length > 0 && (
        <button
          onClick={fetchSolution}
          disabled={loadingSolution}
          className={`w-full mt-4 py-2 px-4 rounded-md shadow transition font-medium ${
            loadingSolution
              ? "bg-gray-500 cursor-not-allowed text-white"
              : "bg-gray-800 hover:bg-gray-900 text-white"
          }`}
        >
          {loadingSolution ? "Loading..." : "Show Solution"}
        </button>
      )}

      {loadingSolution && (
        <div className="flex justify-center mt-4">
          <Spinner />
        </div>
      )}

      {showSolution && (
        <div
          className={`mt-4 rounded-md shadow text-xs overflow-auto max-h-[200px] p-3 ${
            darkMode
              ? "bg-black text-green-200 border border-gray-700"
              : "bg-gray-100 text-black"
          }`}
        >
          <button
            onClick={handleCopy}
            className="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition text-xs"
          >
            📋 Copy to Clipboard
          </button>

          {copied && <p className="text-green-600 mt-1 text-xs">✅ Copied!</p>}

          <pre className="whitespace-pre-wrap">
            <code className="language-javascript font-mono">{solution}</code>
          </pre>
        </div>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-5 w-5 text-blue-500"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8z"
      />
    </svg>
  );
}

export default App;
