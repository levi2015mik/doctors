const router = require("koa-router");

const Doctor = require("../structures/doctors");
const User = require("../structures/users");

const _ = router();

_.get("/",async ctx=>{
    const slot = await Doctor.aggregate([{$unwind:"$slots"},{$lookup:{"from":"user1","localField": "slots.user","foreignField": "id","as": "user" }}]);
    ctx.body = slot;
});

_.put("/",async (ctx,next)=>{
    const user = await User.find({"id":ctx.request.body.user_id});
    if(user.length === 0) ctx.throw(404,"User not found");
});

module.exports = _.routes();