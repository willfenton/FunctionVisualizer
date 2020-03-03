function randomColor() {
    // returns a random color value as HSL value
    let vals = ["00", "ff", Math.floor(Math.random() * 256).toString(16)]
    //shuffle
    vals.sort(() => 0.5 - Math.random());
    let color = `#${vals[0]}${vals[1]}${vals[2]}`;
    return color;
}

function newPlot() {
    // add DOM input
    var options = {};
    var opt = document.createElement("div");
    var color = randomColor();
    opt.className = "function-options";

    // equation
    options.equation = document.createElement("input");
    options.equation.type = "text";
    options.equation.placeholder = "type function here";
    options.equation.className = "function-input ui";
    opt.appendChild(options.equation);

    // show/hide button
    options.visibility = document.createElement("button");
    options.visibility.className = "ui";
    var icon = document.createElement("i");
    icon.className = "fas fa-eye";
    options.visibility.appendChild(icon);
    opt.appendChild(options.visibility);

    // remove button
    options.remove = document.createElement("button");
    options.remove.className = "ui";
    var icon = document.createElement("i");
    icon.className = "fas fa-minus";
    options.remove.appendChild(icon);
    opt.appendChild(options.remove);

    // color picker
    options.picker = document.createElement("input");
    options.picker.type = "color";
    options.picker.className = "ui";
    options.picker.value = color;
    opt.appendChild(options.picker);

    document.querySelector("#plot-inputs").appendChild(opt);

    // adds a plot to the list
    plots.push(new Plot(options));
}