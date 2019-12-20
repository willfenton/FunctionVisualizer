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

function px_to_x(px) {
    return (px / canvas.width) * (max_x - min_x);
}

function py_to_y(py) {
    return (py / canvas.height) * (max_y - min_y);
}

function x_to_px(x) {
    return canvas.width * ((x - min_x) / (max_x - min_x))
}

function y_to_py(y) {
    return canvas.height * ((y - min_y) / (max_y - min_y))
}

// ---- app stuff
function drawGrid() {
    for (var x = Math.round(min_x); x <= max_x; x++) {
        var px = x_to_px(x);
        // var px = canvas.width * (0.5 + ((x) / (max_x - min_x)));

        ctx.beginPath();
        ctx.strokeStyle = "#2e2e2e"
        ctx.moveTo(px, 0);
        ctx.lineTo(px, canvas.height);
        ctx.stroke();
    }

    for (var y = min_y; y <= max_y; y++) {
        var py = y_to_py(y);
        
        ctx.beginPath();
        ctx.strokeStyle = "#2e2e2e"
        ctx.moveTo(0, py);
        ctx.lineTo(canvas.width, py);
        ctx.stroke();
    }
}

function drawCircle(x, y, radius, colour) {
    ctx.strokeStyle = colour;
    ctx.fillStyle = colour;

    ctx.beginPath();

    ctx.arc(x, y, radius, 0, 2*Math.PI, false);

    ctx.stroke();
    ctx.fill();
}

function plotFunction() {
    var last_px = NaN;
    var last_py = NaN;
    for (var px = 0; px <= canvas.width; px += step) {
        var x = px_to_x(px);
        var y = Math.sin(x + x_shift);

        var py = y_to_py(y);

        drawCircle(px, py, point_size, "#00ff00");

        if (last_px != NaN && last_py != NaN) {
            ctx.strokeStyle = "#00ff00";    
            ctx.beginPath();
            ctx.moveTo(last_px, last_py);
            ctx.lineTo(px, py);
            ctx.stroke();
        }

        last_px = px;
        last_py = py;
    }
}

var min_x = 2 * -2 * Math.PI;
var max_x = 2 * 2 * Math.PI;

var min_y = -3.0;
var max_y = 3.0;

var timestep = 0;

var num_points = 100;
var step = window.innerWidth / num_points;

var point_size = 4.0;

var x_steps = 1200;
var x_shift = 0.0;

// ---- canvas callback loop
function animate() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // clear the canvas
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    
    // call animate in a loop for each frame
    requestAnimationFrame(animate);

    drawGrid();

    plotFunction();

    timestep++;

    min_x += 0.01;
    max_x += 0.01;

    x_shift = (timestep % x_steps) * 2 * Math.PI / x_steps;
}

// start the above loop
animate();