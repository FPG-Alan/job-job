module.exports = function requireRole(role) {
    return function (req, res, next) {
        if (!req.user) return res.sendStatus(401);

        var appMetadata = req.user.app_metadata || {};
        var roles = appMetadata.roles || [];

        if (roles.indexOf(role) != -1) {
            next();
        } else {
            return res.status(401).send({
                header: "This service is Admin-only"
            });
        }
    }
};