const bcrypt = require("bcrypt");

const isPwdEquals = async (password, pwdHash) => {
    return await bcrypt.compare(password, pwdHash);
}

module.exports = {
    isPwdEquals
}