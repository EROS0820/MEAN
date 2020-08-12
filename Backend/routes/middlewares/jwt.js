/**
 * A middleware for JWT Token
 */
const jwt = require('jwt-simple');
const jwtRouter = require('express-jwt');
const { server } = require('../../config/config');
const { UserModel, MetaModel } = require('../../db');

const JWT_SECRET = server.secret;
class JwtService {
    // Encrypt the payload object
    pack(payload) {
            return jwt.encode(payload, JWT_SECRET);
        }
        // Decrypt the payload object
    unpack(payload) {
        return jwt.decode(payload, JWT_SECRET);
    }

    // Check user is valid or not
    checkUser() {
        return jwtRouter({
            secret: JWT_SECRET,
            requestProperty: 'jwtUser', // prevent jwt from overwriting req.user
            isRevoked: this.saveUserToReq // When user valid it call a callback function
        });
    }

    // Add User to req: req.user
    saveUserToReq(req, user, done) {
        const {
            id,
            email
        } = user;
        if (user.id == 0) {
            MetaModel.find({
                key: 'admin_login'
            }).then(records => {
                if (records && records.length >= 1) {
                    if (records[0].value.email == email) {
                        req.user = user;
                        done(null, false);
                    }
                }
                done(new Error('not find this admin user'))
            });
        } else {
            UserModel.findOne({
                    userid: id,
                    email
                })
                .then((user) => {
                    if (!user) done(new Error('not find this user'))
                    else {
                        req.user = user;
                        // false means this token hasn't been revoked yet (token still valid)
                        done(null, false);
                    }
                })
                .catch(err => done(err));
        }
    }
}
module.exports = new JwtService();