import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import {
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const firebaseConfig = window.TEACHING_WORDCLOUD_FIREBASE_CONFIG;

let db = null;
let latestDocRef = null;

const cloud = document.querySelector("#cloud");
const sourceText = document.querySelector("#source-text");
const topWords = document.querySelector("#top-words");
const summary = document.querySelector("#summary");
const statusText = document.querySelector("#db-status");
const renderButton = document.querySelector("#render-cloud");
const saveButton = document.querySelector("#save-firestore");
const readButton = document.querySelector("#read-firestore");

const palette = ["#d5542f", "#1f7a8c", "#f2b134", "#6b8e23", "#6c4ab6", "#2d4059"];

function setStatus(message) {
  statusText.textContent = `資料庫狀態：${message}`;
}

function hasFirebaseConfig(config) {
  return Boolean(
    config &&
      typeof config === "object" &&
      typeof config.apiKey === "string" &&
      typeof config.authDomain === "string" &&
      typeof config.projectId === "string" &&
      typeof config.appId === "string"
  );
}

function initializeDatabase() {
  if (!hasFirebaseConfig(firebaseConfig)) {
    saveButton.disabled = true;
    readButton.disabled = true;
    setStatus("尚未設定 Firebase，文字雲功能可正常使用");
    return;
  }

  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  latestDocRef = doc(db, "wordcloud_words", "latest");
  setStatus("Firebase 已設定，尚未做資料庫操作");
}

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[，。、「」；：！？,.!?()[\]{}"'`~@#$%^&*_+=\\/|-]/g, " ")
    .split(/\s+/)
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
}

function analyze(text) {
  const tokens = tokenize(text);
  const counts = new Map();

  for (const token of tokens) {
    counts.set(token, (counts.get(token) || 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-Hant"))
    .map(([word, count]) => ({ word, count }));
}

function polarPosition(index, total) {
  const angle = index * 137.5;
  const radius = 18 + Math.sqrt(index / Math.max(total, 1)) * 180;
  return {
    x: Math.cos((angle * Math.PI) / 180) * radius,
    y: Math.sin((angle * Math.PI) / 180) * radius
  };
}

function renderTopWords(items) {
  topWords.innerHTML = "";

  items.slice(0, 8).forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `${index + 1}. ${item.word}  ${item.count}`;
    topWords.appendChild(li);
  });
}

function renderCloud(items) {
  cloud.innerHTML = "";

  if (!items.length) {
    summary.textContent = "沒有可分析的文字";
    return;
  }

  const maxCount = items[0].count;
  const totalWords = items.reduce((sum, item) => sum + item.count, 0);
  summary.textContent = `共 ${items.length} 個詞，總字詞數 ${totalWords}`;

  items.slice(0, 30).forEach((item, index) => {
    const wordNode = document.createElement("span");
    const ratio = item.count / maxCount;
    const fontSize = 18 + ratio * 46;
    const rotation = index % 5 === 0 ? -16 : index % 4 === 0 ? 14 : 0;
    const position = polarPosition(index, items.length);

    wordNode.className = "cloud-word";
    wordNode.textContent = item.word;
    wordNode.style.fontSize = `${fontSize}px`;
    wordNode.style.color = palette[index % palette.length];
    wordNode.style.transform = `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) rotate(${rotation}deg)`;
    wordNode.style.animationDelay = `${index * 30}ms`;
    cloud.appendChild(wordNode);
  });
}

function updateCloud() {
  const items = analyze(sourceText.value);
  renderTopWords(items);
  renderCloud(items);
  return items;
}

function assertDatabaseReady() {
  if (!latestDocRef) {
    throw new Error("尚未設定 Firebase，無法使用 Firestore");
  }
}

async function saveLatestWordCloud() {
  assertDatabaseReady();
  const items = updateCloud();
  setStatus("寫入中");
  console.log("saveLatestWordCloud:start", { textLength: sourceText.value.length });

  try {
    await setDoc(latestDocRef, {
      text: sourceText.value,
      summary: summary.textContent,
      topWords: items.slice(0, 8),
      wordCount: items.length,
      totalTokenCount: items.reduce((sum, item) => sum + item.count, 0),
      updatedAt: serverTimestamp(),
      updatedAtClient: new Date().toISOString()
    });
    console.log("saveLatestWordCloud:success");
    setStatus("已成功寫入 Firestore");
  } catch (error) {
    console.error("saveLatestWordCloud:error", error);
    setStatus(`寫入失敗：${error.message}`);
    throw error;
  }
}

async function readLatestWordCloud() {
  assertDatabaseReady();
  setStatus("讀取中");
  console.log("readLatestWordCloud:start");
  try {
    const snapshot = await getDoc(latestDocRef);

    if (!snapshot.exists()) {
      console.warn("readLatestWordCloud:not-found");
      setStatus("找不到 latest 文件");
      return null;
    }

    const data = snapshot.data();
    sourceText.value = data.text || "";
    const items = Array.isArray(data.topWords) ? data.topWords : analyze(sourceText.value);
    renderTopWords(items);
    renderCloud(Array.isArray(data.topWords) ? analyze(sourceText.value) : items);
    summary.textContent = data.summary || summary.textContent;
    console.log("readLatestWordCloud:success", data);
    setStatus(`已成功讀取 Firestore，最後更新 ${data.updatedAtClient || "未知"}`);
    return data;
  } catch (error) {
    console.error("readLatestWordCloud:error", error);
    setStatus(`讀取失敗：${error.message}`);
    throw error;
  }
}

renderButton.addEventListener("click", () => {
  updateCloud();
});

saveButton.addEventListener("click", async () => {
  await saveLatestWordCloud();
});

readButton.addEventListener("click", async () => {
  await readLatestWordCloud();
});

sourceText.addEventListener("input", () => {
  window.clearTimeout(sourceText._typingTimer);
  sourceText._typingTimer = window.setTimeout(updateCloud, 280);
});

updateCloud();
initializeDatabase();
