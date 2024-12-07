const routes = (handler)=>[
    {
        method:'POST',
        handler:handler.postAlbumLikeUserHandler,
        path:'/albums/{id}/likes',
        options:{
            auth:'playlist_jwt'
        }
    },
module.exports = routes