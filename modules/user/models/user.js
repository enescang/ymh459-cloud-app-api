const { Schema, model } = require("mongoose");

const { Types } = Schema;
const user_schema = new Schema({
    _id: { type: Types.String, required: true },
    email: { type: Types.String, required: true },
    password: { type: Types.String, required: true },
    username: { type: Types.String, default:null },
    language: { type: Types.String, default: "en" },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = model(`users`, user_schema);