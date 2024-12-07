class UploadsHandler {
    constructor(service, validator, albumService) {
      this._service = service;
      this._validator = validator;
      this._albumService = albumService;

      this.postUploadImageHandler = this.postUploadImageHandler.bind(this);
    }

    async postUploadImageHandler(request, h) {
        const { data } = request.payload;
        this._validator.validateImageHeaders(data.hapi.headers);
        const { id } = request.params;

        const filename = await this._service.writeFile(data, data.hapi);
        const urlImage = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`
        await this._albumService.addAlbumCover(urlImage, id)
        
        const response = h.response({
          status: 'success',
          message: 'Sampul berhasil diunggah'
        });
        
        response.code(201);
        return response;
      }
}

  module.exports = UploadsHandler;