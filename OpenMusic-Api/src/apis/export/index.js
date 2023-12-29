const ExportsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'exports',
  version: '1.0.0',
  register: async (server, { RabitService, playlistService, validator }) => {
    const exportsHandler = new ExportsHandler(RabitService, playlistService, validator);
    server.route(routes(exportsHandler));
  },
};
