import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {

    let token;

    const refreshToken = req.cookies.refreshToken;
    //console.log(refreshToken);
    
    if (refreshToken) {
        token = refreshToken;
    } else {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.json({ message: "No auth header or refresh token found" });
        }
        token = authHeader.split(" ")[1];
    }
    //console.log(token);

    try {
        const verifiedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        if (!verifiedToken) {
            return res.json({ message: "Token not verified" });
        }
        req.user = verifiedToken;
        next();
    } catch (error) {
        return res.json({ message: "Error: something is wrong", error });
    }
};