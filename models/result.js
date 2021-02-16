const mongoose = require('../models/db'),
    Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String,
        unique: false
    },
    result: {
        type: Number,
        required: true,
    },
});

exports.Result = mongoose.model('result', schema);