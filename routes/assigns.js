const router = require("koa-router");

const Doctor = require("../structures/doctors");
const User = require("../structures/users");

const _ = router();

_.get("/",async ctx=>{
    const slot = await Doctor.aggregate([{$unwind:"$slots"},{$lookup:{"from":"user1","localField": "slots.user","foreignField": "id","as": "user" }}]);
    ctx.body = slot;
});

_.get("/free",async ctx=>{});
_.get("/free/:id",async ctx=>{});
_.get("/locked",async ctx=>{});
_.get("/locked/:id",async ctx=>{});



_.put("/",async (ctx)=>{
    if(!ctx.request.body.user_id || !ctx.request.body.doctor_id || !ctx.request.body.slot) ctx.throw(400,"wrong request");
    const user = await User.find({"id":ctx.request.body.user_id});
    if(user.length === 0) ctx.throw(404,"User not found");
    const doctor = await Doctor.findOne({"id":ctx.request.body.doctor_id});
    if(!doctor) ctx.throw(404,"Doctor not found");
    let slot = doctor.slots.find(el=>el.time.getTime() === new Date(ctx.request.body.slot).getTime());
    if(!slot) ctx.throw(404,"Slot not found");
    if(slot.user) ctx.throw(409,"Slot already assigned");
    slot.user = ctx.request.body.user_id;
    await doctor.save();
    ctx.body = slot;
});

module.exports = _.routes();