module.exports = {
  addDays: function (date, days) {
    let result = new Date(date)
    console.log(result)
    result.setDate(result.getDate() + days)
    return result
  }
}