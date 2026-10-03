document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get(["apiKey", "targetLang"], (data) => {
    if (data.apiKey) document.getElementById("apiKey").value = data.apiKey;
    if (data.targetLang) document.getElementById("targetLang").value = data.targetLang;
  });
});

document.getElementById("saveBtn").addEventListener("click", () => {
  const apiKey = document.getElementById("apiKey").value.trim();
  const targetLang = document.getElementById("targetLang").value;

  chrome.storage.sync.set({ apiKey: apiKey, targetLang: targetLang }, () => {
    const status = document.getElementById("status");
    status.textContent = "Saved successfully!";
    setTimeout(() => { status.textContent = ""; }, 2000);
  });
});
