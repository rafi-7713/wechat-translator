# 🌐 WeChat Article Translator (微信公众号文章翻译器)

A lightweight Chromium browser extension (compatible with Microsoft Edge, Google Chrome, and QQ Browser) that translates WeChat Official Account (`mp.weixin.qq.com`) articles inline while preserving images and layout formatting.
✨ Features
Zero Account Ban Risk: Operates strictly on client-side public URLs without automating personal WeChat accounts.

In-China Friendly: Pre-configured for domestic OpenAI-compatible providers (SiliconFlow / Qwen) requiring no VPN.

Inline Bilingual View: Displays target-language translations directly below original paragraphs.

Image Preservation: Preserves WeChat lazy-loaded images (data-src to src).

🛠️ Tech Stack
Platform: Manifest V3 (Chrome / Edge Extension)

Languages: JavaScript (ES6+), HTML5, CSS3

API Backend: SiliconFlow (Qwen2.5-7B-Instruct) / OpenAI-compatible endpoint

📂 Project Structure
Plaintext
wechat-translator/
├── manifest.json       # Extension metadata and permissions
├── content.js          # In-page DOM parsing and translation script
├── popup.html          # Extension options menu
└── popup.js            # Configuration storage handler
🚀 Installation & Setup
Clone or Download this repository:

git clone [https://github.com/](https://github.com/)/wechat-article-translator.git
