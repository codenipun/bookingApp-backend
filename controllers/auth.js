import User from "../models/User.js";
import bcrypt from "bcrypt"
import {createError} from "../utils/error.js"
import jwt from "jsonwebtoken";

const saltRound = 10;
export const register = async(req, res, next) => {
    try {
        const { username, email, phone, password } = req.body;

        const existingUsername = await User.findOne({ username });
        if(existingUsername) {
            return next(createError(400, "Username already exists!"));
        }

        const existingEmail = await User.findOne({ email });
        if(existingEmail) {
            return next(createError(400, "Email already exists!"));
        }

        const existingPhone = await User.findOne({ phone });

        if(existingPhone) {
            return next(createError(400, "Phone number already exists!"));
        }
        
        if(phone.length !== 10){
            return next(createError(400, 'Phone Number Should be of 10 digits only'))
        }

        const salt = bcrypt.genSaltSync(saltRound);
        const hash = bcrypt.hashSync(password, salt);

        const newUser = new User({
            ...req.body,
            password: hash,
        });

        await newUser.save();
        res.status(200).send("User has been created");
    } catch (err) {
        next(err);
    }
};

export const login = async(req, res, next)=>{
    try {
        const user = await User.findOne({username : req.body.username});
        if(!user) return next(createError(404, "User Not Found"))

        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);

        if(!isPasswordCorrect) return next(createError(400, "Invalid User or Password"))
        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT
        );

        const {password, isAdmin, ...otherDetails} = user._doc

        res.cookie("access_token", token, {
          httpOnly: true,
        }).status(200).json({ details: { ...otherDetails }, isAdmin });
    } catch (err) {
        next(err);
    }
}