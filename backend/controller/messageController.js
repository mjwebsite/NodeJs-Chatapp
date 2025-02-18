
const asyncHandler = require('express-async-handler');
const { create, findError, update, findAllOnly, findOneByID } = require('./controller');
const { User, Chat, profile } = require('../models');

const allMessages = asyncHandler(async (req, res) => {
    const messages = await findAllOnly("Message", {
        "where": { "chatId": req.params.chatId },
        attributes: ["id","content","createdAt","senderId"]
    })
    return res.json(messages);
});

const sendMessage = asyncHandler(async (req, res, next) => {
    const { content, chatId } = req.body;
    if (!content || !chatId) {
        let err = await findError("DetailsMandatory");
        return next(err);
    }
    // let chatData= await findOneByID("Chat",chatId);
    // if(chatData){
    //     let { parparticipants} =chatData.dataValues;

    // }
    let msg = await create("Message", {
        "senderId": `${req.userId}`,
        "content": `${content}`,
        "chatId": `${chatId}`
    });

    let message = msg && msg.dataValues && msg.dataValues.content ? msg.dataValues.content : null;
    let chat;
    if (message) {
        chat = await update("Chat", { latestMessage: msg.dataValues.content }, { "where": { "id": req.body.chatId } });
        chat = await findOneByID("Chat", chatId);
        if (chat) {
            let participants  = chat.dataValues.participants.filter(d => d!= req.userId);
            //participants= participants.filter(d => d!= req.userId);
            msg.setReadByUsers(participants)
        }
    }
    return res.send({ msg, chat });

});

module.exports = {
    sendMessage: sendMessage,
    allMessages: allMessages
}