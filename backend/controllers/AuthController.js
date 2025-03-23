const bcrypt = require("bcrypt");
const UserModel = require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = (user)=>{
  const accessToken = jwt.sign(
    {email:user.email, id:user._id, role:user.role, name:user.name },
    process.env.JWT_SECRET,
    {expiresIn: "15m"}
  );
  const refreshToken = jwt.sign(
    {id:user._id, role:user.role, name:user.name  },
    process.env.REFRESH_SECRET,
    {expiresIn:"7d"}
  )
  return {accessToken, refreshToken}
}

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      return res.status(409).json({
        message: "User is already exist, you can login",
        success: false,
      });
    }
    const userModel = new UserModel({ name, email, password,role: "user" });
    userModel.password = await bcrypt.hash(password, 10);
    await userModel.save();
    res.status(201).json({ message: "signup Successfully", success: true });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", err, success: false });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "email or password is incorrect",
        success: false,
      });
    }
    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      return res.status(404).json({
        message: "email or password is incorrect",
        success: false,
      });
    }
    const {accessToken, refreshToken} = generateToken(user)

    res.cookie("refreshToken", refreshToken,{
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 
    })
    // const JwtToken = jwt.sign(
    //   { email: user.email, _id: user._id ,role:user.role},
    //   process.env.JWT_SECRET, 
    //   { expiresIn: "7d" }
    // );
    res
      .status(200)
      .json({
        message: "login Successfully",
        success: true,
        accessToken,
        role:user.role,
        email,
        id:user._id,
        name: user.name,
      });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", err, success: false });
  }
};

const refreshAccessToken = (req,res)=>{
  const refreshToken = req.cookies.refreshToken;
  if(!refreshToken){
    return res.status(401).json({
      message:"Unauthorized, refresh token required"
    })
  }
  jwt.verify(refreshToken, process.env.REFRESH_SECRET,(err,decoded)=>{
    if(err){
      return res.status(403).json({message:"Invaild or expired refresh token"})
    }
    const newAccessToken = jwt.sign(
      {id: decoded.id, role:decoded.role, name:decoded.name},
      process.env.JWT_SECRET,
      {expiresIn:"15m"}
    )
    console.log("under refresh token")
    res.json({ accessToken: newAccessToken});
  })
}

const userInfo = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, message: "Token expired" });
      }
      return res.status(500).json({ success: false, message: "Internal server error", error: err });
    }
    
    const user = await UserModel.findById(decoded.id).select("role name");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true,email:user.email, id:user._id, name: user.name, role: user.role });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error", error });
  }
};


module.exports = { signup, login, refreshAccessToken,userInfo  };
