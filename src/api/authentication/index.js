
const AuthenticationHandler = require('./handler');
const routes = require('./routes');
module.exports = {
    name:'Authentiactions',
    version: '1.0.0',
    register:async(server,{
        authenticationService,
        usersService,
        tokenManager,
        validator
    })=> {
        const authenticationsHandler = new AuthenticationHandler (
        authenticationService,
        usersService,
        tokenManager,
        validator
        );
        server.route(routes(authenticationsHandler))
    }
}