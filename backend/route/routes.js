const express = require('express');
const router = express.Router();

const User = require('../model/User');

router.get('/get', (req, res, next) => {
    User.find((err, users) => {
        res.json(err ? err : users);
    });
});

router.post('/post', (req, res, next) => {
    let user = new User({
        name: req.body.name,
    });
    user.save((err, result) => {
        res.json(err ? err : {msg: 'User created successfully'}, result);
    });
});

router.put('/put/:id', (req, res, next) => {
    User.findOneAndUpdate(
        {_id: req.params.id},
        {$set: {name: req.body.name}}, 
        (err, result) => {
            res.json(err ? err : {msg: 'User updated successfully', result});
        }
    );
});

router.delete('/delete/:id', (req, res, next) => {
    User.remove(
        {_id: req.params.id},
        (err, result) => {
            res.json(err ? err : result);
        }
    );
});

module.exports = router;