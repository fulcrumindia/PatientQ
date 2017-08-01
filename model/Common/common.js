var _ = require('lodash');
var mongoose = require("mongoose");
var path = require('path');
var fs = require('fs');

// Get list of things
exports.get = function (req, res) {
    var Model = mongoose.model(req.params.collection);
    Model.find({$or: [{is_deleted: false}, {is_deleted: null}]}, function (err, annos) {
        if (err) {
            res.send(send_response(null, true, err));
        } else {
            res.send(send_response(annos));
        }
    });
};

// Get a single thing
exports.getById = function (req, res) {
    var Model = mongoose.model(req.params.collection);
    Model.findOne({_id: req.params.id}, function (err, annos) {
        if (err) {
            res.send(send_response(null, true, err));
        } else {
            res.send(send_response(annos));
        }
    });
};

// Creates a new thing in the DB.
exports.createnew = function (req, res) {
    var Model = mongoose.model(req.params.collection);
    var data = new Model(req.body);
    Model.create(data, function (err, mod) {
        if (err) {
            res.send(send_response(null, true, err));
        } else {
            res.send(send_response(mod));
        }
    });
};

// Updates an existing thing in the DB.
exports.update = function (req, res) {

    var Model = mongoose.model(req.params.collection);
    var id = req.params.id;
    if (!id) {
        id = req.body._id;
    }
    if (req.body._id) {
        delete req.body._id;
    }
    Model.findById(id, function (err, thing) {
        if (err) {
            res.send(send_response(null, true, err));
        }
        if (!thing) {
            res.send(send_response(null, true, "Not Found"));
        }
        var updated = _.merge(thing, req.body);
        updated.save(function (err) {
            console.log("After Save...");
            if (err) {
                res.send(send_response(null, true, err));
            } else {
                res.send(send_response(thing));
            }
        });
    });
};

exports.softdestroy = function (req, res) {
    var Model = mongoose.model(req.params.collection);
    var id = req.params.id;

    Model.findById(id, function (err, thing) {
        if (err) {
            res.send(send_response(null, true, err));
        }
        if (!thing) {
            res.send(send_response(null, true, "Not Found"));
        }
        thing.is_deleted = true;
        thing.save(function (err) {
            if (err) {
                res.send(send_response(null, true, err));
            } else {
                res.send(send_response(thing));
            }
        });
    });
};

// Deletes a thing from the DB.
exports.destroy = function (req, res) {
    var Model = mongoose.model(req.params.collection);
    Model.findById(req.params.id, function (err, thing) {
        if (err) {
            return res.send(send_response(null, true, err));
        }
        if (!thing) {
            return res.send(send_response(null, true, "Not Found"));
        }
        thing.remove(function (err) {
            if (err) {
                return res.send(send_response(null, true, err));
            }
            return res.send(send_response(null, false, ''));
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
