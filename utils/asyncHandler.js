// usually arrow function
// const fucntion ()=>{ }
// to pass a function inside arrow function
// const function = (fn) => async(req,res,next) => {
    
// }

// Try Catch Approach

// const asyncHandler = (fn) => async (req, res, next) => {
//   try {
//     await fn(req, res, next)
//   } catch (error) {
//     res.status(err.code || 500).json({
//       success: false,
//       message: err.message
//     })
//   }
// }

//Promise Approach
const asyncHandler = {requestHandler} => {
   (req, res, next) => {
    Promise.resolve(requestHandler(req,res,next)).
    catch((err) => next(err))
    } 
}