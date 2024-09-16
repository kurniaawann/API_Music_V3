const routes = (handler) => [
  {
    method: "POST",
    path: "/album",
    handler: handler.postAlbumHandler,
  },
  {
    method: "GET",
    path: "/album/{id}",
    handler: handler.getAlbumByIdHandler,
  },
  {
    method: "PUT",
    path: "/album/{id}",
    handler: handler.putAlbumByIdHandler,
  },
];

module.exports = routes;
