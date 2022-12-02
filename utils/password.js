const bcrypt = require("bcrypt");

const isValidPassword = async (pwd, pwdCompare) => {
    return await bcrypt.compare(pwd, pwdCompare);
}

module.exports = {
    isValidPassword
}