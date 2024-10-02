const express = require("express");
const cors = require("cors");
const ApiError = require("./app/api-error");

const app = express();
const booksRouter = require("./app/routes/book.route");

app.use(cors());
app.use(express.json());
app.use("/api/books", booksRouter);

app.get("/", (req, res) => {
    res.json({ message: "Chao mung den voi he thong quan ly muon sach" });
});

app.use((req, res, next) => {
    return next(new ApiError(404, "Resource not found"));
});

app.use((err, req, res) => {
    return res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error",
    });
});

module.exports = app;