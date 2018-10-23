// @flow

module.exports = {
  description: 'Removes trailing slashes from the URL.',
  priority: 10,
  run(req, res, next) {
    if (req.url.substr(-1) === '/' && req.url.length > 1) {
      req.url = req.url.slice(0, -1);
    }

    next();
  }
};
