require("dotenv").config();
const { Sequelize, QueryTypes, DataTypes, Model } = require("sequelize");
const express = require("express");
const app = express();

app.use(express.json());

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
Blog.sync();

// const testFunction = async () => {
// 	try {
// 		// const blogs = await Blog.findAll();
// 		await sequelize.authenticate();
// 		const blogs = await sequelize.query("SELECT * FROM blogs", {
// 			type: QueryTypes.SELECT,
// 		});
// 		sequelize.close();
// 		blogs.forEach((b) => {
// 			console.log(
// 				b.author + ":",
// 				" '" + b.title + "'",
// 				", " + b.likes + " likes"
// 			);
// 		});
// 	} catch (e) {
// 		console.log(e);
// 	}
// };

// testFunction();

app.get("/api/blogs", async (req, res) => {
	const blogs = await Blog.findAll();
	res.json(blogs);
});

app.post("/api/blogs", async (req, res, next) => {
	try {
		const body = req.body;
		if (body.title === undefined || body.url === undefined) {
			throw "Please define both title and url";
		}
		const blog = await Blog.create({
			author: body.author || undefined,
			title: body.title,
			likes: body.likes || undefined,
			url: body.url,
		}).catch((e) => res.status(400).json(e));
		res.json(blog);
	} catch (e) {
		next(e);
	}
});

app.delete("/api/blogs/:id", async (req, res, next) => {
	try {
		const id = req.params.id;
		const blog = await Blog.findByPk(id);
		if (blog) await blog.destroy();
		else res.status(404);
		res.status(200);
	} catch (e) {
		next("Error when deleting");
	}
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
