const router = require("koa-router");

const Doctor = require("../structures/doctors");
const User = require("../structures/users");

const _ = router();

_.get("/",async ctx=>{
    ctx.body = await Doctor.getSlots();
});
_.get("/:id",async ctx=>{
    ctx.body = await Doctor.getSlots({id:ctx.params.id});
});

_.get("/free",async ctx=>{
    ctx.body = await Doctor.getSlots({"slots.user":{$exists:false}});
});
_.get("/free/:id",async ctx=>{
    ctx.body = await Doctor.getSlots({$and:[{"slots.user":{$exists:false}},{id:ctx.params.id}]});
});
_.get("/locked",async ctx=>{
    ctx.body = await Doctor.getSlots({"slots.user":{$exists:true}});
});
_.get("/locked/:id",async ctx=>{
    ctx.body = await Doctor.getSlots({$and:[{"slots.user":{$exists:true}},{id:ctx.params.id}]});
});



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