process.env.NODE_ENV = 'test';

const chai = require("chai");
const http = require("chai-http");

const server = require("../index");

let should = chai.should();
chai.use(http);

// Включение режима тестирования
describe('Create test environment', () => {
    beforeEach((done) => {
        done()
    })
});

// Проверка mocha/ chai
describe("Test System test",function() {
    describe("start",function () {
        it("equal",()=>{chai.assert.equal(1,1)});
        it(" Not equal",()=>{chai.assert.notEqual(1,0)});
    })
});

// Проверкаа rest api
describe("Rest api",function() {
    describe("Users",function () {
        it("get",function s(done){
            chai.request(server).get("/users").end((err,res)=>{
               res.should.have.status(200);
               res.should.header("content-type","application/json; charset=utf-8");
               res.body.should.be.a("array")
            });
            done()
        });
        it("put",()=>{
            chai.request(server).put("/users").set({"x-api-key":12344}).send({name:"1234"}).
                end((err,res)=>{
                    res.should.have.status(200);
                    res.should.header("content-type","application/json; charset=utf-8");
                    res.body.should.hasOwnProperty("id")
            })
        });
        it("post",()=>{chai.assert.notEqual(1,0)});
        it("delete",()=>{chai.assert.notEqual(1,0)});
    })
});