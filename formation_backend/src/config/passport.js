const JwtStrategy = require("passport-jwt").Strategy;
const ExtratJwt = require("passport-jwt").ExtractJwt;
//const db = require("../database/db.config");
const User = require("../api/models/users.model")
const jwtFromRequest = ExtratJwt.fromAuthHeaderAsBearerToken();

module.exports = passport => {
  passport.use(
    new JwtStrategy(
      {
        secretOrKey: process.env.JWT_SECRET,
        jwtFromRequest
      },
      async (jwtPayload, done) => {
        try {
          const foundUser = await User.findById(jwtPayload._id);
          if (foundUser) {
           // console.log(foundUser);
            return done(null, foundUser);
          }
          return done(null, false);
        } catch (e) {
          return done(e, false);
        }
      }
    )
  );
};
