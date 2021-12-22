const { DataTypes } = require("sequelize");

module.exports = {
	up: async ({ context: queryInterface }) => {
		await queryInterface.addColumn("blogs", "year", {
			type: DataTypes.INTEGER,
			hasYear(value) {
				if (
					parseInt(value) < 1991 ||
					parseInt(value) > new Date().getFullYear
				) {
					throw new Error(
						"Only blogs posted between 1991 and today are allowed."
					);
				}
			},
		});
	},
	down: async ({ context: queryInterface }) => {
		await queryInterface.removeColumn("blogs", "year");
	},
};
