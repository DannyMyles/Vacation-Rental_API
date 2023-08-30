const jwt=require('jsonwebtoken');
const Session = require('../models/Session');

const getToken=async(user)=>{
    const token = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET, {
      expiresIn:"7d"
    });
  
    const exist_session = await Session.findOne({ user: user._id });
    if (exist_session) {
    await Session.findOneAndUpdate(
        { _id: exist_session._id },
        {
          token: token,
          expiresAt: new Date(Date.now() + process.env.SESSION_EXPIRES_IN * 1000),
        },
        {
          new: true,
          runValidators: false,
          userFindANdModify: false,
        }
      );
    }
    else{
      
        const new_session = new Session({
          user: user._id,
          token: token,
          expiresAt: new Date(Date.now() + process.env.SESSION_EXPIRES_IN * 1000),
        });
        await new_session.save();
      
    }
  
    return token;
  
  
  }
  module.exports=getToken;