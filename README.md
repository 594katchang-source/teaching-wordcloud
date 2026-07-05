# teaching

這是放在 Firebase Hosting 的教學型文字雲頁面。

## 目前內容

- 固定網址可做成 QR code 給學生掃描
- 學生可匿名送出中文或英文短文字回覆
- 老師與學生畫面會即時看到回覆列表與文字雲
- 老師可按「清空本輪」切到新題次，畫面歸零後可重複使用
- 自動統計詞頻並生成互動式文字雲
- 已接上 Firebase Hosting 設定
- Firestore 規則允許新增短回覆，禁止修改或刪除單筆回覆

## 線上網址

- Hosting：`https://teaching-3809d.web.app`
- GitHub：`https://github.com/594katchang-source/teaching-wordcloud`

## Firebase 設定

- Firebase 專案名稱：`teaching`
- Firebase project id：`teaching-3809d`
- Firestore 位置：`asia-east1 (Taiwan)`
- Hosting 目錄：`public`

前端 Firebase 設定改由 `public/firebase-config.js` 注入。這個檔案不能提交到 GitHub，repo 只保留 `public/firebase-config.example.js` 作為格式範例。

建立本機設定檔：

```powershell
Copy-Item public\firebase-config.example.js public\firebase-config.js
```

再把 `public/firebase-config.js` 內的值換成已限制來源網域與 API 權限的 Firebase Web App 設定。

## 安全處理

- `public/app.js` 不能硬寫 Google API key 或 Firebase API key。
- `public/firebase-config.js` 已列入 `.gitignore`。
- 若 GitHub Secret Scanning 曾回報 key，需到 Google Cloud Console 或 Firebase Console 輪換或停用舊 key。
- Firebase Web API key 必須限制 HTTP referrer，只允許正式網域與本機測試網域。
- Firestore rules 目前允許公開讀取 `class_sessions/default` 與本輪回覆，允許匿名新增 300 字以內回覆。
- Firestore rules 禁止匿名修改或刪除單筆回覆。
- 「清空本輪」採用切換新題次，不會刪除 Firestore 舊回覆。
- 這是課堂現場 demo 設計。若要避免學生按清空，需再加老師專用入口、登入、App Check 或後端控制。

## 本機操作

```powershell
firebase.cmd serve
firebase.cmd deploy
firebase.cmd deploy --only firestore:rules
```

## Firestore 煙霧測試

測試腳本會讀取本機忽略檔 `public/firebase-config.js`，不會把 API key 輸出到終端或寫進 repo。

舊版完整寫入與讀回測試使用 `wordcloud_words/codex_smoke_20260623`。新版課堂回饋功能使用 `class_sessions/default/rounds/{roundId}/responses`。

```powershell
$env:NODE_OPTIONS='--use-system-ca'
node tools\firestore-smoke-test.mjs
node tools\firestore-smoke-test.mjs --read-only
node tools\firestore-smoke-test.mjs --expect-write-denied
```

## 主要檔案

- `public/index.html`
- `public/styles.css`
- `public/app.js`
- `public/firebase-config.example.js`
- `tools/firestore-smoke-test.mjs`
- `firebase.json`
- `firestore.rules`

## 實測結果

- 已實測文字雲本體功能可在沒有 Firebase 設定時運作。
- 已實測舊版可寫入 `wordcloud_words/latest` 與讀回資料。
- 2026-06-23 安全修正後，匿名寫入已由 Firestore rules 關閉，需完成登入、App Check 或活動碼流程後再恢復寫入功能。
- 2026-06-23 煙霧測試確認可短期寫入 `wordcloud_words/codex_smoke_20260623` 並讀回，恢復規則後匿名寫入會回到 403。
- 2026-07-05 已改成課堂即時回饋版，匿名學生可新增 300 字以內回覆，頁面可即時讀取並更新文字雲。
- 2026-07-05 已實測建立題次、匿名送出、讀回回覆、清空到新題次皆成功。
