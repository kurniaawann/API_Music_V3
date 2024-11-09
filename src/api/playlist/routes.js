const routes = (handler)=>[
    {
        method:'POST',
        handler:handler.PostPlaylistHandler,
        path:'/playlist',
        options:{
            auth:'playlist_jwt'
        }
    }
]

module.exports = routes