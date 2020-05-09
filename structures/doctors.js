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
    slots:[{time:"Date",user:"string"}]
});


// Создание идентификатора в соответствии с заданием
_doctor.pre("validate",function(next){
    if(!this.id) this.id = uuidv4();
    next()
});
const Doctor = model("doctor",_doctor);

// Получение слотов через aggregate
Doctor.getSlots = function(match){
    let conditions = [
        {$unwind:"$slots"},
        {$lookup:{from:"user1",localField: "slots.user",foreignField: "id",as: "user" }},
        {$project:{"_id":0,"user._id":0,"__v":0, "user.__v":0,"slots._id":0}}
    ];
    if(match) conditions.splice(1,0,{$match: match});
    return this.aggregate(conditions);
};


module.exports = Doctor;