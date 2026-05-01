import jwt from 'jsonwebtoken'
//admin authentication middleware

const authAdmin = async (req, res, next) => {
    try {
        let token = req.headers.token
        if(!token){
            return res.json({
                success: false,
                message: "Not authorized user, login again!"
            })
        }
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        req.adminId = token_decode.id
        next();
    } catch (err) {
        console.log(err)
        res.json({
            success: false,
            message:err.message
        })
    }
}

export default authAdmin