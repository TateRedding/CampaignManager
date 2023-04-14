const requireUser = ((req, res, next) => {
    if (!req.user) {
        res.status(401)
        res.send({
            error: 'UnauthorizedError',
            message: "You must be logged in to perform this action!"
        });
        return;
    }
    next();
})

module.exports = {
    requireUser
};
