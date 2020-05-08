process.env.NODE_ENV = 'test';

const chai = require("chai");
const http = require("chai-http");

const User = require("../structures/users");
const Doctor = require("../structures/doctors");

const server = require("../index");
let should = chai.should();
chai.use(http);

describe("Assign",function () {
    let doctor,user;
    describe("Correct", function() {
        beforeEach(async ()=>{
            // Добавить объявление открытых слотов
            let time = new Date();
            time.setDate(time.getDate() +1);
            time.setHours(9);
            time.setMinutes(0);

            let slots = [];
            const count = 10;

            for (let i = 0;i < count;i ++){
                slots.push({time:time.getTime()});
                time.setMinutes(time.getMinutes() + 30)
            }

            doctor = (await Doctor.find())[0];
            doctor.slots = slots;
            await doctor.save();
            user = (await User.find())[0];
        });

        it("put", (done)=>{
            chai.request(server).put("/assign").set({"x-api-key":12344}).
            send({
                user_id:user.id,
                doctor_id:doctor.id,
                slot:doctor.slots[0].time
            }).
            end(async (err,res)=>{
                res.should.have.status(200);
                res.should.header("content-type","application/json; charset=utf-8");
                done()
            })
        });
        it("get all", async ()=>{});
        it("get all of doctor", async ()=>{});
        it("get free", async ()=>{});
        it("get free of doctor", async ()=>{});
        it("get locked", async ()=>{});
        it("get locked of doctor", async ()=>{});
    })
});