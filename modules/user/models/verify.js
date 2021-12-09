const { Schema, model } = require("mongoose");

const { Types } = Schema;
const verify_schema = new Schema({
    _id: { type: Types.String, required: true },
    user_id: {type: Types.String, required: true},
    code: { type: Types.Number, required: true},
    sent_at: {type: Types.Number, required: true},
    is_valid: {type: Types.Boolean, required: true},
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = model(`verify`, verify_schema);