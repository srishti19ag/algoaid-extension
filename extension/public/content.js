console.log("🧠 LeetCode content script injected:", window.location.href);

function getLeetCodeProblemStatement() {
  const metaDescr = document.querySelector('meta[name="description"]');
  const problemStatement = metaDescr?.getAttribute("content") || null;

  if (!problemStatement) {
    console.warn("⚠️ Could not find LeetCode problem statement.");
  }

  return problemStatement;
}
function getLanguage() {
  const langBtn = document.querySelector(
    '[data-layout-path="/c1/ts0/t0"] button[aria-haspopup="dialog"]'
  );
  const lang = langBtn?.innerText;
  console.log(lang); // Java

  if (!lang) {
    console.warn("⚠️ Could not find Language");
  }

  return lang;
}

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req.action === "getProblemStatement") {
    const statement = getLeetCodeProblemStatement();
    console.log("📤 Responding with problem statement");
    sendResponse({ statement });

    return true; // ✅ keep message channel open (fixes your error)
  }

  if (req.action === "getLanguage") {
    const lang = getLanguage();
    sendResponse({ lang });
    return true;
  }

  if (req.action === "getAllData") {
    const statement = getLeetCodeProblemStatement();
    const lang = getLanguage();
    sendResponse({ statement, lang });
    return true;
  }
});
