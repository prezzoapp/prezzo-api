// @flow

import fs from 'fs';
import path from 'path'
import log from 'alfred/services/logger';
import util from 'alfred/services/util';
import configLoader from 'alfred/services/configLoader';
import mongoose from 'mongoose';

let config;
let connection;
let models = {};

const initialize = async () => {
  await configLoader.init();
  config = configLoader.get('mongo');
  connection = mongoose.connect(config.MONGO_URL || config.MONGODB_URI);
};

initialize();

export function connect() {
  return mongoose;
}

export function registerModel(pathToModel, name) {
  if (models[name]) {
    return models[name];
  }

  const pathToVirtuals = `${pathToModel}/virtuals`;
  const pathToMethods = `${pathToModel}/methods`;
  const pathToStatics = `${pathToModel}/statics`;
  const pathToPre = `${pathToModel}/pre`;
  const split = pathToModel.split(path.sep);
  const modelName = split[split.length - 1];
  const schema = require(`${pathToModel}/src/${modelName}`);

  if (fs.existsSync(pathToPre)) {
    util.loadDirectoryModulesSync(pathToPre).forEach(method => {
      schema.pre(method.name, method.run);
    });
  }

  if (fs.existsSync(pathToVirtuals)) {
    util.loadDirectoryModulesSync(pathToVirtuals).forEach(method => {
      schema.virtual(method.name).get(method.run);
    });
  }

  if (fs.existsSync(pathToStatics)) {
    util.loadDirectoryModulesSync(pathToStatics).forEach(method => {
      schema.statics[method.name] = method.run;
    });
  }

  if (fs.existsSync(pathToMethods)) {
    util.loadDirectoryModulesSync(pathToMethods).forEach(method => {
      schema.methods[method.name] = method.run;
    });
  }

  models[name] = mongoose.model(name, schema);
  return models[name];
}
