const routes = (handler) =>[
    {
        method:'POST',
        handler: handler.postAuthenticationHandler,
        path:'/authentication',
    }
]

module.exports = routes