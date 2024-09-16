const autoBind = require("auto-bind");

class SongHandler {
  constructor(service, validator) {
    this._service = service;
    this.validator = validator;
    autoBind(this);
  }
}

module.exports = SongHandler;
