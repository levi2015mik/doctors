process.env.NODE_ENV = 'test';
const chai = require("chai");
const spies = require("chai-spies");

const Doctor = require("../structures/doctors");
const prefill = require("../structures/prefill");

const reminder = require("../structures/reminder");
const send = require("../utils/send_msgs");

let should = chai.should();
chai.use(spies);

const sendSpy = chai.spy(send);

describe("send remember messages",function() {
    let events, time= new Date(),init = false;
    describe("", function () {
        beforeEach(async () => {
            if(!init){
                await prefill();
                init = true;
            }
            await require("../structures/mongo")();
            events = await Doctor.getSlots({"slots.user":{$exists:true}});
            time.setDate(events[0].time.getDate()-2);

        });
        it("1 day message",async function() {
            time.setDate(events[0].time.getDate() - 1);
            await reminder.remind(time,sendSpy);
            sendSpy.should.have.been.called.exactly(6);
        });

        it("2 hours message",async function() {
            time.setDate(events[0].time.getDate());
            time.setHours(events[0].time.getHours() - 1);
            time.setMinutes(events[0].time.getMinutes() - 50);
            await reminder.remind(time,sendSpy);
            sendSpy.should.have.been.called.exactly(8);
        })

    });

});
