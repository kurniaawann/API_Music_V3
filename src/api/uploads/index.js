const UploadsHandler = require('./handler');
const routes = require('./routes');
 
module.exports = {
  name: 'uploads',
  version: '1.0.0',
  register: async (server, { service, validator, servicePostgre }) => {
    const uploadsHandler = new UploadsHandler(service, validator, servicePostgre);
    server.route(routes(uploadsHandler));
  },
};