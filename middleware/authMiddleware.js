const jwt = require('jsonwebtoken');
const User = require('../model/user');


const requireAuth = (req, res, next) => {            //We will apply this middleware to any routes that required authentication. So we can not see the smoothie recipes unless we are logged in.

    const token = req.cookies.jwtCookie              //Trying to require the jwtCookie to created when logging in.

    //*Check jwt token exists & is verified
    if (token) {                                                  //If log in was successful and token was generated 
        jwt.verify(token, 'placeHolderSecret', (err, decodedToken) => {               //<--Verifying that the token is correct and passing the jwt secret we created in the jwt token creater function in authController.js (line 9). and if then the signatures match allow access.

            if (err) {
                console.log(err.message);
                res.redirect('/login');
            }
            else {
                console.log(decodedToken)               //If no problem allow access and show decoded token.
                next();                                 //After function is finished go to the 'next' part of the route.
            }
        })

    }
    else {
        res.redirect('/login');                      //If not successful re-direct user to log in page.
    }

    next()
}


//Check Current User
const checkUser = (req, res, next) => {         //<-- On all requests this middleware will be called and check for a token 

    const token = req.cookies.jwtCookie;

    if (token) {
        jwt.verify(token, 'placeHolderSecret', async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.locals.user = null;
                next();
            }
            else {
                console.log(decodedToken);       //<--This 'decoded' token has the user's Id stored within it.
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;         //<--So if user does exist we can pass it to the views folder and the pages inside of that and access properties from it.
                next()
            }
        })
    }
    else {
        res.locals.user = null;
        next();
    }
}


module.exports = {
    requireAuth,
    checkUser
}