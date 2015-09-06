/**
 * Construit un vecteur en 3 dimmension
 * @param x {number}
 * @param y {number}
 * @param z {number}
 * @constructor
 */
ENGINE.Vec3 = function (x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
};

ENGINE.Vec3.prototype = {
    constructor: ENGINE.Vec3,

    /**
     * Définie les nouvelles coordonnées du vecteur
     * @param x {number}
     * @param y {number}
     * @param z {number}
     * @returns {ENGINE.Vec3}
     */
    set:function(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    },

    /**
     * Charge le contenu d'un vecteur dans celui-ci
     * @param vec {ENGINE.Vec3}
     * @returns {ENGINE.Vec3}
     */
    load: function (vec) {
        this.x = vec.x;
        this.y = vec.y;
        this.z = vec.z;
        return this;
    },

    /**
     * Retourne l'abscisse du vecteur
     * @returns {number}
     */
    getX: function () {
        return this.x;
    },

    /**
     * Retourne l'ordonnée du vecteur
     * @returns {number}
     */
    getY: function () {
        return this.y;
    },

    /**
     * Retourne la profondeur du vecteur
     * @returns {number}
     */
    getZ: function () {
        return this.z;
    },

    /**
     * Ajoute les coordonnées d'un vecteur à celui-ci
     * @param vec {ENGINE.Vec3}
     * @returns {ENGINE.Vec3}
     */
    add: function (vec) {
        this.x += vec.x;
        this.y += vec.y;
        this.z += vec.z;
        return this;
    },

    /**
     * Soustrait les coordonnées d'un vecteur à celui-ci
     * @param vec {ENGINE.Vec3}
     * @returns {ENGINE.Vec3}
     */
    sub: function (vec) {
        this.x -= vec.x;
        this.y -= vec.y;
        this.z -= vec.z;
        return this;
    },

    /**
     * Multiplie les coordonnées du vecteur par un scalaire
     * @param scalar {number}
     * @returns {ENGINE.Vec3}
     */
    multiply: function (scalar) {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
        return this;
    },

    /**
     * Divise les coordonnées du vecteur par un scalaire
     * @param scalar {number}
     * @returns {ENGINE.Vec3}
     */
    divide: function (scalar) {
        this.x /= scalar;
        this.y /= scalar;
        this.z /= scalar;
        return this;
    },

    /**
     * Réalise le produit scalaire
     * @param vec {ENGINE.Vec3}
     * @returns {number}
     */
    dot: function (vec) {
        return this.x * vec.x + this.y * vec.y + this.z * vec.z;
    },

    /**
     * Donne la longueur du vecteur
     * @returns {number}
     */
    len: function () {
        return Math.sqrt(this.dot(this));
    },

    /**
     * Normalise le vecteur
     * @returns {ENGINE.Vec3}
     */
    normalize: function () {
        return this.divide(this.len());
    },

    /**
     * Affiche le contenu du vecteur
     * @returns {string}
     */
    toString: function () {
        return "[" + this.x + ", " + this.y + ", " + this.z + "]";
    }
};


/**
 * Réalise le produit vectoriel de deux vecteurs
 * @param vec1 {ENGINE.Vec3}
 * @param vec2 {ENGINE.Vec3}
 * @returns {ENGINE.Vec3}
 */
ENGINE.Vec3.cross = function (vec1, vec2) {
    return new ENGINE.Vec3(vec1.y * vec2.z - vec2.y * vec1.z, vec1.z * vec2.x - vec2.z * vec1.x, vec1.x * vec2.y - vec2.x * vec1.y);
};

/**
 * Applique une rotation à un vecteur
 * @param vec {ENGINE.Vec3} le vecteur à pivoter
 * @param quat {ENGINE.Quat} le quaternion représentant la rotation
 * @returns {ENGINE.Vec3}
 */
ENGINE.Vec3.quatTransform = function (vec, quat) {
    var vecPart = quat.getImaginary();
    var v = ENGINE.Vec3.cross(vecPart, vec).multiply(2);
    return ENGINE.Vec3.cross(vecPart, v).add(vec).add(v.multiply(quat.getReal()));
}