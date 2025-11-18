import User from "../models/users.model.js";
import bcrypt from "bcryptjs";
import {redis} from "../lib/redis.js";
import jwt from "jsonwebtoken"


const generateToken = (userId) => {
    const accessToken = jwt.sign({userId}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
    })

    const refreshToken = jwt.sign({userId}, process.env.REFRESH_TOKEN_SECRET,{
        expiresIn : "7d",
    } )

    return {accessToken, refreshToken};
};

const storeRefreshToken = async (userId, refreshToken) => {
    await redis.set(`refresh_token:${userId}`, refreshToken, "EX", 7*24*60*60) // 7 days
};

const setCookies = async (res, accessToken, refreshToken) => {

    res.cookie("accessToken", accessToken, {
        httpOnly : true,  // prevent xss attack
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",  // prevent CSRF attack
        maxAge : 15 * 60 * 1000 // 15 minutes
    }),

    res.cookie("refreshToken", refreshToken,{
        https : true,
        secure : process.env.NODE_ENV === "production",
        sameSite : "strict",
        maxAge : 7 * 24 * 60 * 60 * 1000 // 7 days 
    })

}


export const signup  = async (req ,res) => {
    const {email , password, name } =  req.body;
    try{

        if(!email || !password || !name){
            return res.status(400).json({message : "All fields are required "});
        }

        if(password.length < 6){
            return res.status(400).json({message : "Password must be at least 6 characters"})
        }

        const user = await User.findOne({email});

        if(user){
            return res.status(400).json({message : "Email already exist"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password : hashedPassword
        })

        if(newUser){

            await newUser.save();

            // athenticate 
             const { accessToken, refreshToken } = generateToken(newUser._id);
             await storeRefreshToken(newUser._id, refreshToken);

             // we will set the cookies with the two tokens
             await setCookies(res, accessToken, refreshToken);

             res.status(201).json(
                {
                    user: { name, email },
                    message: "User created successfully"
                }
            )

        }
        else{
            res.status(400).status({message: "Invalid user data "})
        }


    }catch(error){
        console.log("Error in signup controller");
        res.status(500).json({message : error.message})
    }
};

export const login = async (req, res) => {
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({message: "Invalid credentials"});
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({messsage : "Invalid credentials "});
        }

        const {accessToken, refreshToken} = generateToken();
        
        await storeRefreshToken(user._id, refreshToken);
        await setCookies(res, accessToken, refreshToken);

        res.json({
            _id : user._id, 
            name : user.name,
            email: user.email,
        })
    }catch(error){
        console.log("Error in login controller");
        res.status(500).json({message : error.message});
    }
};

export const logout = async (req, res) => {
    try{
        const refreshToken = req.cookie?.refreshToken;
        if(refreshToken){
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            await redis.del(`refresh_token:${decoded.userId}`);
        }

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.json({message : "Logged out succesfully "});
    }catch(error){
        console.log("Error in logout controller");
        res.status(500).json({message : "server error", error : error.message})
    }
};

export const refreshToken = async (req, res) => {
    try{

        const refreshToken = req.cookies.refreshToken;

        if(!refreshToken){
            res.status(401).json({message: "No refresh token provided"});
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

        if(storedToken !== refreshToken){
            return res.status(401).json({message: "Invalid refresh token"});
        }

        const accessToken = jwt.sign({userId : decoded.userId}, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn : "15m"
        });

        res.cookies("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000

        })

        res.json({message: "Token refreshed successfully"})
    }catch(error){
        console.log("Error in refreshToken controller", error.message);
        res.status(500).json({message : "Server Error ", error: error.message});
    }
}

// todo: get profile route 

// export const getProfile = async (req, res) => {};