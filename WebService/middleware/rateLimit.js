import { errors } from "../lib/errors.js";

// Bounded process-local limiter. Distributed deployments need an ingress limiter too.
export function rateLimit(limit=30,windowMs=600000) {
  const attempts=new Map();
  return (req,_res,next)=>{
    const now=Date.now();
    for(const [key,value] of attempts)if(value.until<=now)attempts.delete(key);
    const key=req.ip||"unknown";
    const entry=attempts.get(key)||{count:0,until:now+windowMs};
    if(entry.count>=limit || (!attempts.has(key)&&attempts.size>=10000))return next(errors.rateLimited());
    entry.count++;attempts.set(key,entry);next();
  };
}
