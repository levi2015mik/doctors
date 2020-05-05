const router = require("koa-router");

const _ = router();

_.get("/",async ctx=>{
    ctx.body=[{"name":"Faust"}]
})
.put("/",async ctx=>{
    ctx.body={"name":"Faust","id":36474747543}
})
.post("/:id", async ctx=>{
    ctx.body={"name":"Faust","id":36474747543}
    })
.delete("/:id", async ctx=>{
    ctx.body={"name":"Faust","id":36474747543}
});
module.exports = _.routes();