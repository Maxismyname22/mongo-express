var DataBase = function() {
	const MongoClient = require('mongodb').MongoClient;
	var ObjectId = require('mongodb').ObjectID;

	var db;

	function init(callback) {
		if (!db) {
			MongoClient.connect('mongodb://lab-user:lab-pwd@127.0.0.1:27017/lab-db', { useNewUrlParser: true }, (err, client) => {
				if (err) return console.log(err);
				db = client.db('lab-db');
				callback();
			});
		} else {
			callback();
		}
	}

	this.getCollection = function (collectionName, callback) {
		init(function () {
			db.collection(collectionName).find().toArray(callback);
		})
	};
	this.insertToCollection = function (collectionName, data, callback) {
		init(function () {
			db.collection(collectionName).insert(data, callback);
		})
	};
	this.removeFromCollection = function (collectionName, id, callback) {
		init(function () {
			db.collection(collectionName).remove({_id: ObjectId(id)}, {justOne: true}, callback)
		})
	};
	this.updateInCollection = function (collectionName, id, new_data, callback) {
		init(function () {
			db.collection('currency').update({_id: ObjectId(id)}, { $set: new_data }, [false, true], callback);
		})
	};
	this.groupByCurrency = function (callback) {
		callback(null, []);
	};

	this.greatSpending = function (callback) {
		callback(null, []);
	};

	this.getSpendingWithExchangeRate = function (callback) {
		init(function () {
			db.collection('operations').aggregate([
				{
					$lookup:
						{
							from: "currency",
							localField: "currency",
							foreignField: "name",
							as: "rate"
						}
				},
				{
					$unwind: {
						path: "$rate"
					}
				},
				{
					$addFields: {
						convertedSum: {$toDouble: "$sum"}
					}
				}
			], callback);
		});
	};

	this.convertIntoUah = function (callback) {
		callback(null, []);
	};
};

module.exports = DataBase;
