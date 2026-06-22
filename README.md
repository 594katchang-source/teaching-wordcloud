# teaching

這是放在 Firebase Hosting 的教學型文字雲頁面。

## 目前內容

- 可輸入中文或英文文字
- 自動統計詞頻
- 即時生成互動式文字雲
- 可切換示範資料
- 已接上 Firebase Hosting 設定
- 可把目前文字存進 Firestore
- 可從 Firestore 讀回最新一筆文字雲資料

## 線上網址

- Hosting：`https://teaching-3809d.web.app`
- GitHub：`https://github.com/594katchang-source/teaching-wordcloud`

## Firebase 設定

- Firebase 專案名稱：`teaching`
- Firebase project id：`teaching-3809d`
- Firestore 位置：`asia-east1 (Taiwan)`
- Hosting 目錄：`public`

## 本機操作

```powershell
firebase.cmd serve
firebase.cmd deploy
```

## 主要檔案

- `public/index.html`
- `public/styles.css`
- `public/app.js`
- `firebase.json`
- `firestore.rules`

## 實測結果

- 已實測寫入 `wordcloud_words/latest`
- 已實測從 `wordcloud_words/latest` 讀回資料
