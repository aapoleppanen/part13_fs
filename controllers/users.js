const router = require("express").Router();

const { User, Blog } = require("../models/");

router.get("/", async (req, res) => {
	const users = await User.findAll({
		include: {
			model: Blog,
			attributes: { exclude: ["userId"] },
		},
	});
	res.json(users);
});

router.post("/", async (req, res, next) => {
	try {
		const user = await User.create(req.body);
		res.json(user);
	} catch (e) {
		console.log(e);
		next(e);
	}
});

router.get("/:id", async (req, res) => {
	let where = {};

	if (req.query.read) where.read = req.query.read === "true";

	const user = await User.findByPk(req.params.id, {
		include: {
			model: Blog,
			as: "readings",
			through: {
				attributes: ["id", "read"],
				as: "readingLists",
				where,
			},
			attributes: { exclude: ["userId"] },
		},
	});

	if (user) res.json(user);
	else res.status(404).end();
});

router.put("/:username", async (req, res) => {
	try {
		const user = await User.findOne({
			where: {
				username: body.username,
			},
		});
		if (user) {
			user.name = req.params.name;
			user.save();
			res.status(200).send({
				username: user.username,
				name: user.name,
			});
		}
	} catch (e) {
		next(e);
	}
});

module.exports = router;
