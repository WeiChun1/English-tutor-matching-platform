module.exports = {
  addDays: function (date, days) {
    let result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
  }
}