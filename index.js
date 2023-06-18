// Variables
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const FPS = 60;
const INTERVAL = Math.round(1000 / FPS) // ms

var gravity = 0.3;
var circles = [];
// var mouse = {
//   x: innerWidth / 2,
//   y: innerHeight / 2,
// };
var center = {
  x: innerWidth / 2,
  y: innerHeight / 2,
}
// var oldCenter = {
//   x: innerWidth / 2,
//   y: innerHeight / 2,
// }
var circleRadius = 80;
var bgColor = hexToRGB('#475C7A', 0.4);
var colors = [
  '#FCBB6D',
  '#D8737F',
  '#AB6C8C',
  '#685D79'
];

// Objects
class Circle {
  constructor(x, y, radius, angle, mass, color) {
    this.x = x;
    this.y = y;
    this.distance = circleRadius;
    this.radius = radius;
    this.angle = angle;
    this.mass = mass;
    this.color = color;
    this.velocity = {
      h: 0,
      v: 0
    };
    this.wallFriction = 0.80;
    this.airFriction = 0.995;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(dpi(this.x), dpi(this.y), dpi(this.radius), 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  update() {
    this.distance = getDistance(this.x, this.y, center.x, center.y);

    if (this.distance - this.radius + this.velocity.v + gravity < circleRadius) {
      this.velocity.h *= this.wallFriction;
      this.velocity.v = -this.velocity.v * this.wallFriction;

      this.distance = circleRadius + this.radius;
    } else {
      this.velocity.v -= gravity;
    }

    this.velocity.h *= this.airFriction;
    this.velocity.v *= this.airFriction;

    if (this.angle + this.velocity.h < 0) {
      this.angle = 2 * Math.PI;
    } else if (this.angle + this.velocity.h > 2 * Math.PI) {
      this.angle = 0;
    } else {
      this.angle += this.velocity.h;
    }

    this.distance += this.velocity.v;

    this.x = center.x + (Math.cos(this.angle) * (this.distance));
    this.y = center.y + (Math.sin(this.angle) * (this.distance));
  }

  jump(force) {
    const hForce = randomIntFromRange(-force, force) / 40;
    const vForce = force * 60;
    this.velocity.h = hForce / this.mass;
    this.velocity.v = vForce / this.mass;
  }
}


// Functions
function initScene() {
  circles = [];
  center = {
    x: innerWidth / 2,
    y: innerHeight / 2,
  }

  for (let i = 0; i < 70; i++) {
    const radius = randomIntFromRange(6, 12);
    const mass = 30 + radius;
    const color = randomValueFromArray(colors);
    const angle = randomIntFromRange(0, 2 * Math.PI, false);
    let x = innerWidth / 2;
    let y = innerHeight / 2;
    x += Math.cos(angle) * (circleRadius + radius);
    y += Math.sin(angle) * (circleRadius + radius);

    circles.push(new Circle(x, y, radius, angle, mass, color));
  }
}

function updateGameLogic() {
  for (let i = 0; i < circles.length; i++) {
    const circle = circles[i];
    circle.update();
  }
}

function updateGameDisplay() {
  ctx.beginPath()
  ctx.rect(0, 0, dpi(innerWidth), dpi(innerHeight));
  ctx.fillStyle = bgColor;
  ctx.fill();

  for (let i = 0; i < circles.length; i++) {
    const circle = circles[i];
    circle.draw();
  }

  requestAnimationFrame(updateGameDisplay);
}

function resizeWindow() {
  canvas.width = dpi(window.innerWidth);
  canvas.height = dpi(window.innerHeight);
}


// Initializations
initScene();
let gameLogicInterval = new AdjustingInterval(updateGameLogic, INTERVAL);
gameLogicInterval.start();
updateGameDisplay();
resizeWindow();


// Event Listeners
window.addEventListener('resize', function () {
  resizeWindow();
  initScene();
});

window.addEventListener('click', function () {
  for (let i = 0; i < circles.length; i++) {
    const circle = circles[i];

    circle.jump(8);
  }
});

document.getElementById('back').addEventListener('click', function(e) {
  e.stopPropagation();
});