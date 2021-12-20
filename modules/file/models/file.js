const { Schema, model } = require("mongoose");

const { Types } = Schema;
const file_schema = new Schema({
    _id: { type: Types.String, required: true },
    user_id: { type: Types.String, required: true },
    file_id: { type: Types.String, required: true },
    file_name: {type: Types.String, required: true},
    file_size: {type: Types.String, required: true},
    file_mime: {type: Types.String, required: true},
    encrypted_aes_key: {type: Types.String, required: true},
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = model(`files`, file_schema);