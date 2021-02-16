const express = require('express');
const requestIp = require('request-ip');
const path = require('path');
const cookieParser = require('cookie-parser');
const app = express();
const User = require('./models/users').User;
const Result = require('./models/result').Result;
const asyncHandler = require('express-async-handler');
const session = require('express-session');
const sessionParams = {
    secret: 'keyboard cat',
    cookie: {}
}
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client')));
app.use(express.urlencoded({extended: true}));
app.use(session(sessionParams));
const isUserAuth = (req) => {
    return req.session.userId;
}

app.use((req, res, next) => {
    if (isUserAuth(req)) {
        req.userAuth = true;
    }
    return next();
})

app.get('/', (req, res) => {
    if (req.userAuth) {
        res.sendFile(__dirname + '/client/game.html');
        const clientIp = requestIp.getClientIp(req);
    } else {
        res.sendFile(__dirname + '/client/login.html');
    }
});

app.post('/login', ((req, res) => {
    const login = req.body.login;
    const password = req.body.pass;
    User.findOne({login: login}, (err, user) => {
        if (user) {
            if (user.checkPassword(password)) {
                req.session.userId = user._id;
                res.status(200).send({message: 'successful'})
            } else {
                res.status(403).send({message: 'Invalid password'});
            }
        } else {
            res.status(403).send({message: 'Invalid login or password'});
        }
    })
}));

app.post('/logout', ((req, res) => {
    req.session.destroy();
    res.redirect('/');
}));

app.get('/showreg', ((req, res) => {
    if (req.userAuth) {
        res.sendFile(__dirname + '/client/404.html');
    } else {
        res.sendFile(__dirname + '/client/reg.html');
    }
}));

app.post('/reg', asyncHandler((req, res, next) => {
    const name = req.body.name;
    const login = req.body.login;
    const pass = req.body.pass;
    const dataReg = req.body.DataReg;
    const userIp = requestIp.getClientIp(req);
    const user = require('./models/valid').reg(name, login, pass, dataReg, userIp);
    user.save((err, callback) => {
        if (err) {
            res.status(400).send({message: 'this login is busy'})
        } else {
            req.session.userId = user._id;
            res.status(200).send({message: 'successful'});
        }

    });
}));

app.post('/getUserName', asyncHandler((req, res, next) => {
    const id = req.session.userId;
    User.findOne({_id: id}, (err, user) => {
        res.status(200).send({message: user});
    });
}));

app.get('/result', (req, res) => {
    Result.find({}, (err, result) => {
        if (result.length < 10) {
            res.send(result);
        } else {
            res.send(result.slice(0, 10));
        }
    }).sort({result: -1});
});

app.post("/form", (req, res) => {
    const name = req.body[0].name;
    const result = req.body[0].result;
    require('./models/valid').result(name, result);
    User.findOne({name: name}, (err, user) => {
        if (result > user.topScore) {
            User.findOneAndUpdate(
                {name: name}, {$set: {topScore: result}}, (err, result) => {
                }
            );
        }
        ;
    });
    User.findOneAndUpdate(
        {name: name}, {$inc: {gameCount: 1}}, (err, result) => {
        }
    );
});

app.get('/admin', ((req, res) => {
    const id = req.session.userId;
    User.findOne({_id: id}, (err, user) => {
        if (req.userAuth) {
            if (user.role === 'admin') {
                res.sendFile(__dirname + '/client/adminpanel.html');
            } else {
                res.sendFile(__dirname + '/client/notEnoughRights.html');
            }
        } else {
            res.sendFile(__dirname + '/client/login.html');
        }
    });


}))


app.get('*', (req, res) => {
    res.sendFile(__dirname + '/client/404.html');
});

app.post('/adminpanel', ((req, res) => {
    const sortBy = req.body;
    User.find({}, (err, user) => {
        const users = user.slice(0, 3);
        res.status(200).send({message: users});
    }).sort(sortBy);


}));

app.post('/findUser', (req, res) => {
    const findValue = req.body.findValue;
    User.find({name: new RegExp(findValue)}, (err, user) => {
        res.status(200).send({message: user});
    });
});

app.post('/navPages', (req, res) => {
    const from = req.body.from;
    const to = req.body.to;
    User.find({}, (err, user) => {
        const users = user.slice(from, to);
        if (users.length === 0) {
            const from = 0;
            const to = 3;
            const users = user.slice(from, to);
            res.status(200).send({
                message: users,
                value: 'enough'
            })
        } else {
            res.status(200).send({
                message: users,
                value: 'notEnough'
            });
        }
    });


});

app.post('/backNavPages', (req, res) => {
    const from = req.body.from;
    const to = req.body.to;
    User.find({}, (err, user) => {
        const users = user.slice(from, to);
        if (users.length === 0) {
            const from = 0;
            const to = 3;
            const users = user.slice(from, to);
            res.status(200).send({
                message: users,
                value: 'enough'
            })
        } else {
            res.status(200).send({
                message: users,
                value: 'notEnough'
            });
        }
    });

});

app.listen( () => {
    console.log(`App listening at localhost:3000`);
});


app.use((err, req, res, next) => {
    console.log('err', err);
});


app.listen(3000);