const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const BookService = require("../services/book.service");

exports.create = async (req, res, next) => {
    if (!req.body?.tensach) {
        return next(new ApiError(400, "Name can not be empty!"));
    }

    try {
        const bookService = new BookService(MongoDB.client);
        const document = await bookService.create(req.body);
        return res.send(document);
    } catch (error) {
        console.log(error);
        next(new ApiError(500, "An error occurred while creating the book!"));
    }
};

exports.findAll = async (req, res, next) => {
    let document = [];
    try {
        const bookService = new BookService(MongoDB.client);
        const { name } = req.query;
        if (name) {
            document = await bookService.findByName(name);
        } else {
            document = await bookService.find({});
        }
        
    } catch (error){
        return next(
            new ApiError(500, "An error occurred while retrieving books!")
        );
    }
    return res.send(document);
};

exports.findOne = async (req, res, next) => {
    try {
        const bookService = new BookService(MongoDB.client);
        const document = await bookService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Book not found!"));
        }
        return res.send(document);
        
    } catch (error) {
        return next(
            new ApiError(500, `Error retrieving book with id=${req.params.id}`)
        );
    }
    
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return res.status(400).send({ message: "Data to update can not be empty!" });
    }

    try {
        const bookService = new BookService(MongoDB.client);
        const document = await bookService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Book not found!"));
        }
        return res.send({ message: "Book was updated successfully!" });
    } catch (error) {
        return next(
            new ApiError(500, `Error updating book with id=${req.params.id}`)
        )
    }
};

exports.delete = async (req, res, next) => {  // Thêm async
    try {
        const bookService = new BookService(MongoDB.client);
        const document = await bookService.delete(req.params.id); // Thêm await
        if (!document) {
            return next(new ApiError(404, "Book not found!"));
        }
        return res.send({ message: "Book was deleted successfully!" });
    } catch (error) {
        return next(new ApiError(500, `Could not delete book with id=${req.params.id}`));
    }
};

// Nếu cần sử dụng lại findAllFavorite, hãy bỏ comment và sửa
exports.findAllFavorite = async (req, res, next) => {
    try {
        const bookService = new BookService(MongoDB.client); // Sửa ContactService thành BookService
        const documents = await bookService.findFavorite(); // Giả sử bạn có phương thức findFavorite trong BookService
        return res.send(documents);
    } catch (error) {
        return next(new ApiError(500, "An error occurred while retrieving favorite books!")); // Sửa từ contacts thành books
    }
};

exports.deleteAll = async (_req, res, next) => {
    try {
        const bookService = new BookService(MongoDB.client); // Sửa ContactService thành BookService
        const deletedCount = await bookService.deleteAll();
        return res.send({
            message: `${deletedCount} books were deleted successfully!`, // Sửa từ contacts thành books
        });
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while deleting all books!") // Sửa từ contacts thành books
        );
    }
};
