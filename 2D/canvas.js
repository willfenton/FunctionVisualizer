// ---- canvas boilerplate
// gets the canvas element
var canvas = document.getElementById("canvas");

// set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// canvas context
// used to draw on the canvas
if (canvas.getContext) {
    var ctx = canvas.getContext('2d');
} else {
    // canvas-unsupported code here
    console.log("looks like your browser doesn't support HTML canvas :( big sad");
}

// ---- mouse controls

// track whether left mouse button is pressed
var mouse_down = 0;
document.body.onmousedown = function() {
  mouse_down = true;
}
document.body.onmouseup = function() {
  mouse_down = false;
}

// mouse position variables
var mouse_x = 0;
var mouse_y = 0;
var mouse_px_delta = 0;
var mouse_py_delta = 0;

// handle mouse movement
document.onmousemove = handleMouseMove;
function handleMouseMove(event) {
    mouse_px_delta = event.pageX - mouse_x;
    mouse_py_delta = event.pageY - mouse_y;

    mouse_x = event.pageX;
    mouse_y = event.pageY;
}

// handle scroll wheel zoom in / out
window.addEventListener("wheel", event => {
    const sign = Math.sign(event.deltaY);

    let x_fraction = mouse_x / canvas.width;
    let x_delta = sign * (max_x - min_x) * scroll_zoom_multiplier;
    max_x += (1 - x_fraction) * (x_delta / 2);
    min_x -= x_fraction * (x_delta / 2);

    let y_fraction = mouse_y / canvas.height;
    let y_delta = sign * (max_y - min_y) * scroll_zoom_multiplier;
    max_y += (1 - y_fraction) * (y_delta / 2);
    min_y -= y_fraction * (y_delta / 2);
});

// ---- transformation functions
function px_to_x(px) {
    return (px / canvas.width) * (max_x - min_x) + min_x;
}

function py_to_y(py) {
    return (py / canvas.height) * (max_y - min_y) + min_y;
}

function x_to_px(x) {
    return canvas.width * ((x - min_x) / (max_x - min_x));
}

function y_to_py(y) {
    return canvas.height * ((y - min_y) / (max_y - min_y));
}

// ---- plot class
class Plot {
    constructor(equation, color) {
        this.equation = equation;
        this.color = color;
    }

    draw() {
        var last_px = NaN;
        var last_py = NaN;
        for (var x = min_x; x <= max_x; x += step) {
            var px = x_to_px(x);
            var value = this.equation.replace(/x/gi, x);
            var y = -math.evaluate(value);

            var py = y_to_py(y);

            if (!isNaN(y) && last_px != NaN && last_py != NaN) {
                    ctx.strokeStyle = this.color;
                    ctx.beginPath();
                    ctx.moveTo(last_px, last_py);
                    ctx.lineTo(px, py);
                    ctx.stroke();
            }

            last_px = px;
            last_py = py;
        }
    }
}

const plots = [];

// ---- app stuff
function drawGrid() {
    var gridColor = "#2e2e2e";
    var axisColor = "#999";

    for (var x = Math.round(min_x); x <= max_x; x++) {
        var px = x_to_px(x);

        ctx.beginPath();
        ctx.strokeStyle = gridColor;
        ctx.moveTo(px, 0);
        ctx.lineTo(px, canvas.height);
        ctx.stroke();
    }

    for (var y = Math.round(min_y); y <= max_y; y++) {
        var py = y_to_py(y);

        ctx.beginPath();
        ctx.strokeStyle = gridColor;
        ctx.moveTo(0, py);
        ctx.lineTo(canvas.width, py);
        ctx.stroke();
    }

    // draw thicker line for x=0
    ctx.beginPath();
    ctx.strokeStyle = axisColor;
    ctx.lineWidth = 2;
    ctx.moveTo(x_to_px(0), 0);
    ctx.lineTo(x_to_px(0), canvas.height);
    ctx.stroke();

    // draw thicker line for y=0
    ctx.beginPath();
    ctx.strokeStyle = axisColor;
    ctx.lineWidth = 2;
    ctx.moveTo(0, y_to_py(0));
    ctx.lineTo(canvas.width, y_to_py(0));
    ctx.stroke();
}

function drawCircle(x, y, radius, colour) {
    ctx.strokeStyle = colour;
    ctx.fillStyle = colour;

    ctx.beginPath();

    ctx.arc(x, y, radius, 0, 2*Math.PI, false);

    ctx.stroke();
    ctx.fill();
}

function plotFunctions() {
    let inputs = document.querySelectorAll("input.function-input");
    for (const i in plots) {
        plots[i].equation = inputs[i].value;
        plots[i].draw();
    }
}

// ---- x and y ranges to display
var min_x = -10.0;
var max_x = 10.0;

var pixels_per_unit = window.innerWidth / (max_x - min_x);

var y_units = window.innerHeight / pixels_per_unit;

var min_y = -y_units / 2;
var max_y = y_units / 2;

// incremented every frame, can use to animate
var timestep = 0;

// number of points, evenly spaced in x range
var num_points = 600;

// distance between points
var step = (max_x - min_x) / num_points;

// radius of points drawn
var point_size = 2.0;

var x_steps = 600;
var x_shift = 0.0;

var scroll_zoom_multiplier = 0.1;

function randomColor() {
    // returns a random color value as HSL value
    let color = "hsl(";
    color += Math.floor(Math.random() * 256);
    color += ",100%,50%)";
    return color;
}

function newPlot() {
    // add DOM input
    var input = document.createElement("input");
    input.type = "text";
    input.placeholder = "type function here";
    input.className = "function-input ui";
    document.getElementById("plot-inputs").appendChild(input);

    // adds a plot to the list
    plots.push(new Plot(0, randomColor()));
}

newPlot();

// ---- canvas callback loop
function animate() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // clear the canvas
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // call animate in a loop for each frame
    requestAnimationFrame(animate);

    ctx.save();

    drawGrid();

    plotFunctions();

    ctx.restore();

    timestep++;

    if (mouse_down) {
        min_x += (-1 * mouse_px_delta / canvas.width) * (max_x - min_x);
        max_x += (-1 * mouse_px_delta / canvas.width) * (max_x - min_x);

        min_y += (-1 * mouse_py_delta / canvas.height) * (max_y - min_y);
        max_y += (-1 * mouse_py_delta / canvas.height) * (max_y - min_y);
    }

    // x_shift = (timestep % x_steps) * 2 * Math.PI / x_steps;

    step = (max_x - min_x) / num_points;

    mouse_px_delta = 0;
    mouse_py_delta = 0;
}

// start the above loop
animate();
