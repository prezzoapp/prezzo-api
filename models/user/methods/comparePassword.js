// @flow
import bcrypt from 'bcrypt';
import { BadRequestError } from 'alfred/core/errors';

module.exports = {
  name: 'comparePassword',
  async run(testPassword) {
    const isMatch = await bcrypt.compare(testPassword, this.password);

    if (!isMatch) {
      throw BadRequestError('Invalid password.');
    }

    return true;
  }
};
