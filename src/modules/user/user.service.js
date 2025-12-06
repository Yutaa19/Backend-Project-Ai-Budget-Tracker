const { where } = require('sequelize');
const { User } = require('../../../models');
const BadRequestError = require('../../errors/BadRequestError')
const bcrypt = require('bcrypt');
const ServerError = require('../../errors/ServerError')
const Notfound = require('../../errors/NotFoundError');

class userService {
    constructor() {
        this.SALT_ROUNDS = 10;
    }

    async getAll() {
        return await User.findAll({attribute: { exclude: ['password']}});
    }

    async getById() {
        return await User.findByPk(id, { attribute: {exclude: ['password'] }})
    }
    async create(data) {
        const existingUser = await User.findOne({
            where: {email: data.email}
        });
        if(existingUser) {
            throw new BadRequestError("Email sudah terdaftar");
        }
    
    const hash = await bcrypt.hash(data.password, this.SALT_ROUNDS);
    const user = await User.create({ ...data, password: hash});
    const userjson = user.toJSON();
    delete userjson.password;

    return userjson
    }

    async update(id, data) {
        const user = await User.findByPk(id);
        if(!user) throw new Notfound("user tidak di temukan");

        if(data.email && data.email !== user.email){
            const existingUser = await User.findOne({
                where: {email: data.email}
            });

        if(existingUser) {
            throw new BadRequestError("Email sudah di pakai")
        }
        }

        if(data.password) {
            data.password = await bcrypt.hash(data.password, this.SALT_ROUNDS);

        } else {
            delete data.password;
        }

        try {
            await User.update(data, {
                where: {id:id},
                validate: true});
        } catch(err) {
            console.error("error", err);
            const message = err.errors?.map(e => e.message) || [err.message];
            throw new ServerError("gagal update user: " + message.join(', '));
        }

        const userJson = user.toJSON();
        delete userJson.password;
        return userJson;
    }

    async delete(id) {
        const user = await User.findByPk(id);
        if(!user) return null;
        await user.destroy();
        return true
    }
 

}

module.exports = new userService();