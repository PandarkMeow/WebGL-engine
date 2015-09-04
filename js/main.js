var GL;
var canvas;
var shaderProgram;

function init() {
    canvas = document.getElementById("canvas");
    initGL();
    initShaders();
    initBuffer();

    GL.clearColor(0.0, 0.0, 0.0, 1.0);
    GL.enable(GL.DEPTH_TEST);

    loop();
}

function loop() {
    renderScene();
    window.requestAnimationFrame(loop);
}

/**
 * Initialise le context WebGL dans la variable globale "GL"
 */
function initGL() {
    try {
        GL = canvas.getContext("webgl");
        GL.viewportWidth = canvas.width;
        GL.viewportHeight = canvas.height;
    } catch (e) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}

/**
 * TODO commentaire
 * @param id
 * @returns {WebGLShader}
 */
function getShader(id) {
    var shaderScript = document.getElementById(id);
    var content = shaderScript.text;
    var shader;

    if (shaderScript.type == "x-shader/x-fragment") shader = GL.createShader(GL.FRAGMENT_SHADER);
    else if (shaderScript.type == "x-shader/x-vertex") shader = GL.createShader(GL.VERTEX_SHADER);
    else return null;

    GL.shaderSource(shader, content);
    GL.compileShader(shader);

    if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
        alert(GL.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

/**
 * Initialise les shaders au sein du programme "shaderProgram"
 */
function initShaders() {
    var vertexShader = getShader("vert");
    var fragmentShader = getShader("frag");

    shaderProgram = GL.createProgram();
    GL.attachShader(shaderProgram, vertexShader);
    GL.attachShader(shaderProgram, fragmentShader);
    GL.linkProgram(shaderProgram);

    if (!GL.getProgramParameter(shaderProgram, GL.LINK_STATUS)) alert(GL.getProgramInfoLog(shaderProgram));

    GL.useProgram(shaderProgram);

    shaderProgram.positionAttribute = GL.getAttribLocation(shaderProgram, "aVertexPosition");
    GL.enableVertexAttribArray(shaderProgram.positionAttribute);
    shaderProgram.mvpMatrix = GL.getUniformLocation(shaderProgram, "uMVPMatrix");

}

var screenPositionBuffer;

/**
 * Initialise le buffer contenant les coordonnées de l'écran
 */
function initBuffer() {
    screenPositionBuffer = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, screenPositionBuffer);
    var vertices = [
        1.0,  1.0,  0.0,
        -1.0,  1.0,  0.0,
        1.0, -1.0,  0.0,
        -1.0, -1.0,  0.0
    ];
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(vertices), GL.STATIC_DRAW);
    screenPositionBuffer.itemSize = 3;
    screenPositionBuffer.numItem = 4;

    mvMatrix.translate(0.0, 0.0, 3.0);
    mvMatrix.scale([0.5, 0.5, 0.5]);
}

var mvMatrix = new ENGINE.Mat4();
var pMatrix = new ENGINE.Mat4().perspective(Math.PI / 2, Math.PI / 2, -1, 1);
var mvpMatrix = new ENGINE.Mat4();

function renderScene() {
    GL.viewport(0, 0, GL.viewportWidth, GL.viewportHeight);
    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

    mvMatrix.rotate([1, 1, 0], Math.PI / 120);
    mvpMatrix.set(pMatrix.data);
    mvpMatrix.multiply(mvMatrix);

    GL.bindBuffer(GL.ARRAY_BUFFER, screenPositionBuffer);
    GL.vertexAttribPointer(shaderProgram.positionAttribute, screenPositionBuffer.itemSize, GL.FLOAT, false, 0, 0);
    GL.uniformMatrix4fv(shaderProgram.mvpMatrix, false, mvpMatrix.data);
    GL.drawArrays(GL.TRIANGLE_STRIP, 0, screenPositionBuffer.numItem);
}