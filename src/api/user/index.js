const UserHandler = require("./handler");
const routes = require("../album/routes");


module.exports = {
    name: 'users',
    version:'1.0.0',
    register:async (server, {service, validator}) => {
        const usersHandler = new UserHandler(service, validator);
        server.route(routes(usersHandler))
    }
}