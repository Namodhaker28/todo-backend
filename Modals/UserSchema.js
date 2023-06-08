const mongoose=require('mongoose');
var validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const UserSchema =new  mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email address'
          }
    },
    phone:{
        type:String,
        required: true,
        minLength: [10,"number must be atleast 10 digits"],
        maxLength: [10,"number can not more then 10 digits"]
    },
    joinedOn: {
        type: Date,
        default: Date.now
      },
    password:{
        type: String,
        required: true,
        minLength: [4,"password must be atleast 4 digits"],
    },
    todos : [
        { type: mongoose.Types.ObjectId , ref: 'Todo' }
    ],
    tokens:[
        {
            token: {
                type: String,
            }
        }
    ]

   
})

UserSchema.pre("save", async function(next){
if(this.isModified("password"))
{
    this.password = await  bcrypt.hash(this.password,10);
}
next();
})

UserSchema.methods.genAuthToken = async function(){
    try {
        const token = jwt.sign({_id:this._id},process.env.SECRET_KEY,{expiresIn:"8h"})
        this.tokens=({token:token});
        await this.save()
        return token ;
    } catch (error) {
        console.log(error);
    }
}



module.exports = mongoose.model('User',UserSchema)