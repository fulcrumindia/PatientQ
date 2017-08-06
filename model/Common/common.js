var _ = require('lodash');
var mongoose = require("mongoose");
var path = require('path');
var fs = require('fs');

// Get list of things
exports.get = (collectionname, callback) => {
    var Model = mongoose.model(collectionname);
    Model.find({$or: [{is_deleted: false}, {is_deleted: null}]}, function (err, annos) {
        if (err) {
            callback(err,null);
        } else {
            callback(null,annos);
        }
    });
};

// Get a single thing
exports.getById = (id,collectionname,callback) => {
    var Model = mongoose.model(collectionname);
    Model.findOne({_id: req.params.id}, function (err, annos) {
        if (err) {
            callback(err,null);
        } else {
           callback(null,annos);
        }
    });
};

// Creates a new thing in the DB.
exports.createnew = (model,collectionname,callback) => {
    var Model = mongoose.model(collectionname);
    var data = model;
    Model.create(data, function (err, mod) {
        if (err) {
            callback(err,null);
        } else {
            callback(null,mod);
        }
    });
};

// Updates an existing thing in the DB.
exports.update = (id,collectionname,callback)) {

    var Model = mongoose.model(collectionname);

    Model.findById(id, function (err, thing) {
        if (err) {
            callback(err,null);
        }
        if (!thing) {
            callback(null,null);
        }
        var updated = _.merge(thing, req.body);
        updated.save(function (err) {
            console.log("After Save...");
            if (err) {
                callback(err,null);
            } else {
                callback(null,thing);
            }
        });
    });
};

exports.softdestroy = (id,collectionname,callback) => {
    var Model = mongoose.model(collectionname);
    Model.findById(id, function (err, thing) {
        if (err) {
            callback(err,null);
        }
        if (!thing) {
            callback(null,null);
        }
        thing.is_deleted = true;
        thing.save(function (err) {
            if (err) {
                callback(err,null);
            } else {
                callback(null,thing);
            }
        });
    });
};

// Deletes a thing from the DB.
exports.destroy = (id,collectionname,callback) => {
    var Model = mongoose.model(collectionname);
    Model.findById(req.params.id, function (err, thing) {
        if (err) {
            callback(err,null);
        }
        if (!thing) {
            callback(null,null);
        }
        thing.remove(function (err) {
            if (err) {
                callback(err,null);
            }
            callback(null,null);
        });
    });
};

/*
 * @api {post} /{Any Model} Request Model information
 * @apiName ExecuteQuery
 * @apiGroup Query
 * @apiVersion 0.1.0
 * @apiParam {JSON} req
 * {
 "where": {

 },
 "populate" : ["salon"],
 "fields" : "-salt -hashedPassword",
 "sort" : {"first_name" : 1}
 }
 *
 * @apiSuccess {N/A}
 *
 */
/*
exports.executeQuery = function (req, res) {
    var Model = mongoose.model(req.params.collection);
    var where = req.body.where;
    console.log(where);
    var populate = req.body.populate;
    var fields = req.body.fields;
    var sort = req.body.sort;
    if (!fields) {
        fields = '';
    }
    var query = Model.find({}, fields);
    if (where) {
        query = Model.find(where, fields);
    }

    if (populate) {
        query = query.populate(populate);
    }
    if (sort) {
        query = query.sort(sort);
    }
    query.exec(function (err, annos) {
        if (err) {
            res.send(send_response(null, true, err));
        } else {
            res.send(send_response(annos));
        }
    });


}
*/
