const User = require('../model/user.js');

const jwt = require('jsonwebtoken');

//TOKEN
const maxAge = 3 * 24 * 60 * 60;

const tokenGen = (id) => {
    return jwt.sign({ id }, 'placeHolderSecret', {
        expiresIn: maxAge
    });
}


//GET
const signupGet = (req, res) => {
    res.render('signup');
}

const loginGet = (req, res) => {
    res.render('login');
}


//POST
const signupPost = async (req, res) => {

    const { email, password } = req.body

    try {
        const newUser = await User.create({ email, password });
        const token = tokenGen(newUser._id);
        res.cookie('jwtCookie', token, { httpOnly: true, maxAge: maxAge * 1000 })
        res.status(200).json({ newUser: newUser.id });
    }
    catch (err) {
        const errors = errorHandling(err)
        res.status(400).json({ errors });
    }

}

const loginPost = async (req, res) => {

    const { email, password } = req.body                         //← Take details users trying to pass

    try {
        const user = await User.loginModel(email, password);     //← Uses 'loginModel on Schema page
        const token = tokenGen(user._id);                        //← If successful creates token 
        res.cookie('jwtCookie', token, { httpOnly: true, maxAge: maxAge * 1000 })  //← Passes token into cookie (maxAge referring to cookie life span)
        res.status(200).json({ user: user.id });

    }
    catch (err) {
        const errors = errorHandling(err)
        res.status(400).json({ errors });
    }

}


//LOG OUT
const logoutGet = (req, res) => {
    res.cookie('jwtCookie', '', { maxAge: 1 });                     //We can not delete a cookie so we are re-writing is value and givin it a very short expiry length of 0.01 seconds.
    res.redirect('/');
}


//Error 
const errorHandling = (err) => {
    console.log(err.message, err.code)               //*<--'err.code' is to do with the 'unique' setting inside of the model folder.
    let errors = { email: "", password: "" };


    //Duplicate Email
    if (err.code === 11000) {
        errors.email = 'Email already in use'
        return errors
    }

    //Validation Errors
    if (err.message.includes('user validation failed')) {            //!<--Default failed validation response when using validate package.

        Object.values(err.errors).forEach(({ properties }) => {      //!<--As this is now an arrays we can cycle through it and control each error.


            errors[properties.path] = properties.message;            //!<--Because we have access to the properties inside of {properties}, we can call on them, .path will log where the error is and .message will show your custom message you wrote in the model folder.

        })
    }

    //Incorrect Email
    if (err.message === 'Incorrect Email') {                              //<--'Incorrect Email' form loginModel in user.js
        errors.email = 'That email is not registered';                   //We would re-write the errors {email,password} values on line 72 so if they needed to be called they would have the correct error message.
    }

    //Incorrect Password
    if (err.message === 'Incorrect Password') {
        errors.password = 'Password is Incorrect';
    }
    return errors;
}



module.exports = {
    signupGet,
    loginGet,
    signupPost,
    loginPost,
    logoutGet
}