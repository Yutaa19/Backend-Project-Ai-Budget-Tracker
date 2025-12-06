const authService = require('./auth.service');

class AuthController {
    async register(req, res, next) {
        try {
            const data = req.body;
            const result = await authService.register(data);
            res.status(201).json({
                success: true,
                message: 'Register berhasil',
                data: result
            });
        } catch(err) {
            next(err)
        }
    }

    async login(req, res, next) {
        try {
            const data = req.body;
            const result = await authService.login(data);
            res.status(200).json({
                success: true,
                message: 'Login berhasil',
                data: result
            });
        } catch(err) {
            next(err)
        }
    }
    async profile(req, res, next) {
        try {
            const userId = req.userId;
            const user = await authService.profile(userId);



            res.status(200).json({
                success: true,
                message: 'Profile berhasil di ambil',
                data: user
                
            });
        } catch(err) {
            next(err)
        }
    }
}

module.exports = new AuthController();