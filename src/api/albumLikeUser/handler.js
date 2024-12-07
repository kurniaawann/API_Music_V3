const autoBind = require("auto-bind");

class AlbumLikeHandler{
    constructor(service){
        this._service = service;
        autoBind(this)
    }

    async postAlbumLikeUserHandler(request, h){
        const {id: credentialId} = request.auth.credentials;
        const {id} = request.params

        await this._service.addAlbumLikeUser(id, credentialId)
        const response = h.response({
            status: "success",
            message: "Berhasil menyukai album",
        }); 
        response.code(201);
        return response;
    }
    async deleteAlbumLikeUserHandler(request, h){
        const {id} = request.params

        await this._service.deleteAlbumLikeUser(id);
        const response = h.response({
            status: "success",
            message: "Berhasil menghapus album ini dari daftar suka",
        }); 
        response.code(200);
        return response;
    }
module.exports = AlbumLikeHandler