const router = require("express").Router();

const { Blog, User, ReadingList } = require("../models/");
// const { Op } = require("sequelize");

const { userExtractor, readingListExtractor } = require("../util/middleware");
// const { sequelize } = require("../util/db");

router.post("/", userExtractor, async (req, res, next) => {
	try {
		const body = req.body;
		console.log(body);
		if (body.blog_id === undefined || body.user_id === undefined) {
			throw "Please define include both the blog and the user id";
		}
		const readingList = await ReadingList.create({
			user_id: body.user_id,
			blog_id: body.blog_id,
			read: false,
		}).catch((e) => res.status(400).json(e));
		res.json(readingList);
	} catch (e) {
		next(e);
	}
});

router.put(
	"/:id",
	userExtractor,
	readingListExtractor,
	async (req, res, next) => {
		try {
			console.log(req.readingList, req.user);
			if (req.readingList.userId === req.user.id) {
				if (req.body.read) {
					req.readingList.read = req.body.read;
					await req.readingList.save();
					res.json(req.readingList);
				}
			}
		} catch (e) {
			next(e);
		}
	}
);

module.exports = router;
