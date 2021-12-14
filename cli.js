require("dotenv").config();
const { Sequelize, QueryTypes, DataTypes, Model } = require("sequelize");
// const express = require("express");
// const app = express();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
	dialectOptions: {
		ssl: {
			require: true,
			rejectUnauthorized: false,
		},
	},
});

class Blog extends Model {}
Blog.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		author: {
			type: DataTypes.TEXT,
		},
		url: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		title: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		likes: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
	},
	{
		sequelize,
		underscored: true,
		timestamps: false,
		modelName: "blog",
	}
);

const testFunction = async () => {
	try {
		// const blogs = await Blog.findAll();
		await sequelize.authenticate();
		const blogs = await sequelize.query("SELECT * FROM blogs", {
			type: QueryTypes.SELECT,
		});
		sequelize.close();
		blogs.forEach((b) => {
			console.log(
				b.author + ":",
				" '" + b.title + "'",
				", " + b.likes + " likes"
			);
		});
	} catch (e) {
		console.log(e);
	}
};

testFunction();

// app.get("/api/blogs", async (req, res) => {
//     const blogs = await Blog.findAll()
//     res.json(blogs)
// })

// const PORT = process.env.PORT || 3001
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`)
// })
