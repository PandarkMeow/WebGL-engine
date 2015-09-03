ENGINE.Quat = function (w, x, y, z) {
    this.w = w || 1;
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
};

ENGINE.Quat.prototype = {
    constructor: ENGINE.Quat,

    set: function (w, x, y, z) {
        this.w = w;
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    },

    setEulerRotation: function (yaw, pitch, roll) {
        var c1 = Math.cos(yaw * 0.5), c2 = Math.cos(pitch * 0.5), c3 = Math.cos(roll * 0.5), s1 = Math.sin(yaw * 0.5), s2 = Math.sin(pitch * 0.5), s3 = Math.sin(roll * 0.5);

        // Similaire à la multiplication de 3 quaternions, mais moins gourmand.
        // Trouvé sur : www.euclideanspace.com
        this.w = c1 * c2 * c3 - s1 * s2 * s3;
        this.x = s1 * s2 * c3 + c1 * c2 * s3;
        this.y = s1 * c2 * c3 + c1 * s2 * s3;
        this.z = c1 * s2 * c3 - s1 * c2 * s3;
        return this;
    },

    getReal: function () {
        return this.w;
    },

    getImaginary: function () {
        return new ENGINE.Vec3(this.x, this.y, this.z);
    },

    add: function (quat) {
        this.w += quat.w;
        this.x += quat.x;
        this.y += quat.y;
        this.z += quat.z;
        return this;
    },

    sub: function (quat) {
        this.w -= quat.w;
        this.x -= quat.x;
        this.y -= quat.y;
        this.z -= quat.z;
        return this;
    },

    multiply: function (quat) {
        var i1 = this.getImaginary();
        var i2 = quat.getImaginary();
        var real = this.w * quat.w - i1.dot(i2);
        var imaginary = ENGINE.Vec3.cross(i1, i2).add(i1.multiply(quat.w)).add(i2.multiply(this.w));
        return this.set(real, imaginary.x, imaginary.y, imaginary.z);
    },

    scale: function (scale) {
        this.w *= scale;
        this.x *= scale;
        this.y *= scale;
        this.z *= scale;
        return this;
    },

    dot: function (quat) {
        return this.w * quat.w + this.x * quat.x + this.y * quat.y + this.z * quat.z;
    },

    length: function () {
        return Math.sqrt(this.dot(this));
    },

    normalize: function () {
        return this.scale(1.0 / this.length());
    },

    conjugate: function () {
        return new ENGINE.Quat(this.w, -this.x, -this.y, -this.z);
    },

    inverse: function () {
        var length = this.length();
        return this.conjugate().scale(1.0 / (length * length));
    }
};