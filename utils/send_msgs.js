const fs = require("fs");
const chalk = require("chalk");

const filename = "messages.log";

/**
 *  Заглушка для отправки сообщения
 * @param msg
 * @param phone
 */
function send(msg, phone) {
    console.log(chalk.gray("  ---")+ chalk.bold(" MSG ") + chalk.blue(msg));
    fs.writeFile(filename,msg + "\n",{flag:"a"},()=>{})
}
module.exports = send;