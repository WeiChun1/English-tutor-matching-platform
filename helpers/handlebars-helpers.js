module.exports = {
  ifCond: function (a, b, options) {
    return !(a || b) ? options.fn(this) : options.inverse(this)
  },
  ifEqual: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  }
}