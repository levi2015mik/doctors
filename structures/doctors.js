const {Schema,model} = require("mongoose");
const { v4: uuidv4 } = require('uuid');

const _doctor = Schema({
    name:{
        type:"string",
        required:true
    },
    spec:{
        type: "string",
        required:true
    },
    id:{
        type: "string",
        required:true
    },
    slots:[{time:"Date",user:"string",noticed:"number"}]
});


// Создание идентификатора в соответствии с заданием
_doctor.pre("validate",function(next){
    if(!this.id) this.id = uuidv4();
    next()
});
const Doctor = model("doctor",_doctor);

// Получение слотов через aggregate
Doctor.getSlots = async function(match){
    let conditions = [
        {$unwind:"$slots"},
        {$lookup:{from:"user1",localField: "slots.user",foreignField: "id",as: "user" }},
        {$project:{"_id":0,"user._id":0,"__v":0, "user.__v":0,"slots._id":0}}
    ];
    if(match) conditions.splice(1,0,{$match: match});
    let out;
    try{
        out = await this.aggregate(conditions);
    }catch (e) {
        console.error(e)
    }

    // flat format with optional chaining
    out = out.map(el=>{
        return {
            name:el.name,
            id:el.id,
            spec:el.spec,
            time:el.slots.time,
            noticed:el.slots.noticed,
            userId:el.user[0] && el.user[0].id,
            userPhone:el.user[0] && el.user[0].phone,
            userName:el.user[0] && el.user[0].name
        }
    });
    return out;
};

Doctor.updateSlot = async function(id,userId,time,noticed){
    let current = await this.findOne({id:id});
    let slot = current.slots.find(el=>el.time.getTime() == time.getTime() && el.user == userId);
    slot.noticed = noticed;
    await this.updateOne({id:id},current)
};

module.exports = Doctor;