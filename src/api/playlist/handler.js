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
        const playlist = await this._service.getPlaylist({owner:credentialId});

        return {
            status:'sucess',
            data:{
                playlist
            }
        }
    }

    async deletePlaylistHandler(request, h){
        const {id: credentialId} = request.auth.credentials;
        const {id} = request.params;

        console.log(id);
        console.log(credentialId);

        await this._service.deletePlaylistByid(id, {owner:credentialId});

        return {
            status:'success',
            message:'playlist berhasil dihapus'
        }

    }

    async postPlaylistAndSong(request,h){
        this._validator.validatePlaylistAndSongPayload(request.payload);
        console.log(`result payload ${request.payload}`);
        const {songsId} = request.payload;
        const{id} = request.params;

        const {id: credentialId} = request. auth.credentials;
        await this._service.addPlaylistAndSongs(songsId, id, {owner:credentialId});
        const response = h.response({
            status:'success',
            message:'berhasil membuat playlist and song',
        });
        response.code(201);
        return response
    }
    
}

module.exports = PlaylistHandler