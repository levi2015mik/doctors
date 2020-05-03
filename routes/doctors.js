const router = require("koa-router");

const _ = router();

_.get("/",async ctx=>ctx.body="<h1>wsrsdf</h1>");

module.exports = _.routes();