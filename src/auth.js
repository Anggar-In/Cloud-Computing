<<<<<<< HEAD
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('./config');

const auth = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Token tidak diberikan' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token tidak valid' });
    }
    req.user_id = decoded.user_ID;
    console.log("user_id dari token:", req.user_id);
    next();
  });
};

module.exports = auth;
=======
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('./config');

const auth = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Token tidak diberikan' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token tidak valid' });
    }
    req.user_id = decoded.user_ID;
    console.log("user_id dari token:", req.user_id);
    next();
  });
};

module.exports = auth;
>>>>>>> 3ac12cd4eb0066f188561a68336e695822eea286
