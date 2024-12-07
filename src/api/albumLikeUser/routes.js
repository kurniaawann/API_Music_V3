const routes = (handler)=>[
    {
        method:'POST',
        handler:handler.postAlbumLikeUserHandler,
        path:'/albums/{id}/likes',
        options:{
            auth:'playlist_jwt'
        }
    },
    {
        method:'DELETE',
        handler:handler.deleteAlbumLikeUserHandler,
        path:'/albums/{id}/likes',
        options:{
            auth:'playlist_jwt'
        }
    },
    {
        method:'GET',
        handler:handler.getAlbumLikeUserHandler,
        path:'/albums/{id}/likes',
        options:{
            auth:'playlist_jwt'
        }
    },
]

module.exports = routes