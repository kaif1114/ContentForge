//note: currently using express-async-errors to handle errors instead of this middleware

function asyncMiddleware(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}
export default asyncMiddleware;
