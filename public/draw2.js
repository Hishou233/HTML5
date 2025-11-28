// --- 基本設定 ---
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var toshow = document.getElementById('toshow');
var show = document.getElementById('show');
var clear = document.getElementById('clear');
var color = document.getElementById("color");
var lineWidth = document.getElementById("lineWidth");
const value = document.getElementById("value");

var drawing = false;
var queue = [];
var history = [];   // 紀錄畫布狀態 (Undo)
var redoStack = []; // Redo
var currentTool = "pen"; // 工具：pen, line, rect, circle, eraser
var startX, startY; // 起點

// --- 預設筆刷 ---
ctx.lineWidth = lineWidth.value;
ctx.strokeStyle = color.value;
ctx.lineCap = 'round';
ctx.lineJoin = 'round';
value.textContent = lineWidth.value;

// --- 繪圖主函式 ---
function drawLine(ctx, x, y, x1, y1) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x1, y1);
  ctx.stroke();
  ctx.closePath();
}

// --- 滑鼠事件 ---
canvas.addEventListener('mousedown', function (e) {
  drawing = true;
  startX = e.offsetX;
  startY = e.offsetY;
  queue.push([startX, startY]);

  // 每次繪圖開始前清空 redoStack
  redoStack = [];
});

canvas.addEventListener('mousemove', function (e) {
  if (!drawing) return;
  var x = e.offsetX;
  var y = e.offsetY;

  ctx.lineWidth = lineWidth.value;

  if (currentTool === 'pen' || currentTool === 'eraser') {
    var old = queue.shift();
    drawLine(ctx, old[0], old[1], x, y);
    queue.push([x, y]);
  } else {
    // 預覽效果
    var tempCanvas = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.putImageData(tempCanvas, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(history[history.length - 1], 0, 0);

    switch (currentTool) {
      case 'line':
        drawShape('line', startX, startY, x, y);
        break;
      case 'rect':
        drawShape('rect', startX, startY, x, y);
        break;
      case 'circle':
        drawShape('circle', startX, startY, x, y);
        break;
    }
  }
});

canvas.addEventListener('mouseup', function (e) {
  if (!drawing) return;
  drawing = false;

  var x = e.offsetX;
  var y = e.offsetY;

  if (currentTool === 'pen' || currentTool === 'eraser') {
    var old = queue.shift();
    drawLine(ctx, old[0], old[1], x, y);
  } else {
    drawShape(currentTool, startX, startY, x, y);
  }

  // 儲存畫布狀態 (Undo)
  saveHistory();
});

// --- 繪圖函式 ---
function drawShape(tool, x0, y0, x1, y1) {
  ctx.beginPath();
  switch (tool) {
    case 'line':
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      break;
    case 'rect':
      ctx.rect(x0, y0, x1 - x0, y1 - y0);
      break;
    case 'circle':
      let r = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
      ctx.arc(x0, y0, r, 0, 2 * Math.PI);
      break;
  }
  ctx.stroke();
  ctx.closePath();
}

// --- 橡皮擦模式 ---
var eraserBtn = document.getElementById("eraser");
eraserBtn.addEventListener('click', function () {
  currentTool = "eraser";
  ctx.globalCompositeOperation = 'destination-out';
});

var penBtn = document.getElementById("pen");
penBtn.addEventListener('click', function () {
  currentTool = "pen";
  ctx.globalCompositeOperation = 'source-over';
  ctx.strokeStyle = color.value;
});

// --- 設定顏色、粗細 ---
color.addEventListener("input", (e) => {
  ctx.strokeStyle = e.target.value;
});
lineWidth.addEventListener("input", (e) => {
  value.textContent = e.target.value;
  ctx.lineWidth = e.target.value;
});

// --- 筆刷樣式 ---
var lineCapSelect = document.getElementById("lineCap");
var lineJoinSelect = document.getElementById("lineJoin");

lineCapSelect.addEventListener("change", (e) => {
  ctx.lineCap = e.target.value;
});
lineJoinSelect.addEventListener("change", (e) => {
  ctx.lineJoin = e.target.value;
});

// --- Undo / Redo ---
function saveHistory() {
  history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  if (history.length > 30) history.shift(); // 限制最多30步
}

document.getElementById('undo').addEventListener('click', function () {
  if (history.length > 1) {
    redoStack.push(history.pop());
    let prev = history[history.length - 1];
    ctx.putImageData(prev, 0, 0);
  }
});

document.getElementById('redo').addEventListener('click', function () {
  if (redoStack.length > 0) {
    let img = redoStack.pop();
    history.push(img);
    ctx.putImageData(img, 0, 0);
  }
});

// --- 生成圖片 ---
toshow.addEventListener('click', function () {
  var url = canvas.toDataURL();
  show.src = url;
});

// --- 清除畫布 ---
clear.addEventListener('click', function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  history = [];
  redoStack = [];
});

// --- 初始化 ---
saveHistory();