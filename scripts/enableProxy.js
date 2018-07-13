import url from 'url';
import http from 'http';
import https from 'http';

const __request = http.request;
const proxy = {
  host: '',
  port: 0
};
let _debug = false;

const overrideRequest = (_module, protocol) => {
  _module.request = (options, callback) => {
    const __options = options;
    const host = options.port ? `${options.host}:${options.port}` : options.host;
    __options.path = `${protocol}://${host}${options.path}`;
    __options.host = proxy.host;
    __options.port = proxy.port;

    if (_debug) {
      console.log('=== http-proxy.js begin debug ===');
      console.log(JSON.stringify(__options, null, 2));
      console.log('=== http-proxy.js end debug ===');
    }

    const req = __request(__options, res => {
      callback && callback(res);
    });

    return req;
  };
};

export default (proxyURL, debug) => {
  // module.exports = (host, port, debug) => {
  const parsedURL = url.parse(proxyURL);
  proxy.host = parsedURL.host;
  proxy.port = parsedURL.port;
  _debug = debug || false;

  overrideRequest(http, 'http');
  // overrideRequest(https, 'https');
};
