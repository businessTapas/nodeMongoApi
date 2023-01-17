const { expressjwt: jwtt } = require("express-jwt");
// or ES6
// import { expressjwt, ExpressJwtRequest } from "express-jwt";const config = require('config.json');
const userService = require('../users/user.service');
const config = require('../config');

module.exports = jwt;

function jwt() {
    const secret = config.secret;
    return jwtt({ secret, algorithms: ['HS256'], getToken, isRevoked }).unless({
        path: [
            // public routes that don't require authentication
            '/users/authenticate',
            '/users/register'
        ]
    });
}

async function getToken(req) {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
        //console.log(req.headers.authorization.split(" ")[1]);
      return req.headers.authorization.split(" ")[1];
    } else if (req.query && req.query.token) {
      return req.query.token;
    }
    return null;
  }

async function isRevoked(req, payload) {
    //console.log(payload.payload);
    const user = await userService.getById(payload.payload.sub);
    //console.log(user);
    // revoke token if user no longer exists
    if (!user) {
        return true;
    }

    false;
};
