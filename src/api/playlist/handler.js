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
        const playlists = await this._service.getPlaylist({owner:credentialId});

        return {
            status:'success',
            data:{
                playlists
            }
        }
    }

    async deletePlaylistHandler(request, h){
        const {id: credentialId} = request.auth.credentials;
        const {id} = request.params;
        await this._service.verifiyPlaylistOwner(id ,credentialId)
        await this._service.deletePlaylistByid(id);

        return {
            status:'success',
            message:'playlist berhasil dihapus'
        }

    }

    async postPlaylistAndSongHandler(request,h){
        this._validator.validatePlaylistAndSongPayload(request.payload);
        const {songId} = request.payload;
        const{id} = request.params;

        const {id: credentialId} = request. auth.credentials;
        await this._service.verifiyPlaylistOwner(id, credentialId)
        await this._service.addPlaylistAndSongs(songId, id, {owner:credentialId});
        const response = h.response({
            status:'success',
            message:'berhasil membuat playlist and song',
        });
        response.code(201);
        return response
    }
    
    async getPlaylistAndSongHandler(request){
        const {id: credentialId} = request.auth.credentials;
        const{id} = request.params;
        await this._service.verifiyPlaylistOwner(id, credentialId)
        const playlist = await this._service.getPlaylistAndSong(id)

        return {
            status:'success',
            data:{
                playlist
            }
        }
    }

    async deletePlaylistAndSongHandler (request){
        this._validator.validatePlaylistAndSongPayload(request.payload);
        const {id: credentialId} = request.auth.credentials;
        const {id} = request.params;
        const {songId} = request.payload
        await this._service.verifiyPlaylistOwner(id,credentialId);
        await this._service.deleteSongFromPlaylist(songId);
        return {
            status:'success',
            message:'Berhasil menghapus lagu dari daftar playlist'
        }
       
    }
}

module.exports = PlaylistHandler