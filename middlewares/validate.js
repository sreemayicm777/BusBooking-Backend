module.exports = (schema, property = 'body' ) =>{
    return (req, res, next) =>{
        const { error } = schema.validate(req[property]);

        if(error){
            res.status(400);
            throw new Error(error.details[0].message);
        }else {
            next(); 
        }
    }
}