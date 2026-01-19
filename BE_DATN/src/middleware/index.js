const jwt = require('jsonwebtoken');
const Quan_tri_vien = require('../models/Quan_tri_vien.js');

require('dotenv').config()

exports.checkToken = (req, res, next) => {
    const token = req.get('Authorization') ? req.get('Authorization').split(' ')[1] : '';
    if (!token) {
        return res.status(401).json({ message: "Missing token" });
    }
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token" });
        }
        req.userId = decoded._id;
        next();
    });
};

exports.checkToken2 = (req, res, next) => {
    const token = req.get('Authorization') ? req.get('Authorization').split(' ')[1] : '';
    if (!token) {
        return res.status(401).json({ message: "Missing token" });
    }
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        req.userId = decoded?._id || "";
        next();
    });
};

exports.isAdmin = async (req, res, next) => {
    const token = req.get('Authorization') ? req.get('Authorization').split(' ')[1] : '';
    if (!token) {
        return res.status(401).json({ message: "Missing token" });
    }
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token" });
        }
        let admin = await Quan_tri_vien.findById({ _id: decoded._id });
        if (admin) {
            req.adminId = decoded._id;
            return next();
        }
        return res.status(403).json({ message: "Is not admin" });
    });
}
