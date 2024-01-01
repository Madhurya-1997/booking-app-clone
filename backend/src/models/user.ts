import mongoose from "mongoose";

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

const User = mongoose.model<UserType>("User", UserSchema);

export default User;


