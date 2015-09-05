/**
 * Créée une boite de la dimension passée en paramètre
 * @param position {ENGINE.Vec3} position de la boite
 * @param rotation {ENGINE.Euler} rotation de la boite
 * @param width {number} largeur
 * @param height {number} hauteur
 * @param depth {number} profondeur
 * @constructor
 */
ENGINE.Box = function(position, rotation, width, height, depth) {
    ENGINE.Shape.call(this, position, rotation);
    this.width = width;
    this.height = height;
    this.depth = depth;

    var GL = ENGINE.GL;
    this.vertexPositionBuffer = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, this.vertexPositionBuffer);
    var vertices = [
        -1.0, 1.0, 1.0,
        1.0, 1.0, 1.0,
        1.0, -1.0, 1.0,
        -1.0, -1.0, 1.0,

        1.0, 1.0, 1.0,
        1.0, -1.0, 1.0,
        1.0, -1.0, -1.0,
        1.0, 1.0, -1.0,

        1.0, 1.0, -1.0,
        1.0, -1.0, -1.0,
        -1.0, -1.0, -1.0,
        -1.0, 1.0, -1.0,

        -1.0, 1.0, -1.0,
        -1.0, -1.0, -1.0,
        -1.0, -1.0, 1.0,
        -1.0, 1.0, 1.0,

        1.0, -1.0, -1.0,
        1.0, -1.0, 1.0,
        -1.0, -1.0, 1.0,
        -1.0, -1.0, -1.0,

        -1.0, 1.0, -1.0,
        -1.0, 1.0, 1.0,
        1.0, 1.0, 1.0,
        1.0, 1.0, -1.0
    ];
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(vertices), GL.STATIC_DRAW);
    this.vertexPositionBuffer.itemSize = 3;
    this.vertexPositionBuffer.numItem = 24;

    this.vertexColorBuffer = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, this.vertexColorBuffer);
    var colors = [
        [1.0, 0.0, 0.0, 1.0], // Front face
        [1.0, 1.0, 0.0, 1.0], // Back face
        [0.0, 1.0, 0.0, 1.0], // Top face
        [1.0, 0.5, 0.5, 1.0], // Bottom face
        [1.0, 0.0, 1.0, 1.0], // Right face
        [0.0, 0.0, 1.0, 1.0]  // Left face
    ];
    var unpackedColors = [];
    for (var i in colors) {
        var color = colors[i];
        for (var j=0; j < 4; j++) {
            unpackedColors = unpackedColors.concat(color);
        }
    }
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(unpackedColors), GL.STATIC_DRAW);
    this.vertexColorBuffer.itemSize = 4;
    this.vertexColorBuffer.numItems = 24;

    this.vertexIndexBuffer = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
    var vertexIndices = [
        0, 1, 2,    0, 2, 3,
        4, 5, 6,    4, 6, 7,
        8, 9, 10,   8, 10, 11,
        12, 13, 14, 12, 14, 15,
        16, 17, 18, 16, 18, 19,
        20, 21, 22, 20, 22, 23
    ];
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices), GL.STATIC_DRAW);
    this.vertexIndexBuffer.itemSize = 1;
    this.vertexIndexBuffer.numItems = 36;
};

ENGINE.Box.prototype = Object.create(ENGINE.Shape.prototype);
ENGINE.Box.constructor = ENGINE.Box;

/**
 * Affiche la boite
 * @param scene {ENGINE.Scene} la scène d'affichage
 */
ENGINE.Box.prototype.renderShape = function(scene) {
    var GL = ENGINE.GL;

    GL.bindBuffer(GL.ARRAY_BUFFER, this.vertexPositionBuffer);
    GL.vertexAttribPointer(ENGINE.shaderProgram.vertexPositionAttribute, this.vertexPositionBuffer.itemSize, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, this.vertexColorBuffer);
    GL.vertexAttribPointer(ENGINE.shaderProgram.vertexColorAttribute, this.vertexColorBuffer.itemSize, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);

    scene.pushMatrix();
        scene.mvMatrix.translate(this.position);
        scene.mvMatrix.rotateFromQuaternion(this.qRotation);
        scene.mvMatrix.scale([this.width, this.height, this.depth]);
        GL.drawElements(GL.TRIANGLES, this.vertexIndexBuffer.numItems, GL.UNSIGNED_SHORT, 0);
        scene.setMVPMatrix();
    scene.popMatrix();
};