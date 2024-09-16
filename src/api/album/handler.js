const autoBind = require("auto-bind");

class AlbumHandler {
  constructor(service, validator) {
    this._service = service;
    this._albumValidator = validator.albumValidator;
    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this._albumValidator.validateAlbumPayload(request.payload);
    const { name, year } = request.payload;

    const albumId = await this._service.addAlbum({ name, year });

    const response = h.response({
      status: "success",
      message: "Album berhasil ditambahkan",
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request) {
    const { id } = request.params;
    const album = await this._service.getAlbumById(id);
    return {
      status: "success",
      data: {
        album,
      },
    };
  }

  async putAlbumByIdHandler(request) {
    this._albumValidator.validateAlbumPayload(request.payload);
    const { id } = request.params;
    await this._service.editAlbumById(id, request.payload);
    return {
      status: "success",
      message: "Catatan berhasil diperbarui",
    };
  }

  async deleteAlbumByIdhandler(request) {
    const { id } = request.params;
    await this._service.deleteAlbumById(id);
    return {
      status: "success",
      message: "Catatan berhasil dihapus",
    };
  }
}

module.exports = {
  AlbumHandler,
};