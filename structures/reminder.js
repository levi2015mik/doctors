const {Schema,model} = require("mongoose");

const User = require("./users");
const Doctor = require("./doctors");
const send = require("../utils/send_msgs");

const timeout = 1000 * 5 //60 * 10;
const NOTICE_NOT=0,NOTICE_DAY=1,NOTICE_HOURS=2;

async function start(testTime) {
    await require("./mongo")();
    setInterval(async ()=>{
        const time = (process.env.NODE_ENV === "test")?testTime:new Date();
        const tomorrow = new Date((new Date()).setDate(time.getDate() + 1));

        let slots = await Doctor.getSlots({"slots.user":{$exists:true}});
        for (let i = 0;i < slots.length;i ++){

            // Сообщение за день
            if(slots[i].time.getDate() === tomorrow.getDate() && !!slots[i].noticed == NOTICE_NOT){
                // Отправить сообщение - день
                const message = `
                    ${time.toLocaleDateString()} | Привет ${slots[i].userName}! Напоминаем что вы записаны к ${slots[i].spec} завтра в ${slots[i].time}!`;
                send(message);
                // Сохранение слота
                Doctor.updateSlot(slots[i].id,slots[i].userId,slots[i].time,NOTICE_DAY)
            }

            // Сообщение за 2 часа
            if(
                slots[i].time.getDate() === time.getDate()          &&
                slots[i].time.getHours() >= time.getHours() - 2     &&
                slots[i].noticed == NOTICE_HOURS
            ){
                // Отправить сообщение - день
                const message = `
                    ${time.toLocaleDateString()} | Привет ${ slots[i].userName }! Вам через 2 часа к ${ slots[i].spec } в ${ slot.time }}!`;
                send(message);
                // Сохранение слота
                Doctor.updateSlot(slots[i].id,slots[i].userId,slots[i].time,NOTICE_HOURS)
            }
        }
    },timeout)
}

module.exports = start;