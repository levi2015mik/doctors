const router = require("koa-router");

const Doctor = require("../structures/doctors");

const _ = router();

_.get("/",async ctx=>{
    ctx.body= await Doctor.find();
})
    .put("/",async ctx=>{
        const doctor = new Doctor(ctx.request.body);
        try {
            await doctor.save();
        } catch (e) {
            if(e.name === "ValidationError") {
                ctx.response.status = 400;
                ctx.body = {name: e.name, message: e.message};
                return;
            }
        }
        ctx.body=doctor;

    })
    .post("/:id", async ctx=>{
        let doctor;
        try{
            doctor = await Doctor.findOneAndUpdate({"id":ctx.params.id},ctx.request.body,{new: true});
            if(!doctor) throw( {status:404,message:"User not found"})
        } catch (e) {
            ctx.throw(e.status || 400,e);
            return;
        }
        ctx.body=doctor
    })
    .delete("/:id", async ctx=>{
        let doc = await Doctor.find({"id":ctx.params.id});
        if(doc.length === 0) {// error not found
            ctx.throw(404,Error("user not found"));
            return;
        } else
            doc = doc[0];
        let docCopy = {id:doc.id,msg:"deleted",status:-1};
        try{
            await doc.delete();
        } catch (e) {
            ctx.throw(400,e);
            return;
        }
        ctx.body = docCopy

    })

    // Добавление слота/слотов
    .put("/:id/slot",async ctx=>{
        const res = await Doctor.findOne({"id":ctx.params.id});
        for(let i = 0;i < ctx.request.body.length;i ++)
        res.slots.push({time:new Date(ctx.request.body[i].time)});
        await res.save();
        ctx.body = res;
    });


module.exports = _.routes();