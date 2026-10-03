(function () {
  // --- PASTE YOUR SILICONFLOW KEY INSIDE THE QUOTES BELOW ---
  const HARDCODED_API_KEY = "YOUR_SILICONFLOW_API_KEY_HERE";
  const TARGET_LANG = "English";
  // ----------------------------------------------------------

  const btn = document.createElement("button");

  btn.innerText = "🌐 Translate Article";

  btn.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 999999;
    background: #07c160;
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 24px;
    font-size: 14px;
    font-weight: bold;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    cursor: pointer;
  `;

  document.body.appendChild(btn);

  btn.addEventListener("click", async () => {
    try {
      // Get saved settings
      const stored = await chrome.storage.sync.get([
        "apiKey",
        "geminiApiKey",
        "targetLang"
      ]);

      const apiKey =
        stored.apiKey ||
        stored.geminiApiKey ||
        HARDCODED_API_KEY;

      const lang = stored.targetLang || TARGET_LANG;

      // Check API key
      if (
        !apiKey ||
        apiKey.trim() === "" ||
        apiKey === "sk-PASTE_YOUR_KEY_HERE"
      ) {
        alert(
          "Please paste your SiliconFlow API key into content.js or into the extension popup!"
        );
        return;
      }

      // Disable button while translating
      btn.disabled = true;
      btn.style.opacity = "0.7";
      btn.innerText = "Translating...";

      // Find article title
      const titleEl =
        document.querySelector("#activity-name") ||
        document.querySelector("h1.rich_media_title");

      // Find article content
      const contentEl = document.querySelector("#js_content");

      if (!contentEl) {
        alert("Could not locate article body.");

        btn.disabled = false;
        btn.style.opacity = "1";
        btn.innerText = "🌐 Translate Article";

        return;
      }

      // --------------------------------------------------
      // Keep images visible
      // --------------------------------------------------

      contentEl.querySelectorAll("img").forEach((img) => {
        if (img.dataset.src && !img.src) {
          img.src = img.dataset.src;
        }
      });

      // --------------------------------------------------
      // 1. Translate Title
      // --------------------------------------------------

      if (titleEl && titleEl.innerText.trim()) {
        const originalTitle = titleEl.innerText.trim();

        const translatedTitle = await callTranslationAPI(
          originalTitle,
          lang,
          apiKey
        );

        // Prevent translating the same title multiple times
        if (!titleEl.dataset.translated) {
          const translationNode = document.createElement("div");

          translationNode.style.cssText = `
            color: #1a73e8;
            margin-top: 8px;
            font-size: 0.9em;
            line-height: 1.5;
            font-weight: normal;
          `;

          translationNode.innerText = translatedTitle;

          titleEl.appendChild(translationNode);
          titleEl.dataset.translated = "true";
        }
      }

      // --------------------------------------------------
      // 2. Translate Article Content
      // --------------------------------------------------

      const elements = contentEl.querySelectorAll("p, section");

      for (const el of elements) {
        const text = el.innerText?.trim();

        // Skip empty elements
        if (!text || text.length < 2) {
          continue;
        }

        // Skip containers that contain other paragraphs/sections
        if (el.querySelector("p, section")) {
          continue;
        }

        // Skip already translated elements
        if (el.dataset.translated === "true") {
          continue;
        }

        const translated = await callTranslationAPI(
          text,
          lang,
          apiKey
        );

        // Create translation element
        const transNode = document.createElement("div");

        transNode.style.cssText = `
          color: #1a73e8;
          margin-top: 4px;
          margin-bottom: 8px;
          font-size: 0.95em;
          line-height: 1.5;
        `;

        transNode.innerText = translated;

        el.appendChild(transNode);

        el.dataset.translated = "true";
      }

      // Finished
      btn.innerText = "✓ Done";
      btn.style.background = "#4caf50";

    } catch (err) {
      console.error("Translation error:", err);

      alert("Translation error: " + err.message);

      btn.disabled = false;
      btn.style.opacity = "1";
      btn.innerText = "🌐 Translate Article";
    }
  });

  // --------------------------------------------------
  // SiliconFlow Translation API
  // --------------------------------------------------

  async function callTranslationAPI(text, targetLang, apiKey) {
    const url =
      "https://api.siliconflow.cn/v1/chat/completions";

    const payload = {
      model: "Qwen/Qwen2.5-7B-Instruct",

      messages: [
        {
          role: "system",
          content:
            `You are a professional translator. ` +
            `Translate the following text directly into natural ${targetLang}. ` +
            `Preserve the original meaning and formatting as much as possible. ` +
            `Output ONLY the translation, nothing else.`
        },

        {
          role: "user",
          content: text
        }
      ],

      temperature: 0.2
    };

    const res = await fetch(url, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey.trim()}`
      },

      body: JSON.stringify(payload)
    });

    // Handle API errors
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));

      throw new Error(
        errData.error?.message ||
        errData.message ||
        `API error (${res.status})`
      );
    }

    const data = await res.json();

    const translation =
      data.choices?.[0]?.message?.content?.trim();

    if (!translation) {
      throw new Error("The API returned an empty translation.");
    }

    return translation;
  }
})();