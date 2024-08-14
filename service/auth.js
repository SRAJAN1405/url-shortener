const jwt=require("jsonwebtoken")
const secretKey=process.env.SECRET_KEY;
function setUser(user)
{
//    console.log(user);
   return jwt.sign({
    _id:user._id,
    email:user.email,
    role:user.role,
   },
   secretKey
   );
}
function getUser(token)
{
    if(!token) return null;
    try{
        // console.log(jwt.verify(token,secretKey));
    return jwt.verify(token,secretKey);
   }
   catch(error){
   return null;
   }
}
module.exports={
    setUser,
    getUser,
};