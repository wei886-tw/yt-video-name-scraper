# yt-video-name-scraper

這是一個用 Node.js 寫的小工具，輸入 YouTube 頻道的 @handle，就能把該頻道所有影片的標題與連結整理成一份 Markdown 清單。使用官方 YouTube Data API v3，不爬網頁。

## 為什麼做這個

想整理某個頻道的完整影片清單時，手動從頻道頁面複製既慢又容易漏。這個工具把流程自動化：先用頻道 handle 查出頻道的上傳清單，再逐頁取得所有影片，最後輸出成可以直接閱讀、搜尋或進一步分析的文字檔。

## 運作流程

1. 以頻道 handle 向 YouTube Data API 查詢頻道資訊。
2. 取得該頻道的「上傳影片」播放清單 ID。
3. 讀取播放清單中的所有影片標題與影片 ID。
4. 組成影片連結，寫入 `output.md`。

## 前置需求

- Node.js v20.6 以上（需要內建的 `--env-file` 參數）
- Google 帳號
- YouTube Data API v3 的 API Key

## 申請 API Key

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)。
2. 建立新專案，或使用現有專案。
3. 左側選單進入 "APIs & Services" → "Library"，搜尋 `YouTube Data API v3` 並啟用。
4. 進入 "Credentials" → "Create Credentials" → "API Key"。
5. 點 "Edit API Key"，在 "API restrictions" 選 "Restrict key"，只勾選 YouTube Data API v3。

## 設定

1. 複製範例設定檔：

   ```bash
   cp .env.example .env
   ```

2. 開啟 `.env`，填入你的 API Key：

   ```ini
   YOUTUBE_API_KEY=你的key
   ```

3. 開啟 `index.js`，修改頂部的頻道 handle（不含 @）：

   ```js
   const CHANNEL_HANDLE = 'Tenhao1978';
   ```

`.env` 已列在 `.gitignore`，不會被提交到 repo。請不要把 API Key 直接寫進程式碼。

## 執行

執行時帶入頻道 handle（可含或不含 `@`）：

### 如何找到頻道 handle

handle 是頻道名稱旁以 `@` 開頭的識別名稱，取得方式：

- 開啟頻道頁面，網址會是 `youtube.com/@handle`，`@` 後面的部分就是。
- 頻道名稱下方也會顯示 `@handle`，手機 App 同樣看得到。

注意：用 App 的「分享」功能複製的連結，可能是 `youtube.com/channel/UC...` 格式，這種網址不含 handle，請改從頻道頁面讀取。

```bash
npm start -- Tenhao1978
```

不帶參數會顯示用法說明。執行成功後會在同目錄產生 `output.md`，終端機會顯示頻道名稱與抓到的影片數量。

## 輸出範例

`output.md` 的內容為每支影片的標題與連結，格式大致如下：

```markdown
- [影片標題一](https://www.youtube.com/watch?v=VIDEO_ID_1)
- [影片標題二](https://www.youtube.com/watch?v=VIDEO_ID_2)
```

## 已知限制

- YouTube Data API 有每日配額，影片數量很大的頻道可能一次跑不完。實際配額請參考 [官方文件](https://developers.google.com/youtube/v3/determine_quota_cost)。
- 只能抓到公開影片，私人或未列出的影片不會出現在清單中。
- 目前一次只處理一個頻道，要抓其他頻道需重新執行並帶入不同的 handle。

## 安全注意事項

- 不要將 `.env` 提交到 git，只提交 `.env.example`。
- 若 API Key 曾被提交到 repo 或公開，請立即到 Google Cloud Console 刪除並重新產生。
- 建議為 API Key 設定 API 限制，避免被盜用時影響範圍擴大。# yt-video-name-scraper
