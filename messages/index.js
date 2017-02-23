// For more information about this template visit http://aka.ms/azurebots-node-qnamaker

"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
var builder_cognitiveservices = require("botbuilder-cognitiveservices");

var useEmulator = (process.env.NODE_ENV == 'development');

var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});

var bot = new builder.UniversalBot(connector);

var recognizer = new builder_cognitiveservices.QnAMakerRecognizer({
                knowledgeBaseId: '9af7f3bc-a476-40a1-935a-fcc506dacd7d', 
    subscriptionKey: '54cbe02c72c44474992584fbe58496ea'});

var basicQnAMakerDialog = new builder_cognitiveservices.QnAMakerDialog({
    recognizers: [recognizer],
                defaultMessage: 'Sorry ¯\\_(ツ)_/¯, I didn\'t get that. Could you kindly rephrase your inquiry?',
                qnaThreshold: 0.3}
);




bot.dialog('/', basicQnAMakerDialog);

if (useEmulator) {
    var restify = require('restify');
    var server = restify.createServer();
    server.listen(3978, function() {
        console.log('test bot endpont at http://localhost:3978/api/messages');
    });
    server.post('/api/messages', connector.listen());    
} else {
    module.exports = { default: connector.listen() }
}
