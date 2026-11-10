
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        nomuser: {
            type: String,
            required: true,
            trim: true
        },
        Password: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const ModeUser = mongoose.model("usuario", userSchema);

module.exports = ModeUser;


