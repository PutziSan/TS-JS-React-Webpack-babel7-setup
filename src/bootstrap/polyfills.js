import objectAssign from 'object-assign';
import Promise from 'promise/lib/es6-extensions';

if (!global.Promise) {
  global.Promise = Promise;
}

if (!Object.assign) {
  Object.assign = objectAssign;
}
