var GL;
var canvas;
var shaderProgram;
var scene;

// FPS
var start, fps = 0;

function init() {
    canvas = document.getElementById("canvas");
    ENGINE.initGL(canvas);

    scene = new ENGINE.Scene();

    var box = new ENGINE.Box(new ENGINE.Vec3(0, 0, 10), new ENGINE.Euler(1, 0, 0), 1, 1, 2);
    scene.addShape(box);

    start = Date.now();
    loop();
}

function loop() {
    countFPS();
    scene.drawScene();
    scene.shapes[0].rotate(new ENGINE.Euler(0.05, 0.05, 0.02));
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