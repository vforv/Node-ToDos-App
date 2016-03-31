var cryptojs = require('crypto-js');

module.exports = function (db) {
    return {
        requireAuth: function (req, res, next) {
            var token = req.get('Auth') || '';

            db.token.findOne({
                where: {
                    tokenHash: cryptojs.MD5(token).toString()
                }
            })
                    .then(function (tokenInstance) {
                        if (!tokenInstance) {
                            throw new Error();
                        }

                        req.token = tokenInstance;
                        return db.user.findByToken(token);
                    })
                    .then(function (user) {
                        req.user = user;
                        next();
                    })
                    .catch(function () {
                        res.status(401).send();
                    });
        },
        header: function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "X-Requested-With");
            res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
            res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With, Auth");
            next();
        }
    };
};