const router = require("express").Router();
const { Blog, User } = require("../models/");
const { Op } = require("sequelize");
// const { blogFinder, userExtractor } = require("../util/middleware");
const { sequelize } = require("../util/db");

router.get("/", async (req, res) => {
	const authors = await Blog.findAll({
		attributes: [
			"author",
			[sequelize.fn("COUNT", sequelize.col("author")), "blogs"],
			[sequelize.fn("COUNT", sequelize.col("likes")), "likes"],
		],
		group: ["author"],
		order: [[sequelize.col("likes"), "DESC"]],
	});
	res.json(authors);
});

module.exports = router;
