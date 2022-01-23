"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
class DataBase {
    constructor(base) {
        this.base = base;
        // Class Metadata
        this.description = "The class that contains all mongodb methods";
        this.mongoclient = new mongodb_1.MongoClient(process.env.MONGOURI, { useNewUrlParser: true, useUnifiedTopology: true });
        this.mongoclient.connect();
    }
    dbRead(collection, object, disableLogger = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const dir = collection.trim().split(".");
            const location = yield this.mongoclient.db(dir[0]).collection(dir[1]);
            // Method
            let result;
            if (!Array.isArray(object)) {
                result = yield location.findOne(object);
            }
            else {
                const cursor = yield location.find(object)
                    .sort({ last_review: -1 });
                result = yield cursor.toArray();
            }
            if (!disableLogger) {
                // Log
                if (result) {
                    console.log(`[Database]: Found a listing in the collection with the name '${object}':`);
                    // console.log(result);
                }
                else {
                    console.log(`[Database]: No listings found with the name '${object}'`);
                }
            }
            // Return
            if (dir[1] == "accounts") {
                delete result._id;
            }
            return result;
        });
    }
    dbInsert(collection, object) {
        return __awaiter(this, void 0, void 0, function* () {
            const dir = collection.trim().split(".");
            const location = yield this.mongoclient.db(dir[0]).collection(dir[1]);
            // Method
            let result;
            if (!Array.isArray(object)) {
                result = yield location.insertOne(object);
            }
            else {
                result = yield location.insertMany(object);
            }
            // log
            console.log(`[Database]: ${result.insertedId} new listing created with the following id:`);
            // Return
            return result;
        });
    }
    dbUpdate(collection, query, object) {
        return __awaiter(this, void 0, void 0, function* () {
            const location = collection.trim().split(".");
            // Method
            const result = yield this.mongoclient.db(location[0])
                .collection(location[1])
                .updateOne(query, object, { upsert: true });
            // { $set: object }
            // Log
            console.log(`[Database]: ${result.matchedCount} document(s) matched the query criteria.`);
            if (result.upsertedCount > 0) {
                console.log(`[Database]: One document was inserted with the id ${result.upsertedId._id}`);
            }
            else {
                console.log(`[Database]: ${result.modifiedCount} document(s) was/were updated.`);
            }
            // Return
            return result;
        });
    }
    dbDelete(collection, object) {
        return __awaiter(this, void 0, void 0, function* () {
            const dir = collection.trim().split(".");
            const location = yield this.mongoclient.db(dir[0]).collection(dir[1]);
            let result;
            console.log(dir);
            // if (!Array.isArray(object)) {
            result = yield location.deleteOne(object);
            // }
            // } else {
            //     const cursor = await location.find(object)
            //         .sort({ last_review: -1 })
            //     result = await cursor.toArray()
            // }
            // Log
            console.log(`[Database]: ${result.deletedCount} document(s) was/were deleted.`);
            // Return
            return result;
        });
    }
}
exports.default = DataBase;
