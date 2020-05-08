process.env.NODE_ENV = 'test';

const chai = require("chai");
const http = require("chai-http");
const Doctor = require("../structures/doctors");

const server = require("../index");
let should = chai.should();
chai.use(http);


//
describe("Rest api",function() {
    let doctorsList,newUsers;
    describe("Doctors correct", function () {
        beforeEach(async () => {
            await Doctor.deleteMany({});

            newUsers = [
                {name:"Noskov Igir Nikolaevich",spec:"Psihiatr"},
                {name: "Masnikov Vladimir",spec: "Venerolog"},
                {name: "Viktor Odintsov",spec: "Venerolog"},
                ].map(el=>new Doctor(el));
            doctorsList = await Promise.all(newUsers.map(el=>el.save()))
        });

        it("get",function (){
            chai.request(server).get("/doctors").end((err,res)=>{
                res.should.have.status(200);
                res.should.header("content-type","application/json; charset=utf-8");
                res.body.should.be.a("array");
            });
        });

        it("Put",(done)=>{
            chai.request(server).put(`/doctors`).set({"x-api-key":12344}).send({name:"Vnukova Nina", spec:"Dermatolog"}).
            end((err,res)=>{
                res.should.have.status(200);
                res.should.header("content-type","application/json; charset=utf-8");
                res.body.should.haveOwnProperty("id");
                done()
            })
        });

        it("post",(done)=>{
            const spec = "Ginikolog";
            const url = `/doctors/${doctorsList[0].id}`;
            chai.request(server).post(url).set({"x-api-key":12344}).send({spec:spec}).
            end((err,res)=>{
                res.should.have.status(200);
                res.should.header("content-type","application/json; charset=utf-8");
                res.body.spec.should.to.equal(spec);
                done()
            })
        });

        it("delete", (done)=>{
            const url = `/doctors/${doctorsList[0].id}`;
            chai.request(server).delete(url).set({"x-api-key":12344}).
            end( async (err,res)=>{
                res.should.have.status(200);
                res.should.header("content-type","application/json; charset=utf-8");
                res.body.msg.should.to.equal("deleted");
                const collection = await Doctor.find();
                collection.length.should.to.equal(newUsers.length - 1);
                done()
            })
        })

        it("Open slots",(done)=>{
            const url = `/doctors/${doctorsList[0].id}/slot`;
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
            chai.request(server).put(url).set({"x-api-key":12344}).
            send(slots).
            end(async (err,res)=>{
                res.should.have.status(200);
                res.should.header("content-type","application/json; charset=utf-8");
                res.body.slots.length.should.to.equal(count);
                const baseDoc = await Doctor.findOne({id:doctorsList[0].id});
                baseDoc.slots.length.should.to.equal(count);
                done()
            })

        })
    })
});