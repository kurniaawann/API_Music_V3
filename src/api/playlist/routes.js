const routes = (handler)=>[
    {
        method:'POST',
        handler:handler.postPlaylistHandler,
        path:'/playlist',
        options:{
            auth:'playlist_jwt'
        }
    },
    {
        method:'GET',
        handler:handler.getPlaylistHandler,
        path:'/playlist',
        options:{
            auth:'playlist_jwt'
        }
    },
    {
        method:'DELETE',
        handler:handler.deletePlaylistHandler,
        path:'/playlist/{id}',
        options:{
            auth:'playlist_jwt'
        }
    }
]

module.exports = routes