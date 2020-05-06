const {Schema,model} = require("mongoose");
const User = require("./users");
const Doctor = require("./doctors");
async function write(){
    await require("./mongo")();
    await User.deleteMany({});
    await Doctor.deleteMany({});

    const U = await new User({name: "Piter",phone: "+76543289"}).save();
    const D = await new Doctor({name: "Noskov",spec:"psihiatr"}).save();

    console.log("Insert test data is complite!");
}

write();
