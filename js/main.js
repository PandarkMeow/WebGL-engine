var GL;
var canvas;
var shaderProgram;
var scene;
var keyPressed = [];
var dragData = {};
var toRad = Math.PI / 180;

//TODO optimiser cette merde

// FPS
var start, fps = 0;

function init() {
    canvas = document.getElementById("canvas");
    ENGINE.initGL(canvas);

    scene = new ENGINE.Scene();

    for(var i = 0; i < 500; i++) {
        var randX = Math.random() * 10 - 5;
        var randY = Math.random() * 10 - 5;
        var randZ = Math.random() * 10 + 5;

        var box = new ENGINE.Box(new ENGINE.Vec3(randX, randY, randZ), new ENGINE.Euler(1, 0, 0), 0.2, 0.2, 0.2);
        scene.addShape(box);
    }

    initEvents();

    start = Date.now();
    loop();
}

function initEvents() {
    document.addEventListener("keydown", function(e) {
        if(((e.keyCode >= 37 && e.keyCode <= 40) || e.keyCode == 97 || e.keyCode == 98) && keyPressed.indexOf(e.keyCode) == -1) keyPressed.push(e.keyCode);
    }, false);

    document.addEventListener("keyup", function(e) {
        if((e.keyCode >= 37 && e.keyCode <= 40) || e.keyCode == 97 || e.keyCode == 98) keyPressed.splice(keyPressed.indexOf(e.keyCode), 1);
    }, false);

    canvas.onmousedown = function(e) {
        dragData["mousePressed"] = true;
        dragData["ox"] = e.clientX;
        dragData["oy"] = e.clientY;
        dragData["dx"] = 0;
        dragData["dy"] = 0;
    };

    canvas.onmouseup = function(e) {
        dragData["mousePressed"] = false;
        dragData["dx"] = 0;
        dragData["dy"] = 0;
    };

    canvas.onmousemove = function(e) {
        if(dragData["mousePressed"]) {
            dragData["dx"] = e.clientX - dragData["ox"];
            dragData["dy"] = e.clientY - dragData["oy"];
            dragData["ox"] = e.clientX;
            dragData["oy"] = e.clientY;
        }
    };

    canvas.onmouseout = function(e) {
        dragData["mousePressed"] = false;
    }
}

function loop() {
    countFPS();

    handleKeyboardEvent();
    handleMouseDrag();

    dragData["dx"] = 0;
    dragData["dy"] = 0;

    scene.drawScene();

    for(shape of scene.shapes) shape.rotate(new ENGINE.Euler(0.05, 0.05, 0.02));
    window.requestAnimationFrame(loop);
}

function countFPS() {
    fps++;
    if(Date.now() - start >= 1000) {
        document.getElementById("output").innerHTML = fps;
        fps = 0;
        start = Date.now();
    }
}

/**
 * Excute les actions qui découlent des touches du clavier activées
 */
function handleKeyboardEvent() {
    for(key of keyPressed) {
        if(key == 97 || key == 98) {
            var dy = -((key - 97.5) * 2 * 0.1);
            scene.camera.translate(new ENGINE.Vec3(0, dy, 0));
        } else {
            var dz = -((key - 39) % 2) * 0.1;
            var dx = ((key - 38) % 2) * 0.1;

            scene.camera.translate(new ENGINE.Vec3(dx, 0, dz));
        }
    }
}

/**
 * Execute les actions qui découlent des drag effectués par les souris
 */
function handleMouseDrag() {
    if(dragData["mousePressed"]) {
        var yaw = dragData["dx"] * toRad * 0.25;
        var pitch = dragData["dy"] * toRad * 0.25;

        // TODO trouver pourquoi le pitch s'effectue dans le paramètre roll
        scene.camera.rotate(new ENGINE.Euler(yaw, 0, pitch));
    }
}