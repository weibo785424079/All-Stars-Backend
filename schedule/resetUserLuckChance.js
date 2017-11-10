
const schedule = require('node-schedule')
const { User } = require('./../controllers/user')
// 定时任务


const resetLuckyTimes = async () => { 
    　var rule = new schedule.RecurrenceRule()
    　rule.dayOfWeek = [0, new schedule.Range(1, 6)]
    　rule.hour = 11
      rule.minute = 0
      schedule.scheduleJob(rule, function(){  
        try {
            console.log('schedule')
            User.update(
                { leftTimes: 10 },
                {
                    where: {}
                }
            )
        } catch (err) {
            console.log(err)
        }
    });
}

module.exports = {
    resetLuckyTimes
}