const express = require("express");
const app = express();

const { PORT } = require("./util/config");
const { connectToDatabase } = require("./util/db");

const { unknownEndpoint, errorHandler } = require("./util/middleware");

const blogRouter = require("./controllers/blogs");

app.use(express.json());

app.use("/api/blogs", blogRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

const start = async () => {
	await connectToDatabase();
	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
	});
};

start();
