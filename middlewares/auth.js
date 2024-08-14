const { getUser }=require("../service/auth");
function checkAuthentication(req,res,next)
{
  req.user=null;
  const tokenValue=req.cookies?.uid;
  if(!tokenValue) return next();
  const user=getUser(tokenValue);
  req.user=user;
  next();
}
function restrictTo(roles=[])
{
  return function(req,res,next)
  {
    if(!req.user) return res.redirect("/login");
    if(!roles.includes(req.user.role)) 
      return res.end("Unauthorized");
    return next();
  };
}

module.exports={
  checkAuthentication,
  restrictTo,
};


