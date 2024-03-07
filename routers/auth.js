const express = require('express');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const router = express.Router();

const prismaClient = require('../Utils/Database/prisma-client');
const prismaConnection = prismaClient();

MailerAuthDetails={
  type: 'OAuth2', 
  user: process.env.MailerUsername,
  pass: process.env.MailerPassword,
  clientId: process.env.MailClientId,
  clientSecret: process.env.MailClientSecret,
  refreshToken: process.env.MailRefreshToken
}


/**
 * Login with email and password
 * @route POST /auth/login/email
 * @group Auth
 * @param {string} email.body.required - email
 * @param {string} password.body.required - password
 * @returns {object} 200 - Token
 * @returns {object} 401 - User not found   
 * @returns {object} 401 - Incorrect password
 * @returns {Error}  default - Unexpected error
 * 
 * @example POST /auth/login/email
 * {
 *  "email": "hiker1",
 * "password": "password"
 * }
 * @response 200 { "token": JWT_ACCESS_TOKEN }
 */
router.post("/login/email", async (req, res) => { 
    const { email, password } = req.body;
    const user = await prismaConnection.user.findFirst({
        where: {
            email
        }
    })
    if (!user) {
      return res.status(401).json({ message: "User not found" })
    }else if(!user.is_authenticated){
      return res.status(401).json({ message: "User not verified" })
    }else if (user.password !== password) {
      return res.status(401).json({ message: "Incorrect password" })
    }
    const token = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET)
    res.json({ token })
})

function send_verification_mail(mail_auth_details,recv_mail,recv_name,url_to_send,res){
  const transporter = nodemailer.createTransport({
    service: 'Gmail', 
    auth: mail_auth_details,
  });

  const mailOptions = {
      from: mail_auth_details.sender_mail,
      to: recv_mail,
      subject: `Confirm your email address, ${recv_name}`,
      text: `Click on this link to verify your email: ${url_to_send}`,
  };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            res.status(500).json({"message":'Error sending verification email.'});
        } else {
            res.status(200).json({"message":'Verification email sent.'});
        }
    });

}

router.post("/signup/email", async (req,res)=>{
  const {email,password,mobile_no,name,role}=req.body
  const user = await prismaConnection.user.findFirst({
    where:{
      email
    }
  })
  if(user){
    return res.status(401).json({message:"user already exists"})
  }
  const add_user=await prismaConnection.user.create(
    {
      data: {
        email,name,mobile_no,password,role
      },
    }
  )

  const url_verification_token=jwt.sign({ email }, process.env.MailVerificationSecret)
  const verify_url="http://"+req.headers.host+`/auth/verify/email?email=${email}&token=${url_verification_token}`

  send_verification_mail(MailerAuthDetails,email,name,verify_url,res)
})


router.get("/verify/email/", async (req,res)=>{
  const {email,token}=req.query
  decoded_token=jwt.verify(token,process.env.MailVerificationSecret)
  if (decoded_token.email!=email){//not verified
    return res.status(401).json({"message":"user verification failed."})
  }

  const update_user_auth=await prismaConnection.user.update({
    where:{
      email:email
    },
    data:{
      is_authenticated:true
    }
  })
  return res.status(200).json({"message":"user verified!"})
}) 

router.get("/resend/verify/email/",async (req,res)=>{
  const {email,password,mobile_no,name,role}=req.body
  const user = await prismaConnection.user.findFirst({
    where:{
      email
    }
  })
  if(!user){
    return res.status(401).json({message:"user does not exist"})
  }else if(user.is_authenticated){
    return res.status(401).json({message:"user already authenticated"})
  }

  const url_verification_token=jwt.sign({ email }, process.env.MailVerificationSecret)
  const verify_url="http://"+req.headers.host+`/auth/verify/email?email=${email}&token=${url_verification_token}`

  send_verification_mail(MailerAuthDetails,email,name,verify_url,res)
})



module.exports = router;