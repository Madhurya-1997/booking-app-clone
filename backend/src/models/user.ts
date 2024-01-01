import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { logEvents } from "../middlewares/logger";

const Schema = mongoose.Schema;

export type UserType = {
    _id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
};

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    }
});

//encrypt the password using pre hook on all "save" actions
UserSchema.pre("save", async function (next) {
    logEvents("Encrypted user password on modification", "requestLog.log");
    if (this.isModified(this.password)) {
        this.password = await bcrypt.hash(this.password, 8);
    }

    next();
})

const User = mongoose.model<UserType>("User", UserSchema);

export default User;


