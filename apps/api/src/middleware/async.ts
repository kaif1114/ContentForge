import express, {Request, Response, NextFunction} from 'express'


//note: currently using express-async-errors to handle errors instead of this middleware

function asyncMiddleware(handler: Function){
 return async (req: Request, res: Response, next: NextFunction)=>{
    try {
       await handler(req, res, next)
    } catch (error) {
        next(error)
    }
 }
}
export default asyncMiddleware;