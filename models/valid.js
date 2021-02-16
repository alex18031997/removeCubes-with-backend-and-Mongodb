const Result = require('./result').Result;
const User = require('./users').User;

module.exports = {
    result: (name, result) => {
        const NewResult = new Result({
            name: name,
            result: result,
        });

        NewResult.save(function (err) {

        });
    },
    reg: (name, login, password, DataReg, userIp) => {
        const user = new User({
            login: login,
            name: name,
            userIp: userIp,
            DataReg: DataReg,
            password: password,
            role: 'gamer',
            gameCount: 0,
            topScore: 0

        });
        return user;
    }
};
