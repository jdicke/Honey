// This file was designed to show the process of separating handlers into separate files for more organized code.
const request = require('request');

var breatheTime = '<break time="500ms"/>'
var countTime = '<break time="1000ms"/>'

const counting = 'Let\'s count to 10. <break time="2000ms"/> 1 '
   + countTime + ' 2 ' + countTime + ' 3'
   + countTime + ' 4 ' + countTime + ' 5'
   + countTime + ' 6 ' + countTime + ' 7'
   + countTime + ' 8 ' + countTime + ' 9'
   + countTime + ' 10';

const breathInOut = breatheTime + '2' 
    + breathTime + '3'
    + breatheTime + '4' + breatheTime + 'Breathe out'
    + breatheTime + '2'
    + breatheTime + '3'
    + breatheTime + '4'
    + breatheTime + '5'
    + breatheTime + '6'
    + breatheTime + '7';

const routine = 'Let\'s start your routine. ' + counting + '<break time="1000ms"/>' + 'Breathe in <break time="700ms"/>'
      + breathInOut + '<break time="1000ms"/>' + 'Breathe in through your nose' + '<break time="700ms"/>'
      + breathInOut + '<break time="3000ms"/>';


function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

const YesINeedIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'YesINeed';
    },
    // IMPORTANT: If you want to use async/await like shown below, you must add 'async' before the handler like shown below
    async handle(handlerInput) {
        // This sends a message to my phone of the alert that the user needs urgent help!
        var accountSid = 'ACaf4106957eb9e4618e44f58aa98e3062'; // Your Account SID from www.twilio.com/console
        var authToken = '69681d56531af1b4841361caaa92d30c';   // Your Auth Token from www.twilio.com/console
        
        // require the Twilio module and create a REST client
        var twilio = require('twilio');
        var client = new twilio(accountSid, authToken);

        client.messages.create({
            body: 'Bobby needs assistance. Please call him or get him help as soon as possible.',
            to: '+17193136656',  // Text this number
            from: '+14092150219' // From a valid Twilio number
        })
        .then((message) => console.log(message.sid));
        
        // This line demonstrates how to add an audio file to the response. You can use audio files you have hosted online,
        // or you can use a sound from Amazon's library here: https://developer.amazon.com/docs/custom-skills/ask-soundlibrary.html
        wave =  "<audio src='soundbank://soundlibrary/nature/amzn_sfx_ocean_wave_1x_02'/>" 
            + '<break time="1000ms"/>';

        voice = "<audio src='https://s3.amazonaws.com/disabilityasu/hackathonvoice.mp3'/>";

        // Notice the use of <break time="300ms"/> to create short pauses in the response to make it sound more natural
        var POSITIVE = [
            'You are safe.',
            'Everything will be okay',
            'Focus on the good.',
            'You are feeling anxious now, but you will be calm soon.',
            'Focus on right now',
            'Focus on your breathing',
            'You will get through this',
            'This feeling will pass',
            'Try to smile. Things will work out!',
            'What are things you are grateful for?',
            'What CAN you do?'
        ];

        var i = getRandomInt(POSITIVE.length-1);
        var positiveSelfTalk = POSITIVE[i];

        const speechText = 'Alerted care giver. ' + routine + 'Close your eyes and picture yourself on a beach.' + '<break time="2500ms"/>' +
            wave + wave + wave + wave + '<break time="1500ms"/>' + positiveSelfTalk + '<break time="1500ms"/>' + voice + '<break time="1500ms"/>' + 'How do you feel now?';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withShouldEndSession(false)
            .getResponse();
    },
};

// This line is very important. Without it, your skill won't be able to access this handler
module.exports = YesINeedIntentHandler;