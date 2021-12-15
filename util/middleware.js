const { Blog } = require("../models");

const blogFinder = async (req, res, next) => {
	req.blog = await Blog.findByPk(req.params.id);
	next();
};

const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: "Api endpoint not found" });
};

const errorHandler = (err, req, res, next) => {
	if (err.name === "CastError")
		return res.status(400).send({ error: "Malformatted request" });
	next(err);
};

module.exports = {
	blogFinder,
	unknownEndpoint,
	errorHandler,
};
