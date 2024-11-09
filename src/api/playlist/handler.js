const autoBind = require("auto-bind");

class PlaylistHandler{
    constructor(service, validator){
        this._service = service;
        this._validator = validator;
        autoBind(this);
    }

    async postPlaylistHandler(request, h){
        this._validator.validatePlaylistPayload(request.payload);
        const {name} = request.payload
        const {id: credentialId} = request.auth.credentials;

        const playlistId  = await this._service.addPlaylist({name, owner:credentialId});

        const response = h.response({
            status: "success",
            message: "Playlist berhasil ditambahkan",
            data:{
                playlistId
            },
        }); 
        response.code(201);
        return response;
    }


    async getPlaylistHandler(request, h){
        const {id: credentialId} = request.auth.credentials;
        const playlist = await this._service.getPlaylist({owner:credentialId})

        return {
            status:'sucess',
            data:{
                playlist
            }
        }
    }
}

module.exports = PlaylistHandler