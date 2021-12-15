const jwt = require("jsonwebtoken");
const router = require("express").Router();

const { SECRET } = require("../util/config");
const User = require("../models/user");

router.post("/", async (req, res) => {
	const body = req.body;
	const user = await User.findOne({
		where: {
			username: body.username,
		},
	});

	//using a set password as a proof of concept
	if (!user || body.password !== "salasana") {
		return res.status(401).json({ error: "Invalid usr or pass" });
	}

	const userForToken = {
		username: user.username,
		id: user.id,
	};

	const token = jwt.sign(userForToken, SECRET);

	res.status(200).send({
		token,
		username: user.username,
		name: user.name,
	});
});

module.exports = router;