module.exports = {
  addDays: function (date, days) {
    let result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
  },
  startTimeSet: function (startTime, usageTime) {
    let lessonTime
    lessonTime = startTime.toString().split(' GMT')[0]
    if (usageTime === 60 && startTime.getMinutes() === 30) {
      lessonTime += `-${startTime.getHours() + 1}:${startTime.getMinutes()}:00`
    } else if (usageTime === 60 && startTime.getMinutes() === 0) {
      lessonTime += `-${startTime.getHours() + 1}:${startTime.getMinutes()}0:00`
    } else if (usageTime === 30 && startTime.getMinutes() === 30) {
      lessonTime += `-${startTime.getHours() + 1}:${startTime.getMinutes() - 30}0:00`
    } else (
      lessonTime += `-${startTime.getHours()}:${startTime.getMinutes() + 30}:00`
    )
    return lessonTime
  }
}