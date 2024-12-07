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
module.exports = AlbumLikeHandler