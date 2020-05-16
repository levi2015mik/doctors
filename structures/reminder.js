const {Schema,model} = require("mongoose");

const User = require("./users");
const Doctor = require("./doctors");
const send = require("../utils/send_msgs");

const timeout = process.env.REMIND_TIMEOUT || 600000;
const NOTICE_NOT=0,NOTICE_DAY=1,NOTICE_HOURS=2;

async function start(testTime,sendFunction) {
    await require("./mongo")();
    setInterval(async ()=>{
        remind(new Date(),send)
    },timeout)
}

async function remind(time,send){
    const tomorrow = new Date((new Date()).setDate(time.getDate() + 1));

    let slots = await Doctor.getSlots({"slots.user":{$exists:true}});
    for (let i = 0;i < slots.length;i ++){

        // Сообщение за день
        if(slots[i].time.getDate() === tomorrow.getDate() && !!slots[i].noticed == NOTICE_NOT){
            // Отправить сообщение - день
            const hourMin = slots[i].time.toLocaleString("ru",{  hour: 'numeric',minute: 'numeric'});
            const message = `${time.toLocaleDateString()} | Привет ${slots[i].userName}! Напоминаем что вы записаны к ${slots[i].spec} завтра в ${hourMin}!`;
            // Сохранение слота
            await Doctor.updateSlot(slots[i].id,slots[i].userId,slots[i].time,NOTICE_DAY);
            send(message);
        }

        // Сообщение за 2 часа
        if(
            slots[i].time.getDate() === time.getDate()          &&
            slots[i].time.getHours() <= time.getHours() + 2     &&
            slots[i].noticed == NOTICE_DAY
        ){
            // Отправить сообщение - день
            const hourMin = slots[i].time.toLocaleString("ru",{  hour: 'numeric',minute: 'numeric'});
            const message = `${time.toLocaleDateString()} | Привет ${ slots[i].userName }! Вам через 2 часа к ${ slots[i].spec } в ${hourMin}!`;
            if(process.env.NODE_ENV === "test") send(message);
            else send(message);
            // Сохранение слота
            Doctor.updateSlot(slots[i].id,slots[i].userId,slots[i].time,NOTICE_HOURS)
        }
    }
}
module.exports.start = start;
module.exports.remind = remind;