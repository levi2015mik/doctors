const router = require("koa-router");

const _ = router();

_.get("/",async ctx=>ctx.body="1234556");

module.exports = _.routes();