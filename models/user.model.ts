import { Schema, model, models } from "mongoose"
import bcrypt from "bcrypt"

const userSchema = new Schema({
    fullname: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String
    },
    address: {
        street: {type: String, default: null},
        city: {type: String, default: null},
        state: {type: String, default: null},
        country: {type: String, default: null},
        pincode: {type: Number, default: null}
    }
}, {timestamps: true})

userSchema.pre('save', function(next) {
    this.role = "user"
    next()
})

userSchema.pre('save', async function(next){
    this.password = await bcrypt.hash(this.password.toString(), 12)
    next()
})

const UserModel = models.User || model("User", userSchema)
export default UserModel