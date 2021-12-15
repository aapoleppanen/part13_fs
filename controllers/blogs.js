const router = require("express").Router();

const { Blog } = require("../models");

const { blogFinder } = require("../util/middleware");

router.get("/", async (req, res) => {
	const blogs = await Blog.findAll();
	res.json(blogs);
});

router.post("/", async (req, res, next) => {
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

router.get("/:id", blogFinder, async (req, res) => {
	if (req.blog) res.json(req.blog);
	else res.status(404).end();
});

router.delete("/:id", blogFinder, async (req, res, next) => {
	try {
		if (req.blog) await req.blog.destroy();
		else res.status(404).end();
		res.status(200).end();
	} catch (e) {
		next("Error when deleting");
	}
});

router.put("/:id", blogFinder, async (req, res, next) => {
	if (req.blog) {
		req.blog.likes += 1;
		await req.blog.save();
		res.json(req.blog.likes);
	} else res.status(404).end();
});

module.exports = router;
