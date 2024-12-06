class ExportsHandler {
    constructor(service, validator, playlistService) {
      this._service = service;
      this._validator = validator;
      this._playlistService = playlistService
      this.postExportNotesHandler = this.postExportNotesHandler.bind(this);
    }
   
    async postExportNotesHandler(request, h) { 
      this._validator.validateExportPlaylistPayload(request.payload);
      
      const message = {
        userId: request.auth.credentials.id,
        targetEmail: request.payload.targetEmail,
        playlistId:request.params
      };
      
      await this._playlistService.verifiyPlaylistOwner(message.playlistId.playlistId, message.userId)

      await this._service.sendMessage('export:playlist', JSON.stringify(message));
   
      const response = h.response({
        status: 'success',
        message: 'Permintaan Anda dalam antrean',
      });
      response.code(201);
      return response;
    }
  }
   
  module.exports = ExportsHandler;