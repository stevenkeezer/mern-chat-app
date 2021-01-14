const jwt = require('jsonwebtoken')

const verifyToken = (token) => {
    let newToken = token.split(" ")[1];
    return jwt.verify(newToken, process.env.JWT_SECRET)
}

module.exports = verifyToken