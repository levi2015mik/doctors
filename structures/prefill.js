const {Schema,model} = require("mongoose");

const User = require("./users");
const Doctor = require("./doctors");

const data = require("../data");

async function write(){
    await require("./mongo")();
    await User.deleteMany({});
    await Doctor.deleteMany({});


    // Объявление пользователей и врачей
    let users   = data.users.map(el=>new User(el));
    let doctors = data.doctors.map(el=>new Doctor(el));


    // Открытие слотов для четырех врачей и двух кабинетов
    let time1 = new Date();
    let time2 = new Date();

    time1.setDate(time1.getDate() + 2); time1.setHours(9); time1.setMinutes(0);
    time2.setDate(time2.getDate() + 2); time2.setHours(15); time2.setMinutes(0);
    let slots1 = [] ,slots2 = [] ,slots3 = [] ,slots4 = [] ;
    for(let i = 0;i < 10;i ++){
        slots1.push({time:time1.getTime()});
        slots3.push({time:time2.getTime()});

        slots2.push({time:time1.getTime()});
        slots4.push({time:time2.getTime()});

        time1.setMinutes(time1.getMinutes() + 30);
        time2.setMinutes(time2.getMinutes() + 30);


    }

    doctors[0].slots = slots1;
    doctors[1].slots = slots2;
    doctors[2].slots = slots3;
    doctors[3].slots = slots3;

    // Сохранение
    users   .forEach(el=>el.save());
    doctors .forEach(el=>el.save());


    console.log("Insert test data is complite!");
}

write();
