module.exports = (req, res, next) => {
    if (!req.params.id) {
        return res.status(400)
            .json({
                status: 400, 
                err: {
                    message: 'No id informed',
                    name: 'NoId',
                }
            });
    }
    next();
}