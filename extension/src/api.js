export async function getHintsFromBackend(title) {
  const response = await fetch("http://localhost:5000/api/gemini/hints", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });

  const data = await response.json();
  return data.hints;
}

export async function getSolutionFromBackend(title, lang) {
  console.log("📤 Sending title:", title);
  console.log("📤 Sending lang:", lang);
  const response = await fetch("http://localhost:5000/api/gemini/solution", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, lang }),
  });

  const data = await response.json();
  return data.solution;
}
