const routes = (handler) =>[
    {
        method:'POST',
        handler: handler.postAuthenticationHandler,
        path:'/authentications',
    },
    {
        method:'PUT',
        handler: handler.putAuthenticationHandler,
        path:'/authentications',
    },
    {
        method:'DELETE',
        handler: handler.deleteAuthenticationHandler,
        path:'/authentications',
    }
]

module.exports = routes