const { User } = require('../database/models');

class DashboardController {
    async myProfile(req, res, next) {
        try {
            const user = await User.scope(null).findByPk(req.user.id);
            if (!user) return res.status(404).json({ message: 'User not found' });
            res.json({ user: user.toJSON() });
        } catch (err) {
            next (err);
        }
    }
}

module.exports = new DashboardController();