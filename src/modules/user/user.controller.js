const userService = require('./user.service')
const Notfound = require('../../errors/NotFoundError');
const { success } = require('zod/v4');
class UseController {
    async getAll(req, res, next) {
        try {
            const users = await userService.getAll();
            if (users.length === 0) throw new Notfound("Data user Belum ada")
            res.json({
                success: true,
                message: 'user berhasil di dapat!', data: users,
                data: users

            })
        } catch (err) {
            next(err)
        }

    }
    async getById(req, res, next) {
        try {
            const user = await userService.getById();
            if (!user) throw new Notfound("Data user belum ada");
            res.json({
                success: true,
                message: "user berhasil di dapat!", data: user,
                data: user
            })

        } catch (err) {
            next(err)
        }
    }
    async create(req, res, next) {
        try {
            const user = await userService.create(req.body);
            res.status(201).json({
                success: true,
                message: "data user berhasil di create",
                data: user
            });

        } catch (err) {
            next(err)
        }
    }
    async update(req, res, next) {
        try {
            const user = await userService.update(req.params.id, req.body)
            if(!user) throw new Notfound("data user tidak di temukan")
                res.status(200).json({
            success: true,
            message: "data user berhasil di update",
            data: user
        });


        } catch (err) {
            next(err)
        }

    }
    async delete(req, res, next) {
        try {
            const user = await userService.delete(req.params.id)
            if(!user) throw new Notfound("data user tidak di temukan")
            res.status(200).json({
            success: true,
            message: "data user berhasil di delete"
        });
        } catch (err) {
            next(err)
        }

    }
}

module.exports = new UseController();