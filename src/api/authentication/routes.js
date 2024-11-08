const routes = (handler) =>[
    {
        method:'POST',
        handler: handler.postAuthenticationHandler,
        path:'/authentication',
    },
    {
        method:'PUT',
        handler: handler.putAuthenticationHandler,
        path:'/authentication',
    }
]

module.exports = routes