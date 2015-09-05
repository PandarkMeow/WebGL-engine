ENGINE.initGL = function(canvas) {
    try {
        ENGINE.GL = canvas.getContext("webgl");
        ENGINE.GL.viewportWidth = canvas.width;
        ENGINE.GL.viewportHeight = canvas.height;
    } catch (e) {
        alert("Could not initialise WebGL, sorry :-(");
    }

    initShaders();
}

function getShader(id) {
    var shaderScript = document.getElementById(id);
    var content = shaderScript.text;
    var shader;
    var GL = ENGINE.GL;

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

function initShaders() {
    var GL = ENGINE.GL;
    var vertexShader = getShader("vert");
    var fragmentShader = getShader("frag");

    var shaderProgram = ENGINE.shaderProgram = GL.createProgram();
    GL.attachShader(shaderProgram, vertexShader);
    GL.attachShader(shaderProgram, fragmentShader);
    GL.linkProgram(shaderProgram);

    if (!GL.getProgramParameter(shaderProgram, GL.LINK_STATUS)) alert(GL.getProgramInfoLog(shaderProgram));

    GL.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = GL.getAttribLocation(shaderProgram, "aVertexPosition");
    GL.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
    shaderProgram.vertexColorAttribute = GL.getAttribLocation(shaderProgram, "aVertexColor");
    GL.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
    shaderProgram.mvpMatrixUniform = GL.getUniformLocation(shaderProgram, "uMVPMatrix");
}