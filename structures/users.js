const {Schema,model} = require("mongoose");
const { v4: uuidv4 } = require('uuid');

const _user = Schema({
    name:{
        type:"string",
        required:true
    },
    phone:{
        type: "string",
        required:true
    },
    id:{
        type: "string",
        required:true
    }
});

// Создание идентификатора в соответствии с заданием
_user.pre("validate",function(next){
    if(!this.id) this.id = uuidv4();
    next()
});

const User = model("User1",_user);

module.exports = User;