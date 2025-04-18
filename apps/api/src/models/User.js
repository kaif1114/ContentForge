import mongoose, { mongo } from "mongoose"
import z from "zod";

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        unique: true,
        minlength: 5,
        maxlength: 255,
        match: [
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            "Please enter a valid email address"
        ],
        required: true
    },
    password: {
        type: String,
        maxlength: 1024
    },
    isGoogleUser: {
        type: Boolean,
        default: false
    },
    googleId: {
        type: String,
        unique: (props) => props.isGoogleUser,
        sparse: true,
        required: (props) => props.isGoogleUser,
        maxlength: 255
    },
})



export const userSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(8),
});


const User = mongoose.model("User", schema)

export default User
