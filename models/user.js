const mongoose=require("mongoose");
const passportLocalMongoose=require("passport-local-mongoose");
// passport-local-schema will automaticalyy add username
const userSchema= new mongoose.Schema({
    email:{
        type:String,
        required:true
    }
});
userSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model('User',userSchema);