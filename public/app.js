import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const firebaseConfig = window.TEACHING_WORDCLOUD_FIREBASE_CONFIG;

let db = null;
let sessionRef = null;
let activeRoundId = "";
let unsubscribeSession = null;
let unsubscribeResponses = null;
let responses = [];

const cloud = document.querySelector("#cloud");
const responseText = document.querySelector("#response-text");
const topWords = document.querySelector("#top-words");
const summary = document.querySelector("#summary");
const statusText = document.querySelector("#db-status");
const submitButton = document.querySelector("#submit-response");
const clearButton = document.querySelector("#clear-round");
const responseList = document.querySelector("#response-list");
const responseCount = document.querySelector("#response-count");
const classQr = document.querySelector("#class-qr");
const classUrl = document.querySelector("#class-url");

const palette = ["#d5542f", "#1f7a8c", "#f2b134", "#6b8e23", "#6c4ab6", "#2d4059"];
const sessionId = "default";
const clientIdKey = "teaching-wordcloud-client-id";

function setStatus(message) {
  statusText.textContent = `資料庫狀態：${message}`;
}

function getClientId() {
  const stored = window.localStorage.getItem(clientIdKey);

  if (stored) {
    return stored;
  }

  const generated = `client-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  window.localStorage.setItem(clientIdKey, generated);
  return generated;
}

function getClassUrl() {
  return `${window.location.origin}${window.location.pathname}`;
}

function setupQrCode() {
  const url = getClassUrl();
  classUrl.href = url;
  classUrl.textContent = url;
  classQr.src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(url)}`;
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
    submitButton.disabled = true;
    clearButton.disabled = true;
    setStatus("尚未設定 Firebase，無法接收學生回覆");
    return;
  }

  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  sessionRef = doc(db, "class_sessions", sessionId);
  watchSession();
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
  const joinedText = responses.map((response) => response.text).join("\n");
  const items = analyze(joinedText);
  renderTopWords(items);
  renderCloud(items);
  return items;
}

function assertDatabaseReady() {
  if (!sessionRef) {
    throw new Error("尚未設定 Firebase，無法使用 Firestore");
  }
}

function renderResponses() {
  responseList.innerHTML = "";
  responseCount.textContent = `${responses.length} 則`;

  responses.slice(0, 20).forEach((response) => {
    const item = document.createElement("li");
    item.textContent = response.text;
    responseList.appendChild(item);
  });

  updateCloud();
}

function makeRoundId() {
  const stamp = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
  return `round_${stamp}_${Math.random().toString(16).slice(2, 8)}`;
}

async function startNewRound() {
  assertDatabaseReady();
  const newRoundId = makeRoundId();
  activeRoundId = newRoundId;
  watchResponses(activeRoundId);

  await setDoc(sessionRef, {
    activeRoundId: newRoundId,
    updatedAt: serverTimestamp(),
    updatedAtClient: new Date().toISOString()
  });
}

async function submitResponse() {
  assertDatabaseReady();
  const text = responseText.value.trim();

  if (!text) {
    setStatus("請先輸入回覆");
    return;
  }

  if (!activeRoundId) {
    await startNewRound();
  }

  submitButton.disabled = true;
  setStatus("送出中");

  try {
    await addDoc(collection(db, "class_sessions", sessionId, "rounds", activeRoundId, "responses"), {
      text,
      clientId: getClientId(),
      createdAt: serverTimestamp(),
      createdAtClient: new Date().toISOString()
    });

    responseText.value = "";
    setStatus("已送出，文字雲會自動更新");
  } catch (error) {
    setStatus(`送出失敗：${error.message}`);
    throw error;
  } finally {
    submitButton.disabled = false;
  }
}

function watchSession() {
  unsubscribeSession?.();
  unsubscribeSession = onSnapshot(sessionRef, async (snapshot) => {
    if (!snapshot.exists()) {
      setStatus("建立課堂題次中");
      await startNewRound();
      return;
    }

    const data = snapshot.data();
    const nextRoundId = data.activeRoundId || "";

    if (nextRoundId && nextRoundId !== activeRoundId) {
      activeRoundId = nextRoundId;
      watchResponses(activeRoundId);
    }

    setStatus(`即時連線中，本輪 ${activeRoundId || "尚未建立"}`);
  }, (error) => {
    setStatus(`連線失敗：${error.message}`);
  });
}

function watchResponses(roundId) {
  unsubscribeResponses?.();
  responses = [];
  renderResponses();

  const responsesQuery = query(
    collection(db, "class_sessions", sessionId, "rounds", roundId, "responses"),
    orderBy("createdAtClient", "desc"),
    limit(200)
  );

  unsubscribeResponses = onSnapshot(responsesQuery, (snapshot) => {
    responses = snapshot.docs
      .map((document) => ({ id: document.id, ...document.data() }))
      .filter((response) => typeof response.text === "string" && response.text.trim().length > 0);
    renderResponses();
  }, (error) => {
    setStatus(`讀取回覆失敗：${error.message}`);
  });
}

submitButton.addEventListener("click", async () => {
  await submitResponse();
});

clearButton.addEventListener("click", async () => {
  clearButton.disabled = true;
  try {
    await startNewRound();
    responseText.value = "";
    setStatus("已清空本輪，等待新回覆");
  } catch (error) {
    setStatus(`清空失敗：${error.message}`);
    throw error;
  } finally {
    clearButton.disabled = false;
  }
});

responseText.addEventListener("keydown", async (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    await submitResponse();
  }
});

setupQrCode();
updateCloud();
initializeDatabase();
