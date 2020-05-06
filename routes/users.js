const router = require("koa-router");
const User = require("../structures/users");

const _ = router();

_.get("/",async ctx=>{
    User;
    ctx.body= await User.find()
})
.put("/",async ctx=>{
    const user = new User(ctx.request.body);
    let data;
    try {
        await user.save();
        data = user;

    } catch (e) {
        if(e.name === "ValidationError") {
            ctx.response.status = 400;
            ctx.body = {name: e.name, message: e.message};
            return;
        }
    }
    ctx.body=user;
})
.post("/:id", async ctx=>{
    let user = await User.find({"id":ctx.params.id});
    if(user.length === 0) {// error not found
        ctx.throw(404,Error("user not found"));
        return;
    } else
        user = user[0];
    for(let nm in ctx.request.body) user[nm] = ctx.request.body[nm];
    try{
        await user.save();
    } catch (e) {
        ctx.throw(400,e);
        return;
    }
    ctx.body=user
    })
.delete("/:id", async ctx=>{
    let user = await User.find({"id":ctx.params.id});
    if(user.length === 0) {// error not found
        ctx.throw(404,Error("user not found"));
        return;
    } else
        user = user[0];
        let userCopy = {id:user.id,msg:"deleted",status:-1};
    try{
        await user.delete();
    } catch (e) {
        ctx.throw(400,e);
        return;
    }
    ctx.body = userCopy

});
module.exports = _.routes();