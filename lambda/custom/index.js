'use strict';
const Alexa = require('ask-sdk-core');

const counting = 'Let\'s count to 10. <break time="2000ms"/> 1 '
   + '<break time="1000ms"/> 2 <break time="1000ms"/> 3'
   + '<break time="1000ms"/> 4 <break time="1000ms"/> 5 '
   + '<break time="1000ms"/> 6 <break time="1000ms"/> 7 '
   + '<break time="1000ms"/> 8 <break time="1000ms"/> 9 <break time="1000ms"/> 10';

const breathInOut = 'Breathe in <break time="1000ms"/> Breathe out';

// This handler gets called when the user invokes your skill without providing a specific intent
const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {

    // In the string below, <break time="300ms"/> is used to create a break (pause) in Alexa's output for the specified time
    // In this example, it's 300 milliseconds
    const speechText = 'If you are in need of help say <break time="200ms"/> help me or ask <break time="200ms"/> where is my caregiver?';
    const repromptText = 'If you want to change your routine say <break time="200ms"/> settings or say <break time="200ms"/> change routine.';

    // The line .withSimpleCard below sends a card to the user's companion Alexa app on their mobile phone
    // It takes two arguments: the first is the title, and the second is the body text
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(repromptText)
      .withSimpleCard('Welcome to the Help Me Skill.', "If you are in need of help say Alexa help me or ask where is my caregiver?")
      .getResponse();
  },
};

//This intent is triggered when the user asks where the caregiver is, or needs help
const HelpMeIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'APICallIntent';
  },
  handle(handlerInput) {

    const speechText = 'Do you need your caregiver?';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

const YesINeedIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'YesINeed';
  },
  handle(handlerInput) {

    const speechText = 'Let\'s start your routine. ' + counting + '<break time="1000ms"/>' 
      + breathInOut + '<break time="2000ms"/>'
      + breathInOut + '<break time="3000ms"/>' + breathInOut + '<break time="4000ms"/>';

      return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

//Change routine
const SettingsHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'Settings';
  },
  handle(handlerInput) {

    const speechText = 'To select a routine say one of the following routines.' + '<break time="500ms"/>'
    'Beathing routine, Sounds routine, Counting routine, Everything routine.';

      return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

//Responds with no
const NoNeedHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'NoNeed';
  },
  handle(handlerInput) {

    const speechText = 'Let\'s start your routine. ' + '<break time="2000ms"/>'+ counting + '<break time="4000ms"/>' + breathInOut + '<break time="2000ms"/>'
      + breathInOut + '<break time="3000ms"/>' + breathInOut + '<break time="4000ms"/>' + breathInOut;

      return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

// This built-in intent is triggered everytime a user says "help" or something similar
const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'This response is meant to help your users navigate through the skill. It is helpful to list the different features of the skill here.';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

// This built-in intent is triggered everytime a user says "stop", "cancel", or something similar
const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Glad you are okay!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  },
};

// This is called when the current skill session ends for any reason other than your code closing the session
const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

// This is the error/fallback handler that Alexa defaults to when she can't map an utterance to an intent
const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say that again.')
      .reprompt('Sorry, I can\'t understand the command. Please say that again.')
      .getResponse();
  },
};

// Don't worry too much about the logic of this function as it can be a little confusing...
// Just know that it is a utility function that returns an object with the canonical slot values
// See usage on line 40
function getCanonicalSlots(filledSlots) {
  const slotValues = {};
  console.log(`The filled slots: ${JSON.stringify(filledSlots)}`);
  Object.keys(filledSlots).forEach((item) => {
    const name = filledSlots[item].name;
    if (filledSlots[item] &&
      filledSlots[item].resolutions &&
      filledSlots[item].resolutions.resolutionsPerAuthority[0] &&
      filledSlots[item].resolutions.resolutionsPerAuthority[0].status &&
      filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code) {
      switch (filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code) {
        case 'ER_SUCCESS_MATCH':
          slotValues[name] = {
            synonym: filledSlots[item].value,
            resolved: filledSlots[item].resolutions.resolutionsPerAuthority[0].values[0].value.name,
            isValidated: true,
          };
          break;
        case 'ER_SUCCESS_NO_MATCH':
          slotValues[name] = {
            synonym: filledSlots[item].value,
            resolved: filledSlots[item].value,
            isValidated: false,
          };
          break;
        default:
          break;
      }
    } else {
      slotValues[name] = {
        synonym: filledSlots[item].value,
        resolved: filledSlots[item].value,
        isValidated: false,
      };
    }
  }, this);
  return slotValues;
}

const skillBuilder = Alexa.SkillBuilders.custom();

// Make note of the lines below that say require('./<FILENAME>'), this allows you to access handlers that are located in different files
exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    //EmotionsIntentHandler,
    require('./more-handlers/noHandler'),
    require('./more-handlers/musicHandler'),
    HelpIntentHandler,
    NoNeedHandler,
    HelpMeIntentHandler,
    CancelAndStopIntentHandler,
    SettingsHandler,
    YesINeedIntentHandler,
    SessionEndedRequestHandler
  )
  .addRequestInterceptors(
    require('./interceptors/logRequestInterceptor')
  )
  .addResponseInterceptors(
    require('./interceptors/logResponseInterceptor')
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();