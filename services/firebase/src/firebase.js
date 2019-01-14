import configLoader from 'alfred/services/configLoader';
import { ServerError } from 'alfred/core/errors';
import firebase from 'node-gcm';

const config = {};
const initialize = async () => {
  await configLoader.init();
  const firebaseConfig = configLoader.get('firebase');
  config.serverKey = firebaseConfig.SERVER_KEY;
};

initialize();
/**
 * Sends push notification to the user for the registration IDs passed.
 * @param  {Object} data = {} -This parameter specifies the custom key-value pairs of the message's payload. 
 * @param  {Object} notification={} -This parameter specifies the predefined, user-visible key-value pairs of the notification payload.
 * @param  {Array} registrationTokens=[] -A list of registration tokens Must contain at least 1 and at most 1000 registration tokens.
 */
const notify = async (
  data = {},
  notification = {},
  registrationTokens = []
) => {
  // Prepare a message to be sent.
  const sender = new firebase.Sender(config.serverKey);
  const message = new firebase.Message({
    data,
    notification,
    priority: 'high'
  });
  return new Promise((resolve, reject) => {
    sender.send(
      message,
      {
        registrationTokens
      },
      10, // Retrying a specific number of times (10)
      (err, response) => {
        if (err) {
          reject(new ServerError(err));
        } else {
          resolve(response);
        }
      }
    );
  });
};

export { notify };
