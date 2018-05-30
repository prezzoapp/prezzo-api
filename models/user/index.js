// @flow
const User = require('../../services/mongo').registerModel(__dirname, 'User');

export default User;

export const createUser = async (params: any = {}) => new User(params).save();

export const listUsers = (query: any = {}) => User.find(query);
