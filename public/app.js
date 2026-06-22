const demoText = `營養教育 健康促進 高齡飲食 教學設計 互動課程 社區衛教
高齡營養 高齡營養 慢性病飲食 飲食評估 食材選擇
教學 教學 教學 溝通 實作 問答 動機 行為改變
健康促進 健康促進 肌少症 蛋白質 水分 蔬果 全穀`;

const cloud = document.querySelector("#cloud");
const sourceText = document.querySelector("#source-text");
const topWords = document.querySelector("#top-words");
const summary = document.querySelector("#summary");
const renderButton = document.querySelector("#render-cloud");
const demoButton = document.querySelector("#load-demo");

const palette = ["#d5542f", "#1f7a8c", "#f2b134", "#6b8e23", "#6c4ab6", "#2d4059"];

sourceText.value = demoText;

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
}

renderButton.addEventListener("click", updateCloud);
demoButton.addEventListener("click", () => {
  sourceText.value = demoText;
  updateCloud();
});

sourceText.addEventListener("input", () => {
  window.clearTimeout(sourceText._typingTimer);
  sourceText._typingTimer = window.setTimeout(updateCloud, 280);
});

updateCloud();
