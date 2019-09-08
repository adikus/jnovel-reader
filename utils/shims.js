if(!Array.prototype.flat) {
    Array.prototype.flat = function() { return this.reduce((acc, val) => acc.concat(val), []) }
}
