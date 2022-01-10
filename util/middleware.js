const { request } = require("express");
const { Blog, User, ReadingList, Session } = require("../models");

const jwt = require("jsonwebtoken");

const { SECRET } = require("../util/config");

const { Op } = require("sequelize");

const blogFinder = async (req, res, next) => {
	req.blog = await Blog.findByPk(req.params.id);
	try {
		if (req.blog === null)
			throw new Error(`No blog with id ${req.params.id} found`);
	} catch (e) {
		next(e);
	}
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

const getTokenFrom = (req) => {
	const authorization = req.get("authorization");
	if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
		return authorization.substring(7);
	}
	return null;
};

const tokenExtractor = async (req, res, next) => {
	const token = getTokenFrom(req);
	req.token = token;

	const sessions = await Session.findAll({
		where: {
			[Op.and]: [
				{
					userId: jwt.verify(req.token, SECRET).id,
				},
				{
					token,
				},
			],
		},
	});
	if (!sessions.length) {
		return res.status(401).json({ error: "expired token" });
	}

	next();
};

const userExtractor = async (req, res, next) => {
	try {
		const token = getTokenFrom(req);
		const decodedToken = jwt.verify(token, SECRET);
		if (!token || !decodedToken.id) {
			return res.status(401).json({ error: "Invalid token or missing" });
		}
		const user = await User.findByPk(decodedToken.id);
		req.user = user;
	} catch (e) {
		next(e);
	}
	next();
};

const readingListExtractor = async (req, res, next) => {
	req.readingList = await ReadingList.findByPk(req.params.id);
	try {
		if (req.readingList === null)
			throw new Error(`No readinglist with id ${req.params.id} found`);
	} catch (e) {
		next(e);
	}
	next();
};

module.exports = {
	blogFinder,
	unknownEndpoint,
	errorHandler,
	tokenExtractor,
	userExtractor,
	readingListExtractor,
};
