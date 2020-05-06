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

module.exports = Doctor;