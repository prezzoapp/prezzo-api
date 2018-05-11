// @flow
const User = require('alfred/services/mongo').registerModel(__dirname, 'User');

export default User;

export const listUsers = (query: any = {}) => User.find(query);
