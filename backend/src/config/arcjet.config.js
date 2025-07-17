import arcjet, {tokenBucket,shield,detectBot} from "@arcjet/node";
import {ENV} from "../config/env.config.js";


export const aj = arcjet({
    key:ENV.ARCJET_KEY,
    characteristics:["ip.src"],
    rules:[
        //shield protect your app from common attachs e.g SQL,injections,CSRF attacks ect..
        shield({mode:"LIVE"}),

        //bot detection - block all bots except search engines
        detectBot({
            mode:"LIVE",
            allow:[
                "CATEGORY:SEARCH_ENGINE"
            ],
        }),


        //rate limiting with token bucket algorithm
        tokenBucket({
            mode:"LIVE",
            refillRate:10,//tokens added per interval
            interval:10,//interval in seconds(10 seconds)
            capacity:15,//maximum tokens in bucket
        })

    ],
})