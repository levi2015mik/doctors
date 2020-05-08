const dotenv = require( "dotenv");

dotenv.config();
const mongoose = require('mongoose');




module.exports = async function connect() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true});
        mongoose.set('useFindAndModify', false);

    } catch (e) {
        console.error(e);
        process.exit(-1)
    }
    return Promise.resolve()
};