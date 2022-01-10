const router = require("express").Router();
const { Session } = require("../models");
const { userExtractor } = require("../util/middleware");

router.delete("/", userExtractor, async (req, res, next) => {
	try {
		if (req.body.token) {
			await Session.destroy({
				where: {
					token: req.body.token,
				},
			});
			res.status(204).end();
		} else {
			res.status(401).json({
				error: "no session found",
			});
		}
	} catch (e) {
		next(e);
	}
});

module.exports = router;
