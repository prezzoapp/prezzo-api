// @flow
import {
  ResourceNotFoundError,
  ResourceNotModifiedError,
  ServerError
} from 'alfred/core/errors';
import { find } from 'alfred/services/util';

module.exports = {
  name: 'endSession',
  async run(sessionId: string) {
    if (!sessionId) {
      throw new ServerError('A session id must be provided to removed.');
    }

    const update = {
      $pull: {
        sessions: {
          $or: [
            {
              _id: sessionId
            }
          ]
        }
      }
    };

    // find session in user's sessions with matching id
    const session = find(
      this.sessions,
      s => s && s._id && s._id.toString() === sessionId
    );

    // if no session exists with id, exit
    if (!session) {
      throw new ResourceNotModifiedError('No session exists with that id.');
    }

    // if push token exists in session, remove all sessions with same push token
    // meaning clear all sessions belonging to that device
    if (session.pushToken) {
      update.$pull.sessions.$or.push({
        pushToken: session.pushToken
      });
    }

    const user = await this.model('User').findByIdAndUpdate(this._id, update, {
      new: true
    });

    if (!user) {
      throw new ResourceNotFoundError('Unable to find user.');
    }

    return user;
  }
};
