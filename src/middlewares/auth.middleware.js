const jwt = require('jsonwebtoken')
const config = require('../config/config')
const JwtService = require('../modules/auth/jwt.service')
const UnauthorizedError = require('../errors/UnauthorizedError')

const authJwt = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer')) {
        throw new UnauthorizedError("Token Tidak Di temukan!");
    }
    // Bearer {token}

    const token =authHeader.split(' ')[1]

    // {token}
    try {
        const decoded = JwtService.verify(token)
        req.user = decoded;
        req.userId = decoded.id;
        next();
    }catch(err) {
        throw new UnauthorizedError("Token ini sudah tidak valid atau sudah kedaluarsa")
    }
}

module.exports = authJwt;