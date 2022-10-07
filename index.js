const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

let points = [];
let canDraw = false;
let strokeStyle = "#000";
let lineWidth = 5;

configContextForDrawing();

/* ****** ELEMENTS ****** */

// btn - save
const saveButton = document.querySelector(".save");
saveButton.addEventListener("click", (e) => {
  const image = canvas.toDataURL('image/png');
  const a = document.createElement("a");
  a.href = image;
  a.download = "canvas.png";
  a.click();
  document.body.append(a);
  document.body.removeChild(a);
});

// btn - delete
const deleteButton = document.querySelector(".delete");
deleteButton.addEventListener("click", (e) => { clean() })

// btn - color picker
const colorPicker = document.querySelector("#color");
colorPicker.addEventListener("change", (e) => {
  strokeStyle = e.target.value;
  draw()
});

// btn - stroke
const strokeInput = document.querySelector("#stroke");
strokeInput.addEventListener("change", (e) => {
  lineWidth = e.target.value;
  draw();
});

/* ****** CANVAS - EVENTS ****** */

canvas.addEventListener('mousedown', ({ clientX, clientY }) => {
  canDraw = true;
  savePoint(clientX, clientY, false);
  draw();
});

canvas.addEventListener('mousemove', ({ clientX, clientY }) => {
  if (canDraw) {
    savePoint(clientX, clientY, true);
    draw();
  }
});

canvas.addEventListener('mouseup', (e) => { canDraw = false });
canvas.addEventListener('mouseleave', (e) => { canDraw = false });

/* ****** FUNCTIONS ****** */

function savePoint(x, y, dragging) {
  const area = canvas.getBoundingClientRect();
  const point = { x: x - area.left, y: y - area.top, dragging };
  points.push(point);
}

function draw() {
  configContextForDrawing();

  for (var i = 0; i < points.length; i++) {
    context.beginPath();
    const point = points[i];
    if (point.dragging && i > 0) {
      const previousPoint = points[i - 1];
      context.moveTo(previousPoint.x, previousPoint.y);
    } else {
      context.moveTo(point.x - 1, point.y);
    }
    context.lineTo(point.x, point.y);
    context.closePath();
    context.stroke();
  }
}

function configContextForDrawing() {
  context.fillStyle = "white";
  context.fillRect(0, 0, context.canvas.width, context.canvas.height);
  context.strokeStyle = strokeStyle;
  context.lineJoin = "round";
  context.lineWidth = lineWidth;
}

function clean() {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  context.fillStyle = "white";
  context.fillRect(0, 0, context.canvas.width, context.canvas.height);
  points = [];
}