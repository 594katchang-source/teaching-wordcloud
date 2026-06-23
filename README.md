# teaching

這是放在 Firebase Hosting 的教學型文字雲頁面。

## 目前內容

- 可輸入中文或英文文字
- 自動統計詞頻
- 即時生成互動式文字雲
- 可切換示範資料
- 已接上 Firebase Hosting 設定
- 可從 Firestore 讀回最新一筆文字雲資料
- Firestore 寫入目前先關閉匿名權限，等加入登入、App Check 或活動碼後再開放

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
- Firestore rules 目前允許讀取 `wordcloud_words/{document}`，禁止匿名寫入。

## 本機操作

```powershell
firebase.cmd serve
firebase.cmd deploy
firebase.cmd deploy --only firestore:rules
```

## 主要檔案

- `public/index.html`
- `public/styles.css`
- `public/app.js`
- `public/firebase-config.example.js`
- `firebase.json`
- `firestore.rules`

## 實測結果

- 已實測文字雲本體功能可在沒有 Firebase 設定時運作。
- 已實測舊版可寫入 `wordcloud_words/latest` 與讀回資料。
- 2026-06-23 安全修正後，匿名寫入已由 Firestore rules 關閉，需完成登入、App Check 或活動碼流程後再恢復寫入功能。
