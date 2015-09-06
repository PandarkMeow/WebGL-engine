/**
 * Créée une scène de rendu
 * @constructor
 */
ENGINE.Scene = function() {
    this.shapes = [];

    this.camera = new ENGINE.Camera().setPositionRotation(new ENGINE.Vec3(2, 0, 0), new ENGINE.Euler(0, 0, 0));

    this.mvMatrixArray = [];
    this.mvMatrix = new ENGINE.Mat4();
    this.pMatrix = new ENGINE.Mat4().perspective(Math.PI / 2, ENGINE.GL.viewportWidth / ENGINE.GL.viewportHeight, -0.01, 1); // TODO changer le type de camera grâce aux paramètres de la classe ENGINE

    ENGINE.GL.clearColor(0.0, 0.0, 0.0, 1.0);
    ENGINE.GL.enable(ENGINE.GL.DEPTH_TEST);
};

ENGINE.Scene.prototype = {
    constructor: ENGINE.Scene,

    /**
     * Dessine la scène avec les éléments qui la
     * compose
     */
    drawScene: function () {
        var GL = ENGINE.GL;
        GL.viewport(0, 0, GL.viewportWidth, GL.viewportHeight);
        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

        for(let shape of this.shapes) {
            shape.renderShape(this);
        }
    },

    /**
     * Empile la matrice modèle-vue
     */
    pushMatrix: function () {
        this.mvMatrixArray.push(this.mvMatrix.clone());
    },

    /**
     * Dépile la dernière matrice modèle-vue
     */
    popMatrix: function () {
        this.mvMatrix = this.mvMatrixArray[this.mvMatrixArray.length - 1];
        this.mvMatrixArray.pop();
    },

    /**
     * Envois la matrice modèle-vue-projection aux shaders
     */
    setMVPMatrix: function () {
        var mvpMatrix = this.pMatrix.clone();
        mvpMatrix.multiply(this.camera.getViewMatrix()).multiply(this.mvMatrix);
        ENGINE.GL.uniformMatrix4fv(ENGINE.shaderProgram.mvpMatrixUniform, false, mvpMatrix.data);
    },

    /**
     * Ajoute une forme à la scène
     * @param shape {ENGINE.Shape|ENGINE.Box} la forme à ajouter
     */
    addShape: function (shape) {
        this.shapes.push(shape);
    }
};