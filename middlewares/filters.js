
const Filters = (req,res,next)=>{
const isActive = req.query
const filter = {};
if(isActive){
filter.isActive = true
}
req.filter = filter
next()
}

module.exports = Filters