const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { isEmail } = require('validator');  //← Is email is part of 'validator' package

const dataSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter an Email'],        //<-- Custom validators
        lowercase: true,
        unique: true,                                     //<-- Can not make custom validator with 'unique'.
        validate: [isEmail, 'Invalid Email']
    },
    password: {
        type: String,
        required: [true, 'Please enter an Password'],
        minlength: [4, 'Minium Password length is 4 characters']
    }
})


//Mongoose-Hooks                                            //<-- This will hash the password before it is saved to the database.
dataSchema.pre('save', async function (next) {
    this.password = await bcrypt.hash(this.password, 12)
    next()
})



//Static Login Method                                                               //<-- Gets called when user tries to 'login'.
dataSchema.statics.loginModel = async function (email, password) {

    const isUser = await this.findOne({ email })                                    //<--Trying to match email that is passed, to emails on database ('this' refers to the Schema model).

    if (isUser) {                                                                   //<-- If email pasted does exist on database, then.....
        const isPassword = await bcrypt.compare(password, isUser.password)          //<--password = password user enters at login page and isUser.password is the hashed password that is stored on the database.

        if (isPassword) {
            return isUser                                                           //<--If passwords match, it is 'truthey' so return the user account.
        }
        throw Error('Incorrect Password')
    }
    throw Error('Incorrect Email')
}



const User = mongoose.model('user', dataSchema);

module.exports = User;