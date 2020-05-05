const router = require("koa-router");

const _ = router();

_.get("/",async ctx=>{
    ctx.body={"name":"Faust"}
})
    .put("/",async ctx=>{
        ctx.body={"name":"Faust"}
    })
    .post("/:id", async ctx=>{
        ctx.body = {"name":"Faust"}
    })
    .delete("/:id", async ctx=>{
        ctx.body = {"name":"Faust"}
    });

module.exports = _.routes();