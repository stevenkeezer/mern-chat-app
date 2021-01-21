const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const router = express.Router();
const Message = require('../models/messageModel');
const Conversation = require('../models/conversationModel');
const verifyToken = require("../utils/verifyToken")
const { onlineUsers } = require('../controllers/userController')

// Token verfication middleware
router.use(function (req, res, next) {
    try {
        const jwtUser = verifyToken(req.headers.authorization)
        req.user = jwtUser;
        next();
    } catch (err) {
        console.log(err);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Unauthorized' }));
        res.sendStatus(401);
    }
});

// Get conversations list
router.get('/conversations', (req, res) => {
    let from = mongoose.Types.ObjectId(req.user.id);
    Conversation.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'recipients',
                foreignField: '_id',
                as: 'recipientObj',
            },
        },
    ])
        .match({ recipients: { $all: [{ $elemMatch: { $eq: from } }] } })
        .project({
            'recipientObj.password': 0,
            'recipientObj.__v': 0,
            'recipientObj.date': 0,
        })
        .exec((err, conversations) => {
            if (err) {
                console.log(err);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: 'Failure' }));
                res.sendStatus(500);
            } else {
                res.send(conversations);
            }
        });
});


// Get messages from conversation
// based on conversation id
// router.get('/conversations/query', (req, res) => {
//     let conversationId = mongoose.Types.ObjectId(req.query.conversationId);
//     // need user Id, 
//     console.log(conversationId)
//     // let user2 = mongoose.Types.ObjectId(req.query.userId);

//     Message.aggregate([{
//         $lookup: {
//             from: 'users',
//             localField: 'conversation',
//             foreignField: '_id',
//             as: 'messageObj'
//         }
//     }])
//         .match({ conversation: conversationId })
//         .project({
//             'messageObj.password': 0,
//             'messageObj.__v': 0,
//             'messageObj.date': 0,
//         }).exec((err, messages) => {
//             if (err) {
//                 console.log(err);
//                 res.setHeader('Content-Type', 'application/json');
//                 res.end(JSON.stringify({ message: 'Failure' }));
//                 res.sendStatus(500);
//             } else {
//                 console.log(messages)
//                 res.send(messages);
//             }
//         })

// });

// Get messages from conversation
// based on to & from
router.get('/conversations/query', (req, res) => {
    let user1 = mongoose.Types.ObjectId(req.user.id);
    let user2 = mongoose.Types.ObjectId(req.query.userId);

    Message.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'to',
                foreignField: '_id',
                as: 'toObj',
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'from',
                foreignField: '_id',
                as: 'fromObj',
            },
        },
    ])
        .match({
            $or: [
                { $and: [{ to: user1 }, { from: user2 }] },
                { $and: [{ to: user2 }, { from: user1 }] },
            ],
        })
        .project({
            'toObj.password': 0,
            'toObj.__v': 0,
            'toObj.date': 0,
            'fromObj.password': 0,
            'fromObj.__v': 0,
            'fromObj.date': 0,
        })
        .exec((err, messages) => {
            if (err) {
                console.log(err);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: 'Failure' }));
                res.sendStatus(500);
            } else {
                res.send(messages);
            }
        });
});

// Post private message
router.post('/', (req, res) => {
    let from = mongoose.Types.ObjectId(req.user.id);
    let to = mongoose.Types.ObjectId(req.body.to);

    Conversation.findOneAndUpdate(
        {
            recipients: {
                $all: [
                    { $elemMatch: { $eq: from } },
                    { $elemMatch: { $eq: to } },
                ],
            },
        },
        {
            recipients: [req.user.id, req.body.to],
            lastMessage: req.body.body,
            date: Date.now(),
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
        function (err, conversation) {
            if (err) {
                console.log(err);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: 'Failure' }));
                res.sendStatus(500);
            } else {
                let message = new Message({
                    conversation: conversation._id,
                    to: req.body.to,
                    from: req.user.id,
                    body: req.body.body,
                });

                function getKeyByValue(object, value) {
                    return Object.keys(object).find(key => object[key] === value);
                }
                console.log('endpoint hit', req.online, req.user.id)

                req.io.to(getKeyByValue(req.online, req.user.id)).emit('messages', req.body.body);
                req.io.to(getKeyByValue(req.online, req.body.to)).emit('messages', req.body.body);

                message.save(err => {
                    if (err) {
                        console.log(err);
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ message: 'Failure' }));
                        res.sendStatus(500);
                    } else {
                        res.setHeader('Content-Type', 'application/json');
                        res.end(
                            JSON.stringify({
                                message: 'Success',
                                conversationId: conversation._id,
                            })
                        );
                    }
                });
            }
        }
    );
});

module.exports = router;
