
exports.up = (pgm) => {
  // Add the cover_url column to the album table
  pgm.addColumn('album', {
    cover_url: { type: 'text', notNull: false },
  });
};

exports.down = (pgm) => {
  // Remove the cover_url column from the album table
  pgm.dropColumn('album', 'cover_url');
};
