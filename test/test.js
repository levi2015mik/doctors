process.env.NODE_ENV = 'test';

const chai = require("chai");
const http = require("chai-http");

const User = require("../structures/users");
const Doctor = require("../structures/doctors");

const server = require("../index");
let should = chai.should();
chai.use(http);


// Проверкаа rest api User
describe("Rest api",function() {

    describe("Users correct",function () {
        let usersList,newUsers;
        beforeEach(async () => {
            await User.deleteMany({});

             newUsers = [
                {name:"Keren",phone:"052 875 76 60"},
                {name: "Miron",phone: "434 54 32"},
                {name: "Alise",phone: "87043213"},
                {name: "Ilon Mask",phone: "8 (921) 555 30 77"},
                {name: "Kirill",phone: "366 54 29"},
                {name: "Viktoria",phone: "0 303 220 00 99"},
                {name: "Nikolas",phone: "+1 333 05 88"},
                {name: "Olesya",phone: "999 00 44"},

                ].map(el=>new User(el));
            usersList = await Promise.all(newUsers.map(el=>el.save()))
        });

        it("get",function (){
            chai.request(server).get("/users").end((err,res)=>{
               res.should.have.status(200);
               res.should.header("content-type","application/json; charset=utf-8");
               res.body.should.be.a("array");
            });
        });
        it("Put incorrect",()=>{
            chai.request(server).put("/users").set({"x-api-key":12344}).send({name:"1234"}).
                end((err,res)=>{
                    res.should.have.status(400);
                    res.should.header("content-type","application/json; charset=utf-8");
                    // res.body.should.hasOwnProperty("id")
            })
        });
        it("Put",()=>{
            chai.request(server).put(`/users`).set({"x-api-key":12344}).send({name:"Alex", phone:"123453556"}).
                end((err,res)=>{
                    res.should.have.status(200);
                    res.should.header("content-type","application/json; charset=utf-8");
                    res.body.should.haveOwnProperty("id");
            })
        });

        it("post",(done)=>{
            const phone = "9988";
            const url = `/users/${usersList[0].id}`;
            chai.request(server).post(url).set({"x-api-key":12344}).send({phone:phone}).
                end((err,res)=>{
                res.should.have.status(200);
                res.should.header("content-type","application/json; charset=utf-8");
                res.body.phone.should.to.equal(phone);
                done()
            })

        });

        it("delete", (done)=>{
            const url = `/users/${usersList[0].id}`;
            chai.request(server).delete(url).set({"x-api-key":12344}).
            end( async (err,res)=>{
                res.should.have.status(200);
                res.should.header("content-type","application/json; charset=utf-8");
                res.body.msg.should.to.equal("deleted");
                const collection = await User.find();
                collection.length.should.to.equal(newUsers.length - 1);
                done()
            })
        })


})

});