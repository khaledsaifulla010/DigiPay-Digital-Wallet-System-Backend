import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "../modules/user/user.model";
import bcryptjs from "bcryptjs";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done) => {
      try {
        const isUserExist = await User.findOne({ email });
        if (!isUserExist) {
          return done("User doesnot Exist!");
        }

        const isPasswordMatch = await bcryptjs.compare(
          password as string,
          isUserExist.password as string
        );

        if (!isPasswordMatch) {
          return done(null, false, { message: "Incorrect Password !" });
        }

        return done(null, isUserExist);
      } catch (error) {
        done(error);
      }
    }
  )
);
