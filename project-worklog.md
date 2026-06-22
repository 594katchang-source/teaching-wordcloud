# teaching 工作日誌

## 2026-06-22

### 任務

- 依影片教學建立 `teaching` 的 Firebase 專案骨架與工作模式。
- 完成 Firebase CLI 登入、綁定實際 project id、部署 Firestore 規則。

### 主要輸出

- 建立 `AGENTS.md`
- 建立 `README.md`
- 建立 `.gitignore`
- 建立 `firebase.json`
- 建立 `.firebaserc`
- 建立 `firestore.rules`
- 將 `.firebaserc` 綁定到 `teaching-3809d`

### 驗證

- 已確認專案骨架檔案存在。
- 已確認 `Codex` 與 `Antigravity` 都已安裝 `startup-sync`、`shutdown-sync`、`project-init-sync`。
- 已確認 `Codex` 與 `Antigravity` 的 Firebase MCP 設定已寫入。
- 已確認 Firebase CLI 已登入 `594katchang@gmail.com`。
- 已確認 Firebase 專案 `teaching` 的 project id 是 `teaching-3809d`。
- 已確認 `firebase deploy --only firestore:rules` 部署成功。
- 已確認 Firestore 資料庫存在，路徑為 `projects/teaching-3809d/databases/(default)`。

### 錯誤或風險

- 若要在目前這個對話直接看到 Firebase MCP 工具，通常仍需要重開 Codex 或重新載入對應應用。

### 新學到的規則

- 雲端硬碟不是硬性前提，本機資料夾可作為正式工作目錄。
- Firebase Console 的顯示名稱與 project id 可能不同，建立後要以 `projects:list` 回寫真正的 project id。
- Firestore 規則部署成功與 `(default)` 資料庫存在，可作為 Firebase 安裝完成的重要驗證點。

### 回寫狀態

- `AGENTS.md`：已建立並更新
- `project-worklog.md`：已建立並更新
