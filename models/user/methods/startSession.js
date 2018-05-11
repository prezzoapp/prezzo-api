// @flow
import { BadRequestError, ResourceNotFoundError } from 'alfred/core/errors';

module.exports = {
  name: 'startSession',
  async run(type: string, pushToken: string) {
    const params = {
      type
    };

    if (pushToken) {
      params.pushToken = pushToken;
    }

    if (!type) {
      throw new BadRequestError('Invalid login type.');
    }

    const user = await this.model('User').findByIdAndUpdate(
      this._id,
      {
        $push: {
          sessions: {
            $each: [params],
            $sort: { lastActiveDate: -1 },
            $slice: 3
          }
        }
      },
      {
        new: true
      }
    );

    if (!user) {
      throw new ResourceNotFoundError('Unable to find user.');
    }

    return user;
  }
};
