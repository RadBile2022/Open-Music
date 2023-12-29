exports.up = (pgm) => {
		pgm.addColumns('albums', {
				cover_url: {
						type: 'VARCHAR(200)',
				},
		});
};

exports.down = (pgm) => {
		pgm.dropColumns('albums', ['cover_url']);
};
