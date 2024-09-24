const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const ContactService = require("../services/contact.service");

exports.create = async (req, res, next) => {
    if (!req.body?.name) {
        return next(new ApiError(400, "Name can not be empty!"));
    }

    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.create(req.body);
        return res.send(document);
    } catch (error) {
        console.log(error);
        next(new ApiError(500, "An error occurred while creating the contact!"));
    }
};

exports.findAll = async (req, res, next) => {
    let document = [];
    try {
        const contactService = new ContactService(MongoDB.client);
        const { name } = req.query;
        if (name) {
            document = await contactService.findByName(name);
        } else {
            document = await contactService.find({});
        }
        
    } catch (error){
        return next(
            new ApiError(500, "An error occurred while retrieving contacts!")
        );
    }
    return res.send(document);
};

exports.findOne = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Contact not found!"));
        }
        return res.send(document);
        
    } catch (error) {
        return next(
            new ApiError(500, `Error retrieving contact with id=${req.params.id}`)
        );
    }
    
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return res.status(400).send({ message: "Data to update can not be empty!" });
    }

    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Contact not found!"));
        }
        return res.send({ message: "Contact was updated successfully!" });
    } catch (error) {
        return next(
            new ApiError(500, `Error updating contact with id=${req.params.id}`)
        )
    }
};

exports.delete = (_req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = contactService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Contact not found!"));
        }
        return res.send({ message: "Contact was deleted successfully!" });
    } catch (error) {
        return next(new ApiError(500, `Could not delete contact with id=${req.params.id}`));
    }
}

exports.findAllFavorite = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const documents = await contactService.findFavorite();
        return res.send(documents);
    } catch (error) {
        return next(new ApiError(500,
            "An error occurred while retrieving favorite contacts!"
        ));
    }
};

exports.deleteAll = async (_req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const deletedCount = await contactService.deleteAll();
        return res.send({
            message: `${deletedCount} contacts were deleted successfully!`,
        });
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while deleting all contacts!")
        );
    }
};