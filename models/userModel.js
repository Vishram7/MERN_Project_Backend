const mongoose = require('mongoose')
const bcrypt = require("bcrypt")
const validator = require("validator")



const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    }
}, {timestamps: true})




//static signup method
userSchema.statics.signup = async function(email, password) {

    //validation of email and password
    if(!email || !password){
        throw Error('All fields must be filled.')
    }

    if(!validator.isEmail(email)){
        throw Error('Email is not valid.')
    }

    if(!validator.isStrongPassword(password)){
        throw Error('Password must contain atleast 1 uppercase, 1 lowercase, numbers and special character.')
    }
    
    const exists = await this.findOne({ email })

    if(exists){
        throw Error('Email already in use.')
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await this.create({ email, password: hashedPassword })

    return user

}


//static login method
userSchema.statics.login = async function (email, password){

    if(!email || !password){
        throw Error('All fields must be filled.')
    }

    
        const user = await this.findOne({email})

        if(!user){
            throw Error('Incorrect email.')
        }

        const match = await bcrypt.compare(password, user.password)

        if(!match){
            throw Error('Incorrect password.')
        }

        return user

    

}


module.exports = mongoose.model('User', userSchema)
