exports.up = (pgm) => {
    pgm.addColumn('playlist_songs', {
      user_id: {
        type: 'VARCHAR(50)',
        notNull: true,
        references: '"users"',
        onDelete: 'CASCADE',
      },
    });
  };
  
  exports.down = (pgm) => {
    pgm.dropColumn('playlist_songs', 'user_id');
  };