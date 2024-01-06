const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName :{
        type : String 
    },

    lastName :{
        type : String
    },
    emailId : {
        type : String 
    },
    phoneNumber :{
        type : Number
    },
    isAdmin : {
        type : Boolean,
        default: false
    },
    education :[
        {  
            name : {
                type : String
            },
            completionYear :{
                type : Number
            },
            type:{
                type : String,
            },
            _id : false
        }
    ],

    hobby : {
        indoor:[
            {
                name:{
                    type : String
                },
                currentlyPlaying : {
                    type : Boolean
                },
                _id : false
            }
        ],
        outdoor : [
            {
                name:{
                    type : String
                },
                currentlyPlaying : {
                    type : Boolean
                },
                _id : false
            }
        ]
    }
    
});

userSchema.index({emailId : 'unique'});
const userModel = mongoose.model('user', userSchema);
module.exports = userModel