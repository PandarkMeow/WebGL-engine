/**
 * Créée un nouveau quaternion à partir
 * des coordonnées passées en paramètre
 * @param w {number}
 * @param x {number}
 * @param y {number}
 * @param z {number}
 * @constructor
 */
ENGINE.Quat = function (w, x, y, z) {
    this.w = w || 1;
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
};

ENGINE.Quat.prototype = {
    constructor: ENGINE.Quat,

    /**
     * Définie les nouvelles coordonnées du quaternion
     * @param w {number}
     * @param x {number}
     * @param y {number}
     * @param z {number}
     * @returns {ENGINE.Quat}
     */
    set: function (w, x, y, z) {
        this.w = w;
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    },

    /**
     * Définie les coordonnées du quaternion à partir d'un
     * angle eulerien
     * @param euler {ENGINE.Euler} rotation eulerienne
     * @returns {ENGINE.Quat}
     */
    fromEuler: function (euler) {
        var c1 = Math.cos(euler.yaw * 0.5), c2 = Math.cos(euler.pitch * 0.5), c3 = Math.cos(euler.roll * 0.5), s1 = Math.sin(euler.yaw * 0.5), s2 = Math.sin(euler.pitch * 0.5), s3 = Math.sin(euler.roll * 0.5);

        // Similaire à la multiplication de 3 quaternions, mais moins gourmand.
        // Trouvé sur : www.euclideanspace.com
        this.w = c1 * c2 * c3 - s1 * s2 * s3;
        this.x = s1 * s2 * c3 + c1 * c2 * s3;
        this.y = s1 * c2 * c3 + c1 * s2 * s3;
        this.z = c1 * s2 * c3 - s1 * c2 * s3;
        return this;
    },

    /**
     * Definie les coordonnées du quaternion à partir d'une matrice
     * de rotation
     * @param mat {ENGINE.Mat4} la matrice de rotation
     * @returns {ENGINE.Quat}
     */
    setFromMatrix: function (mat) {
        var w = Math.sqrt(1 + mat.data[0] + mat.data[5] + mat.data[10]) / 2;
        var x = (mat.data[9] - mat.data[6]) / (4 * w);
        var y = (mat.data[2] - mat.data[8]) / (4 * w);
        var z = (mat.data[4] - mat.data[1]) / (4 * w);
        return this.set(w, x, y, z);
    },

    /**
     * Retourne la partie réelle du quaternion
     * @returns {number}
     */
    getReal: function () {
        return this.w;
    },

    /**
     * Retourne la partie imaginaire du quaternion
     * @returns {ENGINE.Vec3}
     */
    getImaginary: function () {
        return new ENGINE.Vec3(this.x, this.y, this.z);
    },

    /**
     * Additionne deux quaternions
     * @param quat {ENGINE.Quat}
     * @returns {ENGINE.Quat}
     */
    add: function (quat) {
        this.w += quat.w;
        this.x += quat.x;
        this.y += quat.y;
        this.z += quat.z;
        return this;
    },

    /**
     * Soustrait deux quaternions
     * @param quat {ENGINE.Quat}
     * @returns {ENGINE.Quat}
     */
    sub: function (quat) {
        this.w -= quat.w;
        this.x -= quat.x;
        this.y -= quat.y;
        this.z -= quat.z;
        return this;
    },

    /**
     * Multiplie deux quaternions
     * @param quat {ENGINE.Quat}
     * @returns {ENGINE.Quat}
     */
    multiply: function (quat) {
        var i1 = this.getImaginary();
        var i2 = quat.getImaginary();
        var real = this.w * quat.w - i1.dot(i2);
        var imaginary = ENGINE.Vec3.cross(i1, i2).add(i1.multiply(quat.w)).add(i2.multiply(this.w));
        return this.set(real, imaginary.x, imaginary.y, imaginary.z);
    },

    /**
     * Multiplie le quaternion par un scalaire
     * @param scale {number}
     * @returns {ENGINE.Quat}
     */
    scale: function (scale) {
        this.w *= scale;
        this.x *= scale;
        this.y *= scale;
        this.z *= scale;
        return this;
    },

    /**
     * Produit scalaire de deux quaternion
     * @param quat {ENGINE.Quat}
     * @returns {number}
     */
    dot: function (quat) {
        return this.w * quat.w + this.x * quat.x + this.y * quat.y + this.z * quat.z;
    },

    /**
     * Longueur du quaternion
     * @returns {number}
     */
    length: function () {
        return Math.sqrt(this.dot(this));
    },

    /**
     * Normalise le quaternion
     * @returns {ENGINE.Quat}
     */
    normalize: function () {
        return this.scale(1.0 / this.length());
    },

    /**
     * Retourne le conjugué du quaternion
     * @returns {ENGINE.Quat}
     */
    conjugate: function () {
        return new ENGINE.Quat(this.w, -this.x, -this.y, -this.z);
    },

    /**
     * Retourne l'inverse du quaternion
     * @returns {ENGINE.Quat}
     */
    inverse: function () {
        var length = this.length();
        return this.conjugate().scale(1.0 / (length * length));
    },

    /**
     * Convertie le quaternion en angles euleriens
     * @returns {ENGINE.Euler}
     */
    toEuler: function () {
        var x = this.x, y = this.y, z = this.z, w = this.w;
        var yaw = Math.atan2(2 * y * w - 2 * x * z, 1 - 2 * y * y - 2 * z * z);
        var pitch = Math.asin(2 * x * y + 2 * z * w);
        var roll = Math.atan2(2 * x * w - 2 * y * z, 1 - 2 * x * x - 2 * z * z);
        return new ENGINE.Euler(yaw, pitch, roll);
    },

    /**
     * Affiche le contenu du quaternion
     * @returns {string}
     */
    toString: function () {
        return "[" + this.w + ", " + this.x + " " + this.y + " " + this.z + "]";
    }
};