const Koa = require("koa");
const router = require("koa-router");
const logger = require("koa-logger");
const bodyParser = require("koa-body");

const mongo = require("./structures/mongo")();

//const mongo = require("./structures/mongo");

const users = require("./routes/users");
const doctors = require("./routes/doctors");

const app = new Koa();
app.use(bodyParser({
    formidable:{uploadDir:'/uploads'},
    multipart:true,
    urlencoded:true
}));

if(process.env.NODE_ENV !== "test")
app.use(logger());

const _ = router();
_.use("/users",users);
_.use("/doctors",doctors);
app.use(_.routes());
module.exports =app.listen(3000);

// module.exports = app;