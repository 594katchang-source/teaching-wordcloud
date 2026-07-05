# teaching - AGENTS.md

## 專案入口

專案名稱：teaching
專案用途：用 Firebase Hosting 發布課堂即時回饋文字雲
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
舊版 Firestore 文件路徑：`wordcloud_words/latest`
目前 `wordcloud_words/latest` 已刪除，首頁不再預載示範文字。
課堂回饋狀態：`class_sessions/default`
課堂回覆路徑：`class_sessions/default/rounds/{roundId}/responses/{responseId}`
QR code 連結固定為部署網址，清空本輪只切換 Firestore 題次，不改網址。
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
- `tools/firestore-smoke-test.mjs`
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
- Firestore 煙霧測試可用 `tools/firestore-smoke-test.mjs`。完整寫入測試時只能短期開放單一測試文件，測完要恢復 `allow write: if false` 並部署。
- 課堂回饋版允許匿名新增 300 字以內回覆，禁止匿名修改或刪除單筆回覆。
- 「清空本輪」採切換 `activeRoundId`，不是刪除舊資料。
- QR code 固定指向 `https://teaching-3809d.web.app`，每次上課可重複使用同一張 QR code。
- 版面順序固定為上方 QR code、你的回覆、送出回覆，接著文字雲預覽，再放即時回覆與詞頻摘要。
- 「清空本輪」要放在最下方，降低現場誤按機率。
- 頁面底部需保留設計者連結：`https://594katchang-source.github.io/`。

## 安全規則

- 不要把 Firebase Admin 憑證放進 repo。
- 不要把 Google API key 或 Firebase API key 直接寫進 `public/app.js`、`public/index.html`、README、AGENTS 或工作日誌。
- 真實前端設定只能放在 `public/firebase-config.js`，且此檔必須維持在 `.gitignore`。
- Firebase Web API key 即使用於前端，也要在 Google Cloud Console 限制 HTTP referrer 與 API 權限。
- 若 GitHub Secret Scanning 回報 key，當次收尾要確認已移除 repo 目前版本、已更新規則檔、已提醒輪換或停用舊 key。
- 目前清空按鈕在同一個公開頁面，適合作為課堂 demo。若要防止學生清空，需加老師專用入口、登入、App Check 或後端控制。

## 已知坑點

- 在目前這個受限沙箱內直接跑某些 `firebase.cmd` 查詢，CLI 可能會碰到 `C:\Users\cygnu\.config\configstore\firebase-tools.json` 權限錯誤。這類命令要改成升權執行。
- Firebase Hosting 更新後，Chrome 可能繼續吃舊版 `app.js`。若剛部署完的前端行為看起來沒更新，要替腳本路徑加版本參數，或用新的查詢參數重開頁面再驗證。
- Node v24 在這台 Windows 主機直接執行 Firestore REST 測試時，可能因 TLS 憑證鏈出現 `UNABLE_TO_VERIFY_LEAF_SIGNATURE`，要加 `$env:NODE_OPTIONS='--use-system-ca'`。
- Node v24 在這台 Windows 主機的測試腳本內不要用 `process.exit(0)` 提早結束，曾觸發 `UV_HANDLE_CLOSING` assertion。讓腳本自然結束較穩。
- 這版 Firebase CLI 刪 Firestore 文件要用 `firebase.cmd firestore:delete <path> --force`，`--yes` 不是有效參數。
- 這台主機用 PowerShell `Invoke-WebRequest` 抓 Firebase Hosting 頁面時可能出現空物件錯誤，可改用 `curl.exe -k -L` 驗證公開頁面內容。

## 不要做

- 不要把真實個資放進公開頁面或資料庫。
- 不要把每日進度寫進本檔。
