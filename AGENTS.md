# teaching - AGENTS.md

## 專案入口

專案名稱：teaching
專案用途：用 Firebase Hosting 發布教學型互動頁面
主要工作目錄：D:\CodexAI協作平台\teaching
GitHub repo：`https://github.com/594katchang-source/teaching-wordcloud`
預設 branch：main
部署網址：`https://teaching-3809d.web.app`

## Firebase

Firebase 專案名稱：teaching
Firebase project id：`teaching-3809d`
Firestore 位置：`asia-east1 (Taiwan)`
Hosting 目錄：`public`
部署指令：`firebase.cmd deploy`
Firestore 文件路徑：`wordcloud_words/latest`
前端設定檔：`public/firebase-config.js`
設定範例：`public/firebase-config.example.js`

## 工作模式

開工時：
- 使用 `startup-sync`
- 讀本檔
- 讀 `project-worklog.md`
- 檢查 Git 狀態

收工時：
- 使用 `shutdown-sync`
- 更新 `project-worklog.md`
- 若 Firebase project id、Hosting 目錄、GitHub repo、部署網址改變，要回寫本檔

專案初始化時：
- 使用 `project-init-sync`

## 主要檔案

- `public/index.html`
- `public/styles.css`
- `public/app.js`
- `public/firebase-config.example.js`
- `firestore.rules`
- `firebase.json`
- `.firebaserc`
- `README.md`
- `project-worklog.md`

## 驗證重點

- 頁面沒有 Firebase 設定時，文字雲本體仍要能使用。
- Firestore 功能要在 `public/firebase-config.js` 存在且內容正確時才啟用。
- 發布前要確認 repo 內沒有 Google API key、Firebase API key、service account JSON、`.env` 或任何 private token。
- 若要開放寫入 Firestore，必須先有登入、App Check、活動碼或更明確的資料庫規則，再部署 `firestore.rules`。

## 安全規則

- 不要把 Firebase Admin 憑證放進 repo。
- 不要把 Google API key 或 Firebase API key 直接寫進 `public/app.js`、`public/index.html`、README、AGENTS 或工作日誌。
- 真實前端設定只能放在 `public/firebase-config.js`，且此檔必須維持在 `.gitignore`。
- Firebase Web API key 即使用於前端，也要在 Google Cloud Console 限制 HTTP referrer 與 API 權限。
- 若 GitHub Secret Scanning 回報 key，當次收尾要確認已移除 repo 目前版本、已更新規則檔、已提醒輪換或停用舊 key。

## 已知坑點

- 在目前這個受限沙箱內直接跑某些 `firebase.cmd` 查詢，CLI 可能會碰到 `C:\Users\cygnu\.config\configstore\firebase-tools.json` 權限錯誤。這類命令要改成升權執行。
- Firebase Hosting 更新後，Chrome 可能繼續吃舊版 `app.js`。若剛部署完的前端行為看起來沒更新，要替腳本路徑加版本參數，或用新的查詢參數重開頁面再驗證。

## 不要做

- 不要把真實個資放進公開頁面或資料庫。
- 不要把每日進度寫進本檔。
