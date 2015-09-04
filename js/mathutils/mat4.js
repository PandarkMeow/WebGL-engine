/**
 * Créée une matrice carré de taille 4
 * @param data {Array} les données de la matrice
 * @constructor
 */
ENGINE.Mat4 = function(data) {
    this.data = data || [1, 0, 0, 0,
                         0, 1, 0, 0,
                         0, 0, 1, 0,
                         0, 0, 0, 1];
};

ENGINE.Mat4.prototype = {
    /**
     * Définie les nouvelles données de la matrice
     * @param data {Array}
     * @returns {ENGINE.Mat4}
     */
    set: function (data) {
        this.data = data;
        return this;
    },

    /**
     * Retourne la matrice identité
     * @returns {ENGINE.Mat4}
     */
    identity: function () {
        this.data = new Array(16);
        for(var i = 0; i < 16; i++) this.data[i] = (i % 5 == 0) ? 1 : 0;
        return this;
    },

    /**
     * Multiplie deux matrices
     * @param mat {ENGINE.Mat4} la seconde opérande
     * @returns {ENGINE.Mat4}
     */
    multiply: function (mat) {
        var out = [];
        for(var i = 0; i < 4; i++) for(var j = 0; j < 4; j++) out.push(this.data[j] * mat.data[i * 4] + this.data[4 + j] * mat.data[i * 4 + 1] + this.data[8 + j] * mat.data[i * 4 + 2] + this.data[12 + j] * mat.data[i * 4 + 3]);
        this.data = out;
        return this;
    },

    /**
     * Translate la matrice selon les conventions en
     * WebGL
     * @param x {number}
     * @param y {number}
     * @param z {number}
     * @returns {ENGINE.Mat4}
     */
    translate: function (x, y, z) {
        return this.multiply(new ENGINE.Mat4([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            x, y, z, 1
        ]));
    },

    /**
     * Pivote la matrice selon les conventions en
     * WebGL
     * @param axis {Array} l'axe de rotation
     * @param angle {number} l'angle de rotation
     * @returns {ENGINE.Mat4}
     */
    rotate: function (axis, angle) {
        var c = Math.cos(angle), s = Math.sin(angle), d = 1 - c;
        var x = axis[0], y = axis[1], z = axis[2];
        var len = Math.sqrt(x * x + y * y + z * z);
        x /= len;
        y /= len;
        z /= len;
        return this.multiply(new ENGINE.Mat4([
            c + x * x * d,     x * y * d - z * s, x * z * d + y * s, 0,
            y * x * d + z * s, c + y * y * d,     y * z * d - x * s, 0,
            z * x * d - y * s, z * y * d + x * s, c + z * z * d,     0,
            0,              0,                 0,                    1
        ]));
    },

    /**
     * Redimensionne la matrice
     * @param scale {Array} la redimension en x, y et z
     * @returns {ENGINE.Mat4}
     */
    scale: function (scale) {
        return this.multiply(new ENGINE.Mat4([
            scale[0], 0, 0, 0,
            0, scale[1], 0, 0,
            0, 0, scale[2], 0,
            0, 0, 0,        1
        ]));
    },

    /**
     * Retourne la matrice de perspective
     * @param fovx {number} champ de vision x en radians
     * @param fovy {number} champ de vision y en radians
     * @param zNear {number} champ proche
     * @param zFar {number} champ lointain
     * @returns {ENGINE.Mat4}
     */
    perspective: function (fovx, fovy, zNear, zFar) {
        var fn = (zFar - zNear);
        return this.set([
            Math.tan(fovx * 0.5), 0, 0, 0,
            0, Math.tan(fovy * 0.5), 0, 0,
            0, 0, (zFar + zNear) / fn, 1,
            0, 0, (2 * zFar * zNear) / fn, 0
        ]);
    },

    /**
     * Affiche le contenu de la matrice
     * @returns {string}
     */
    toString: function () {
        var out = "";
        for(var i = 0; i < 16; i++) {
            out += ((i % 4 == 0) ? "\n" : "") + this.data[i] + " ";
        }
        return out;
    }
};

