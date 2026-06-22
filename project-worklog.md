# teaching 工作日誌

## 2026-06-22

### 任務

- 依影片教學建立 `teaching` 的 Firebase 專案骨架與工作模式。
- 完成 Firebase CLI 登入、綁定實際 project id、部署 Firestore 規則。
- 製作 Firebase Hosting 版文字雲頁面。
- 建立 GitHub repo 並完成 push。
- 實測 Firestore 寫入與讀取。

### 主要輸出

- 建立 `AGENTS.md`
- 建立 `README.md`
- 建立 `.gitignore`
- 建立 `firebase.json`
- 建立 `.firebaserc`
- 建立 `firestore.rules`
- 建立 `public/index.html`
- 建立 `public/styles.css`
- 建立 `public/app.js`
- 將 `.firebaserc` 綁定到 `teaching-3809d`
- 建立 GitHub repo `teaching-wordcloud`
- 建立 Firebase Web App `teaching-wordcloud-web`
- 將 Firestore 讀寫接到 `wordcloud_words/latest`

### 驗證

- 已確認專案骨架檔案存在。
- 已確認 `Codex` 與 `Antigravity` 都已安裝 `startup-sync`、`shutdown-sync`、`project-init-sync`。
- 已確認 `Codex` 與 `Antigravity` 的 Firebase MCP 設定已寫入。
- 已確認 Firebase CLI 已登入 `594katchang@gmail.com`。
- 已確認 Firebase 專案 `teaching` 的 project id 是 `teaching-3809d`。
- 已確認 `firebase.cmd deploy --only hosting,firestore:rules` 成功。
- 已確認 Firestore 資料庫存在，路徑為 `projects/teaching-3809d/databases/(default)`。
- 已確認 `https://teaching-3809d.web.app` 可讀到最新首頁內容。
- 已確認本機 git 初始 commit 與 GitHub push 都已完成。
- 已確認線上頁面可成功寫入 Firestore。
- 已確認線上頁面可成功從 Firestore 讀回剛寫入的資料。
- 本次實測寫入文字：`Firestore 驗證測試 教學資料 讀寫成功 讀寫成功 2026-06-22`

### 錯誤或風險

- GitHub push 仍依賴目前瀏覽器登入狀態與本機 git 遠端權限。
- 目前這個對話不會自動熱載入新 MCP 工具清單，通常仍要重開 Codex 或重載對應應用才會在介面內看到 Firebase MCP。
- 若直接在受限沙箱內跑某些 Firebase CLI 查詢，可能撞到 `configstore` 權限錯誤。
- Firebase Hosting 前端腳本更新後，瀏覽器可能沿用舊快取，造成你以為新功能沒生效。

### 新學到的規則

- 雲端硬碟不是硬性前提，本機資料夾可作為正式工作目錄。
- Firebase Console 的顯示名稱與 project id 可能不同，建立後要以 `projects:list` 回寫真正的 project id。
- Firestore 規則部署成功與 `(default)` 資料庫存在，可作為 Firebase 安裝完成的重要驗證點。
- 若這次任務包含公開頁面，收尾時要把部署網址與 GitHub repo 一起回寫到 `README.md` 與 `AGENTS.md`。
- 若要從前端直接驗證 Firestore 讀寫，要先建立 Firebase Web App，再把 SDK 設定接進頁面。
- 若剛部署後瀏覽器仍吃舊版 `app.js`，要在腳本網址加版本參數再驗證。
- 若在受限沙箱內跑 Firebase CLI help 或 app 查詢命令，可能因 `C:\Users\cygnu\.config\configstore\firebase-tools.json` 權限而失敗，這類命令要改成升權執行。

### 回寫狀態

- `AGENTS.md`：已建立並更新
- `README.md`：已建立並更新
- `project-worklog.md`：已建立並更新
