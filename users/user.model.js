const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    departmentId: { type: mongoose.Schema.Types.ObjectId,ref: 'Department' },
    username: { type: String, unique: true, required: true },
    hash: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    createdDate: { type: Date, default: Date.now },
    imagefile: { type: String }
});
 
schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.hash;
    }
});

module.exports = mongoose.model('User', schema);