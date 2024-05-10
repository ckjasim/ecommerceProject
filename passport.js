const passport = require("passport");
const googleStrategy = require("passport-google-oauth20").Strategy;
const userSchema=require("./model/userData")
require('dotenv').config();


passport.use(
    new googleStrategy(
        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: "https://prindecor.shop/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {           
            console.log(profile);
            try {
         
                const { id: googleId, email, displayName: fName } = profile;

                let user = await userSchema.findOne({ email: profile._json.email });
                if (!user) {
                  
                    user = await userSchema.create({
                        googleId,
                        email: profile._json.email,
                        fName,
                        password:googleId,
                        is_block:false,
                        createDate:new Date(),
                        mobile:'08958093553'
                    });
                }

               
                return done(null, user);
            } catch (error) {
                console.error("Error during Google authentication:", error);
                return done(error, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});


module.exports = {
    googleAuth: passport.authenticate("google", { scope: ["profile", "email"] }),

    googleCallback: passport.authenticate("google", {
        failureRedirect: "/login",
      
    }),

    setupSession: (req, res, next) => {
 
        if (req.isAuthenticated()) {
         
            req.session.user_id = req.user._id;
        } 
        console.log(req.session.user_id);
        res.redirect("/");
    },
};