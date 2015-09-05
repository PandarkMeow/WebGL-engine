/**
 * Construit une forme géométrique
 * @param position {ENGINE.Vec3} la position
 * @param rotation {ENGINE.Euler} la rotation
 * @constructor
 */
ENGINE.Shape = function(position, rotation) {
    this.position = position || new ENGINE.Vec3();
    this.eRotation = rotation || new ENGINE.Euler();
    this.qRotation = new ENGINE.Quat().fromEuler(this.eRotation);
};

ENGINE.Shape.prototype = {
    constructor: ENGINE.Shape,

    /**
     * Affiche la forme
     */
    renderShape: function () {},

    /**
     * Pivote la forme
     * @param rot {ENGINE.Euler} rotation eulerienne
     */
    rotate: function(rot) {
        this.eRotation.add(rot);
        this.qRotation.fromEuler(this.eRotation);
    }
};