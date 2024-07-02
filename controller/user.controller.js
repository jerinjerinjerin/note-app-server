import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


//register user endpoint
export const CreateUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    const isUser = await User.findOne({ email });

    if (isUser) {
      return res.status(409).json({ error: true, message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashPassword,
    });

    await user.save();

    const accessToken = jwt.sign({ _id: user._id, email: user.email }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "30m",
    });

    return res.status(201).json({
      error: false,
      user: { _id: user._id, name: user.name, email: user.email },
      accessToken,
      message: "Registration successful",
    });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};



//login user endpoint
export const LoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const userInfo = await User.findOne({ email });

    if (!userInfo) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isMatchPassword = await bcrypt.compare(password, userInfo.password);

    if (!isMatchPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const accessToken = jwt.sign({ _id: userInfo._id, email: userInfo.email }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "30m",
    });

    return res.status(200).json({
      error: false,
      message: "Login successful",
      user: { _id: userInfo._id, name: userInfo.name, email: userInfo.email },
      accessToken,
    });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

//get user endpoint

export const GetUser = async (req, res) => {
  try {
    const userId = req.user && req.user._id;

    const isUser = await User.findOne({_id: userId});

    if(!isUser){
      return res.status(404).json({error: true, message: "User not found"})
    }

    return res.status(200).json ({
      user: isUser,
      message: "User found"
    })
} catch (error){

  return res.status(500).json({error: true, message: "Internal Server Error"})

}

}


