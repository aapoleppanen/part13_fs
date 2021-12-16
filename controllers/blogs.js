const router = require("express").Router();

const { Blog, User } = require("../models/");
const { Op } = require("sequelize");

const { blogFinder, userExtractor } = require("../util/middleware");
const { sequelize } = require("../util/db");

router.get("/", async (req, res) => {
	let where = {};
	if (req.query.search) {
		where = {
			[Op.or]: [
				{ title: { [Op.iLike]: `%${req.query.search}%` } },
				{ author: { [Op.iLike]: `%${req.query.search}%` } },
			],
		};
	}
	console.log(req.query);

	const blogs = await Blog.findAll({
		attributes: { exclude: ["userId"] },
		include: {
			model: User,
			attributes: ["name"],
		},
		order: [["likes", "DESC"]],
		where,
	});
	res.json(blogs);
});

router.post("/", userExtractor, async (req, res, next) => {
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
			userId: req.user.id,
			date: new Date(),
		}).catch((e) => res.status(400).json(e));
		res.json(blog);
	} catch (e) {
		next(e);
	}
});

router.get("/:id", blogFinder, async (req, res) => {
	if (req.blog) res.json(req.blog);
	else res.status(404).end();
});

router.delete("/:id", userExtractor, blogFinder, async (req, res, next) => {
	try {
		if (req.blog.userId !== req.user.id)
			throw new Error("Cannot delete other users blogs");
		else if (req.blog) await req.blog.destroy();
		else res.status(404).end();
		res.status(200).end();
	} catch (e) {
		next(e);
	}
});

router.put("/:id", blogFinder, async (req, res, ne2xt) => {
	if (req.blog) {
		req.blog.likes += 1;
		await req.blog.save();
		res.json(req.blog.likes);
	} else res.status(404).end();
});

module.exports = router;
