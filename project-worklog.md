# teaching 工作日誌

## 2026-06-23

### 任務

- 處理 GitHub Secret Scanning 對 `public/app.js#L11` 回報的 Google API Key 暴露。
- 移除 `public/app.js` 中硬寫的 Firebase Web API key。
- 收緊 Firestore demo rules，先關閉匿名寫入。
- 回寫專案與全域規則，避免 Codex 與 Antigravity 未來再提交相同類型資料。

### 主要輸出

- 更新 `public/app.js`：改讀 `window.TEACHING_WORDCLOUD_FIREBASE_CONFIG`，沒有設定時停用 Firestore 按鈕，文字雲本體仍可使用。
- 更新 `public/index.html`：載入未提交的 `/firebase-config.js`，並更新 `app.js` 版本參數。
- 新增 `public/firebase-config.example.js`：保留格式範例，內容不含真實 key。
- 更新 `.gitignore`：加入 `public/firebase-config.js`。
- 更新 `firestore.rules`：允許 demo 文件讀取，禁止匿名寫入。
- 更新 `README.md`：補 Firebase 設定檔、key 限制、輪換處理與部署指令。
- 更新 `AGENTS.md`：加入本專案 Firebase key 與 Firestore rules 安全規則。

### 驗證

- 已確認 GitHub 回報來源 commit 是 `cec928dc73810bf7541805bc6f2843cfcdf10cd6`，訊息為 `Add Firestore verification flow`。
- 已確認目前 `main` 版本的 `public/app.js` 已改成不保存真實 API key。
- 已確認 `public/firebase-config.js` 已列入 `.gitignore`。
- 已確認 `firestore.rules` 已從匿名讀寫改成公開讀取、禁止匿名寫入。
- 已確認 README、AGENTS、工作日誌已更新。
- 已確認 Codex 全域 `AGENTS.md` 已加入 Firebase key 與 Secret Scanning 處理規則。
- 已確認 Antigravity 全域 `AGENTS.md` 已加入 Firebase key 與 Secret Scanning 處理規則。
- 已確認本機 `D:\CodexAI協作平台\teaching` 已快轉到 GitHub 最新版本。
- 已掃描本機專案，未再找到 Google API key pattern、`private_key` 或 `service_account`。

### 錯誤或風險

- 舊 key 已出現在公開 GitHub 歷史提交中，單靠移除目前版本無法讓舊 key 失效。
- 仍需到 Google Cloud Console 或 Firebase Console 將舊 key 停用或輪換，並為新 key 設定 HTTP referrer 與 API 權限限制。
- `firebase-config.js` 若由本機部署，部署前仍要人工確認內容沒有進 Git。
- 匿名寫入已關閉，若課堂需要即時收集文字，需先加登入、App Check、活動碼或更精細的 Firestore rules。
- Firebase CLI 部署時回報憑證過期，需要執行 `firebase.cmd login --reauth` 後再部署 Hosting 與 Firestore rules。

### 新增規則

- 前端 Firebase Web API key 不得直接寫入 `public/app.js`、`public/index.html`、README、AGENTS 或工作日誌。
- 真實 Firebase 前端設定只能放在 `.gitignore` 保護的 `public/firebase-config.js`，repo 僅保存 `public/firebase-config.example.js`。
- GitHub Secret Scanning 回報後，處置要同時包含目前版本移除、規則收緊、工作日誌、專案 AGENTS、全域 Codex 與 Antigravity 規則同步。
- Firestore demo 不得使用 `allow read, write: if true` 當成長期設定。

### 回寫狀態

- `AGENTS.md`：已更新
- `README.md`：已更新
- `project-worklog.md`：已更新
- Codex 全域 `AGENTS.md`：已同步更新
- Antigravity 全域 `AGENTS.md`：已同步更新

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
