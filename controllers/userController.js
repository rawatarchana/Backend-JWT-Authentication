const userModel = require('../models/userModel');
require('dotenv').config();

const userAuthenticateToken = require('../middleware/userAuthenticateToken');

const jwt = require('jsonwebtoken');

exports.createUser = async(req,res)=>{
    try {
             let firstName = req.body.firstName;
             let lastName = req.body.lastName;
             let emailId = req.body.emailId;
             let phoneNumber = req.body.phoneNumber;
             let isAdmin = req.body.isAdmin;
             let education = req.body.education;
             let hobby = req.body.hobby;
             if(!firstName || firstName.trim().length === 0){
                 res.status(400).json({
                     message : 'Bad request. Mandatory parameter missing for firstname'
                 });
                 return;
             }
             if(!lastName || lastName.trim().length === 0){
                 res.status(400).json({
                     message : 'Bad request. Mandatory parameter missing for lastName'
                 });
                 return;
             }
             if (!emailId || emailId.trim().length === 0) {
                 res.status(400).json({
                     message: 'Bad request. Mandatory parameter missing for emailId'
                 });
                 return;
             }
             if (!phoneNumber || phoneNumber.length < 10) {
                 res.status(400).json({
                     message: 'Bad request. Mandatory parameter missing for phoneNumber'
                 });
                 return;
             }
     
             const existingUserEmaiLd = await userModel.findOne({emailId : emailId});
             if(existingUserEmaiLd){
                 res.status(400).json({message :' Email already exixts.'});
                 return;
             }
             const existingUserPhoneNumber = await userModel.findOne({phoneNumber : phoneNumber});
             if(existingUserPhoneNumber){
                 res.status(400).json({message :' PhoneNumber already exixts.'});
                 return;
             }
     
             let newUser = new userModel({
                 firstName : firstName,
                 lastName : lastName,
                 emailId : emailId ,
                 phoneNumber : phoneNumber,
                 isAdmin : isAdmin,
                 education : education,
                 hobby : hobby
             });
     
             let data = await newUser.save();
             res.status(200).json({
                 message: 'Success',
                 data : data
             });
        
    } catch (err) {
        res.status(500).json({
            message : err.message
        });
    }

}


//get admin user
exports.getAdminUsers = async(req, res)=>{
    
    try {
       
        let data = await userModel.find({ isAdmin: true });
        if(data){
            res.status(200).json({
                message: 'Success',
                data : data
            });
        }else{
            res.status(404).json({message : 'No Admin User is found.'});
        }
    } catch (err) {
        res.status(500).json({
            message : err.message
        });
    }
    
}

//get basic user data 
exports.getBasicUsers = async (req, res)=>{
    try {
        let data = await userModel.find({ isAdmin: false });
        if(data){
            res.status(200).json({
                message: 'Success',
                data : data
            });
        }else{
            res.status(404).json({message : 'No Basic User is found.'});
        }
    } catch (err) {
        res.status(500).json({
            message : err.message
        });
    }
}

//get user by their emailId 
exports.getUsersByEmailId = async (req, res)=>{
    try {
        let emailId = req.query.emailId;
        if (!emailId || emailId.trim().length === 0) {
            res.status(400).json({
                message: 'Bad request. Mandatory parameter missing'
            });
            return;
        }
        let data = await userModel.findOne({emailId : emailId});
        if(data){
            res.status(200).json({
                message: 'success',
                data: data
            });
        }else{
            res.status(404).json({error : 'User not found'});
        }
        
    } catch (err) {
        res.status(500).json({
            message : err.message
        });
        
    }
}

//update admin user's phone number 

exports.updateAdminUsersPhoneNumber = async(req, res)=>{
    try {
      
        let emailId = req.body.emailId;
        let phoneNumber = req.body.phoneNumber;
        
        if (!emailId || emailId.trim().length === 0) {
            res.status(400).json({
                message: 'Bad request. Mandatory parameter missing for emailId'
            });
            return;
        }
        if (!phoneNumber || phoneNumber.length < 10) {
            res.status(400).json({
                message: 'Bad request. Mandatory parameter missing for phoneNumber'
            });
            return;
        }
        
        const user = await userModel.findOne({ emailId: emailId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if(!user.isAdmin){
            return res.status(403).json({message : 'Unauthorized: Only admins users are allowed to update phoneNumber'});
        }

        const existingUserPhoneNumber = await userModel.findOne({ phoneNumber: phoneNumber });
        if (existingUserPhoneNumber) {
            return res.status(400).json({ message: 'Phone Number already exixts' });
        }
        
        let data = await userModel.findOneAndUpdate({emailId:emailId} , {$set : {phoneNumber:phoneNumber}} , {new: true});
        if(data){
            res.status(200).json({
                message: 'success',
                data: data
            })
        }else {
            res.status(404).json({ message: 'User not found' });
        }


    } catch (err) {
        res.status(500).json({
            message : err.message
        });
    }
}

//update admin user's education only
exports.updateAdminUsersEducation = async (req, res)=>{
    try{
        
        let emailId = req.body.emailId;
        let education = {
            name  : req.body.name,
            completionYear : req.body.completionYear,
            type : req.body.type

        };
        if (!emailId || emailId.trim().length === 0) {
            res.status(400).json({
                message: 'Bad request. Mandatory parameter missing for emailId'
            });
            return;
        }
        if(!education.name || !education.completionYear || !education.type){
            res.status(400).json({
                message: 'Bad request. Mandatory parameter missing for Education'
            });
            return;
        }

        const user = await userModel.findOne({ emailId: emailId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if(!user.isAdmin){
            return res.status(403).json({message : 'Unauthorized: Only admins users are allowed to update education'});
        }

        let updateEducation = null;
        if (education.type === "primaryEducation") {
            updateEducation = {
                $set :{
                    "education.0.name": education.name,
                    "education.0.completionYear": education.completionYear,
                    "education.0.type": education.type
                }
            };
        }else if (education.type === "secondaryEducation") {
            updateEducation = {
                $set :{
                    "education.1.name": education.name,
                    "education.1.completionYear": education.completionYear,
                    "education.1.type": education.type
                }
            };
        }else if (education.type === "tertiaryEducation") {
            updateEducation = {
                $set :{
                    "education.2.name": education.name,
                    "education.2.completionYear": education.completionYear,
                    "education.2.type": education.type
                }
            };
        } 
         

        let data = await userModel.findOneAndUpdate({emailId : emailId} ,  updateEducation, {new : true});
        res.status(200).json({
            message : 'Success',
            data : data
        });


    }catch(err){
        res.status(500).json({
            message : err.message
        });
    }
}

//update the hobby of any user

exports.updateUserHobby = async (req, res) => {
    try {
        
        let emailId = req.body.emailId;
        let hobby = {
            type: req.body.type,
            name: req.body.name,
            currentlyPlaying: req.body.currentlyPlaying
        };

        if (!emailId || emailId.trim().length === 0) {
            res.status(400).json({
                message: 'Bad request. Mandatory parameter missing for emailId'
            });
            return;
        }

        if ( !hobby.type || !hobby.name || hobby.currentlyPlaying === undefined) {
            res.status(400).json({
                message: 'Bad request. Mandatory parameter missing for Hobby'
            });
            return;
        }

        const user = await userModel.findOne({ emailId: emailId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        let updateHobby = null;

        if (hobby.type === 'indoor') {
            updateHobby = {
                $set: {
                    'hobby.indoor.$[].name': hobby.name,
                    'hobby.indoor.$[].currentlyPlaying': hobby.currentlyPlaying
                }
            };
        } else if (hobby.type === 'outdoor') {
            updateHobby = {
                $set: {
                    'hobby.outdoor.$[].name': hobby.name,
                    'hobby.outdoor.$[].currentlyPlaying': hobby.currentlyPlaying
                }
            };
        } else {
            res.status(400).json({ message: 'Invalid hobby type' });
            return;
        }

        let data = await userModel.findOneAndUpdate({ emailId: emailId }, updateHobby, { new: true });
        res.status(200).json({
            message: 'Success',
            data: data
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}

//delete by query only Admin user's
exports.deleteAdminUserByEmailId = async (req, res) => {
    let emailId = req.query.emailId;
    try {
        if (!emailId || emailId.trim().length === 0) {
            res.status(400).json({
                message: 'Bad request. Mandatory parameter missing in emailId'
            });
        }
        const user = await userModel.findOne({ emailId: emailId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if(!user.isAdmin){
            return res.status(403).json({message : 'Unauthorized: Only admins users are allowed to delete.'});
        }
        let data = await userModel.findOneAndDelete({ emailId: emailId });
        res.status(200).json({
            message: 'Document deleted successfully.',
            data : data
        });
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
}

//create a access token with jwt and eamil

exports.createJwtTokenByQueryEmail = async(req, res)=>{
    const emailId = req.query.emailId;

    if(!emailId){
        return res.status(400).json({ message: 'Bad request. Mandatory parameter missing in emailId'});
    }

    const accessToken = jwt.sign({emailId : emailId} ,process.env.SECRECT_KEY ,{expiresIn : '15m'});
    res.status(200).json({
        accessToken : accessToken
    });
}
