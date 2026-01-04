const asyncWrapper = require("../middleware/asyncWrapper");
const customError = require("../errors");
const UserModel = require("../model/User");
const createTokenUser = require("../utils/createTokenUser");
const { generateNewToken } = require("../utils/jwtHelperFunction");
const {StatusCodes} = require('http-status-codes')

const register = asyncWrapper(async (req, res) => {
  const {name, email, password } = req.body;
  if (!email || !name || !password)
    throw new customError.BadRequestError("Please provide require data.");
  const emailAlreadyExist = await UserModel.findOne({ email });
  if (emailAlreadyExist)
    throw new customError.BadRequestError("Email already exist");
  
  const isFirstAccount = (await UserModel.countDocuments({}))===0;
  const  role = isFirstAccount ? 'admin': 'user';

  const user = await UserModel.create({name,email,role,password});
  const tokenUser = createTokenUser(user);
  
  res.status(StatusCodes.OK).json({message: 'User Register successfully', user: tokenUser});
});

const login = asyncWrapper(async ( req,res)=>{
    const {email,password} = req.body;
  if (!email || !password)
    throw new customError.BadRequestError("Please provide require data.");
  const user = await UserModel.findOne({email});
  if(!user)throw new customError.UnAuthenticatedError('Invalid crediential');
  
  const isCorrectPassword = await user.comparePassword(password);
  if(!isCorrectPassword)
     throw new customError.UnAuthenticatedError('Invalid Password');
  
  const tokenUser = createTokenUser(user);
  const token = generateNewToken(tokenUser);
  res.status(StatusCodes.OK).json({message: 'login successfully', token, user: tokenUser});
})

module.exports = {register, login};
