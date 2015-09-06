/**
 * Créée un angle eulerien
 * @param yaw {number} cap
 * @param pitch {number} tanguage
 * @param roll {number} roulis
 * @constructor
 */
ENGINE.Euler = function(yaw, pitch, roll) {
    this.yaw = yaw || 0;
    this.pitch = pitch || 0;
    this.roll = roll || 0;
};

ENGINE.Euler.prototype = {
    /**
     * Additionne deux angles eulériens
     * @param euler {ENGINE.Euler} seconde opérande
     * @returns {ENGINE.Euler}
     */
    add: function (euler) {
        this.yaw += euler.yaw;
        this.pitch += euler.pitch;
        this.roll += euler.roll;
        return this;
    },

    toString: function () {
        return this.yaw + " " + this.pitch + " " + this.roll;
    }
}