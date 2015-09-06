/**
 * Créée une camera
 */
ENGINE.Camera = function() {
    this.position = new ENGINE.Vec3();
    this.eRotation = new ENGINE.Euler();
    this.qRotation = new ENGINE.Quat().fromEuler(this.eRotation);

    this.viewMatrix = new ENGINE.Mat4();
};

ENGINE.Camera.prototype = {

    /**
     * Définie la rotation de la camera
     * @param rot {ENGINE.Euler} rotation de la camera
     */
    setPositionRotation: function(pos, rot) {
        this.position = pos;
        this.eRotation = rot;
        this.qRotation.fromEuler(this.eRotation);
        return this;
    },

    /**
     * Pivote la camera
     * @param rot {ENGINE.Euler} rotation
     */
    rotate: function (rot) {
        //TODO limiter la rotation
        this.eRotation.add(rot);
        this.qRotation.fromEuler(this.eRotation);
    },

    /**
     * Translate la camera
     * @param trans {ENGINE.Vec3} translation
     */
    translate: function (trans) {
        this.position.add(ENGINE.Vec3.quatTransform(trans, this.qRotation));
    },

    /**
     * Retourne la matrice de vue
     * @returns {ENGINE.Mat4}
     */
    getViewMatrix: function () {
        this.viewMatrix.setTranslation(this.position).rotateFromQuaternion(this.qRotation);
        return this.viewMatrix.inverse();
    }
};