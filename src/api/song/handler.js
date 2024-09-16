const autoBind = require("auto-bind");

class SongHandler {
  constructor(service, validator) {
    this._service = service;
    this.validator = validator.songValidator;
    autoBind(this);
  }
}

module.exports = SongHandler;
