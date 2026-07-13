export const errorHandler = (err, req, res, next)=>{
    console.log('Error', err);

    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal server error';

    // Handle Mongoose validation errors
    if(err.name === 'ValidationError'){
        statusCode = 400;
        message = Object.values(err.errors).map(e => e.message).join(', ');   
    }

    // Handle duplicate key errors 
    if(err.code === 11000){
        statusCode = 400;
        const field = Object.keys(err.keyPattern)[0];
        message = `${field} already exists`;    
    }

 res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};  