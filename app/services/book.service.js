const { ObjectId } = require('mongodb');

class BookService {
    constructor(client) {
        this.Book = client.db().collection('books');
        
    }

    extractBookData(payload) {
        const book = {
            tensach: payload.tensach,
            dongia: payload.dongia,
            soquyen: payload.soquyen,
            namxuatban: payload.namxuatban,
            manxb: payload.manxb,
            tacgia: payload.tacgia,
        };
        Object.keys(book).forEach(key => book[key] === undefined && delete book[key]);
        return book;
    }

    async create(payload) {
        const book = this.extractBookData(payload);
        const result = await this.Book.findOneAndUpdate(
            { tensach: book.tensach }, 
            { $set: book },  
            { returnDocument: "after", upsert: true }
        );
        return result;
    }
    async find(filter) {
        const cursor = await this.Book.find(filter);
        return await cursor.toArray();
    }

    async findByName(name) {
        return await this.find({
            name: { $regex: new RegExp(new RegExp(name)), $options: 'i' },
        })
    }

    async findById(id) {
        return await this.Book.findOne({
            _id: ObjectId.isValid(id) ? ObjectId.createFromHexString(id) : null,
        });
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? ObjectId.createFromHexString(id) : null,
        };
        const update = this.extractBookData(payload);
        const result = await this.Book.findOneAndUpdate(
            filter,
            {
                $set: update,
            },
            { returnDocument: "after" }
        );
        return result;
    }

    async delete(id) {
        const result = await this.Book.deleteOne({
            _id: ObjectId.isValid(id) ? ObjectId.createFromHexString(id) : null,
        });
        return result;
    }

    // async findFavorite() {
    //     return await this.find({ favorite: true });
    // }

    async deleteAll() {
        const result = await this.Book.deleteMany({});
        return result.deletedCount;
    }
}

module.exports = BookService;