import mongoose from "mongoose"
import bcrypt from "bcryptjs"

// Define user schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    avatar: {
        type: String,
        required: false,
        default: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp",
    }
})

// Hash the user's password before saving it to the database
userSchema.pre("save", async function () {
    // If the password has not been changed, don't hash it again
    if (!this.isModified("password")) {
        return
    }

    // Generate a secure hash of the password
    const hash = await bcrypt.hash(this.password, 10)
    this.password = hash

    return
})

// Method to compare a plain-text password with the stored hashed password
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

// Create user model
const userModel = mongoose.model("user", userSchema)

export default userModel