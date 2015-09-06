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
     * @param trans {ENGINE.Vec3} la translation
     * @returns {ENGINE.Mat4}
     */
    translate: function (trans) {
        return this.multiply(new ENGINE.Mat4([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            trans.x, trans.y, trans.z, 1
        ]));
    },

    setTranslation: function (trans) {
        return this.set([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            trans.x, trans.y, trans.z, 1
        ]);
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
            c + x * x * d,     x * y * d + z * s, x * z * d - y * s, 0,
            y * x * d - z * s, c + y * y * d,     y * z * d + x * s, 0,
            z * x * d + y * s, z * y * d - x * s, c + z * z * d,     0,
            0,              0,                 0,                    1
        ]));
    },

    /**
     * Pivote la matrice à partir d'un quaternion
     * @param q {ENGINE.Quat}
     * @returns {ENGINE.Mat4}
     */
    rotateFromQuaternion: function (q) {
        return this.multiply(new ENGINE.Mat4([
            1 - 2 * q.y * q.y - 2 * q.z * q.z, 2 * q.x * q.y + 2 * q.z * q.w,     2 * q.x * q.z - 2 * q.y * q.w, 0,
            2 * q.x * q.y - 2 * q.z * q.w,     1 - 2 * q.x * q.x - 2 * q.z * q.z, 2 * q.y * q.z + 2 * q.x * q.w, 0,
            2 * q.x * q.z + 2 * q.y * q.w,     2 * q.y * q.z - 2 * q.x * q.w,     1 - 2 * q.x * q.x - 2 * q.y * q.y, 0,
            0, 0, 0, 1
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
     * @param fov {number} champ de vision x en radians
     * @param aspect {number} ratio entre la largeur et la hauteur de la fenetre
     * @param zNear {number} champ proche
     * @param zFar {number} champ lointain
     * @returns {ENGINE.Mat4}
     */
    perspective: function (fov, aspect, zNear, zFar) {
        var fn = (zFar - zNear);
        return this.set([
            1 / aspect * Math.tan(fov * 0.5), 0, 0, 0,
            0, 1 / Math.tan(fov * 0.5), 0, 0,
            0, 0, (zFar + zNear) / fn, 1,
            0, 0, (2 * zFar * zNear) / fn, 0
        ]);
    },

    /**
     * Transpose la matrice
     * @returns {ENGINE.Mat4}
     */
    transpose: function () {
        for(var i = 0; i < 4; i++) {
            for(var j = i + 1; j < 4; j++) {
                var tmp = this.data[i * 4 + j];
                this.data[i * 4 + j] = this.data[j * 4 + i];
                this.data[j * 4 + i] = tmp;
            }
        }
        return this;
    },

    /**
     * Retourne la matrice d'adjacence
     * @returns {ENGINE.Mat4} matrice d'adjacence
     */
    adjoin: function () {
        // TODO OMG fait un truc plus propre
        var m00 = this.data[0], m01 = this.data[1], m02 = this.data[2], m03 = this.data[3],
            m10 = this.data[4], m11 = this.data[5], m12 = this.data[6], m13 = this.data[7],
            m20 = this.data[8], m21 = this.data[9], m22 = this.data[10], m23 = this.data[11],
            m30 = this.data[12], m31 = this.data[13], m32 = this.data[14], m33 = this.data[15];
        var out = new Array(16);
        out[0] = m12*m23*m31 - m13*m22*m31 + m13*m21*m32 - m11*m23*m32 - m12*m21*m33 + m11*m22*m33;
        out[1] = m03*m22*m31 - m02*m23*m31 - m03*m21*m32 + m01*m23*m32 + m02*m21*m33 - m01*m22*m33;
        out[2] = m02*m13*m31 - m03*m12*m31 + m03*m11*m32 - m01*m13*m32 - m02*m11*m33 + m01*m12*m33;
        out[3] = m03*m12*m21 - m02*m13*m21 - m03*m11*m22 + m01*m13*m22 + m02*m11*m23 - m01*m12*m23;
        out[4] = m13*m22*m30 - m12*m23*m30 - m13*m20*m32 + m10*m23*m32 + m12*m20*m33 - m10*m22*m33;
        out[5] = m02*m23*m30 - m03*m22*m30 + m03*m20*m32 - m00*m23*m32 - m02*m20*m33 + m00*m22*m33;
        out[6] = m03*m12*m30 - m02*m13*m30 - m03*m10*m32 + m00*m13*m32 + m02*m10*m33 - m00*m12*m33;
        out[7] = m02*m13*m20 - m03*m12*m20 + m03*m10*m22 - m00*m13*m22 - m02*m10*m23 + m00*m12*m23;
        out[8] = m11*m23*m30 - m13*m21*m30 + m13*m20*m31 - m10*m23*m31 - m11*m20*m33 + m10*m21*m33;
        out[9] = m03*m21*m30 - m01*m23*m30 - m03*m20*m31 + m00*m23*m31 + m01*m20*m33 - m00*m21*m33;
        out[10] = m01*m13*m30 - m03*m11*m30 + m03*m10*m31 - m00*m13*m31 - m01*m10*m33 + m00*m11*m33;
        out[11] = m03*m11*m20 - m01*m13*m20 - m03*m10*m21 + m00*m13*m21 + m01*m10*m23 - m00*m11*m23;
        out[12] = m12*m21*m30 - m11*m22*m30 - m12*m20*m31 + m10*m22*m31 + m11*m20*m32 - m10*m21*m32;
        out[13] = m01*m22*m30 - m02*m21*m30 + m02*m20*m31 - m00*m22*m31 - m01*m20*m32 + m00*m21*m32;
        out[14] = m02*m11*m30 - m01*m12*m30 - m02*m10*m31 + m00*m12*m31 + m01*m10*m32 - m00*m11*m32;
        out[15] = m01*m12*m20 - m02*m11*m20 + m02*m10*m21 - m00*m12*m21 - m01*m10*m22 + m00*m11*m22;

        return new ENGINE.Mat4(out);

    },

    /**
     * Retourne le déterminant de la matrice
     * @returns {number} determinant
     */
    det: function () {
        // TODO OMG ici aussi c'est moche
        var m00 = this.data[0], m01 = this.data[1], m02 = this.data[2], m03 = this.data[3],
            m10 = this.data[4], m11 = this.data[5], m12 = this.data[6], m13 = this.data[7],
            m20 = this.data[8], m21 = this.data[9], m22 = this.data[10], m23 = this.data[11],
            m30 = this.data[12], m31 = this.data[13], m32 = this.data[14], m33 = this.data[15];

        return m03 * m12 * m21 * m30 - m02 * m13 * m21 * m30-
            m03 * m11 * m22 * m30+m01 * m13 * m22 * m30+
            m02 * m11 * m23 * m30-m01 * m12 * m23 * m30-
            m03 * m12 * m20 * m31+m02 * m13 * m20 * m31+
            m03 * m10 * m22 * m31-m00 * m13 * m22 * m31-
            m02 * m10 * m23 * m31+m00 * m12 * m23 * m31+
            m03 * m11 * m20 * m32-m01 * m13 * m20 * m32-
            m03 * m10 * m21 * m32+m00 * m13 * m21 * m32+
            m01 * m10 * m23 * m32-m00 * m11 * m23 * m32-
            m02 * m11 * m20 * m33+m01 * m12 * m20 * m33+
            m02 * m10 * m21 * m33-m00 * m12 * m21 * m33-
            m01 * m10 * m22 * m33+m00 * m11 * m22 * m33;
    },

    /**
     * Retourne l'inverse de la matrice
     * @returns {ENGINE.Mat4}
     */
    inverse: function () {
        // TODO prévoir le cas ou la matrice n'a pas d'inverse
        return this.adjoin().scalarMultiply(1 / this.det());
    },

    /**
     * Multiplie la matrice par un scalaire
     * @param scalar {number} scalaire
     * @returns {ENGINE.Mat4}
     */
    scalarMultiply: function (scalar) {
        for(var i = 0; i < 16; i++) {
            this.data[i] *= scalar;
        }
        return this;
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
    },

    /**
     * Copie la matrice courante
     * @returns {ENGINE.Mat4}
     */
    clone: function () {
        return new ENGINE.Mat4(this.data.slice());
    }
};

