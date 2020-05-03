const Koa = require("koa");
const router = require("koa-router");

const users = require("./routes/users");
const doctors = require("./routes/doctors");

const app = new Koa();

const _ = router();
_.use("/users",users);
_.use("/doctors",doctors);
app.use(_.routes());
app.listen(3000);