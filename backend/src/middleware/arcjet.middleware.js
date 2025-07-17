import { aj } from "../config/arcjet.config.js";

//Arcjet middleware for rate limiting,bot protection and security

export const arcjetMiddleware = async(req,res,next)=>{
    try {
        //in try we will protect our api
        const decision = await aj.protect(req,{
            requested:1,//each request consumes 1 token
        });

        //handle denied requesr
        if(decision.isDenied()){
            if(decision.reason.isRateLimit()){
                return res.status(429).json({
                    error:"Too Many Requests",
                    message:"Rate limit exceeded.Please try again later",
                });
            } else if(decision.reason.isBot()){
                return res.status(403).json({
                    error:"Bot access denied",
                    message:"Automated requests are not allowed",
                });
            }
            else{
                return res.status(403).json({
                    error:"forbidden",
                    message:"Access denied by security policy",
                });
            }
        }

        //check for spoofed bots - these are bots which will act liek ahuman where it will be difficult for us to understand whether its human or not so this will be handled by arcjet to check for spoofed bots
        if(decision.results.some((result)=> result.reason.isBot() && result.reason.isSpoofed())){
            return res.status(403).json({
                error:"Spoofed bot detected",
                message:"Malicious bot activity detected",
            })

        } 
        next();
        
    } catch (error) {
        console.error("Arcjet middleware error:",error);
        //allow request to continue if Arcjet fails
        next();
        
    }
};
