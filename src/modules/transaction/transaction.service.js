const { includes, number } = require('zod/v4');
const { Transaction, User, Category } = require('../../../models');
const BadrequestError = require('../../errors/BadRequestError');
const { where } = require('sequelize');
const Notfound = require('../../errors/NotFoundError');

class TransactionSercive {
    async getAllByUser(userId, page = 1, limit = 10, seacrh = "") {
        const offset = (page - 1) * limit;
        const whereClause = {
            user_id: userId
        }

        if (seacrh) {
            whereClause[Op.or] = [
                { note: { [Op.like]: `%${seacrh}%` } },
                { desc: { [Op.like]: `%${seacrh}%` } },
            ]
        }

        const { count, rows } = await Transaction.FindAndCountAll({
            where: whereClause,
            include: [
                {
                    model: Category,
                    attributes: ['name', 'description'],
                    as: 'category',
                    require: false
                },
                {
                    model: User,
                    attributes: ['id', 'name', 'email', 'number'],
                    as: 'user',
                    require: false
                }

            ],
            order: [['date', 'DESC']],
            limit,
            offset,
            distinct: true,
        })

        return {
            data: rows,
            pagination: {
                total: count,
                page,
                limit,
                totalPage: Math.ceil(count / limit)
            }
        }


    }

    async getById(id) {
        const transaction = await Transaction.findOne({
            where: { id },
            include: [
                {
                    model: Category,
                    attributes: ['name', 'description'],
                    as: 'category',
                    require: false
                },
                {
                    model: User,
                    attributes: ['id', 'name', 'email', 'number'],
                    as: 'user',
                    require: false
                }

            ]
        });

        if (!transaction) throw new Notfound("Data Transaksi Tidak DI Temukan")
        return transaction
    }

    async create(data) {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

        const transactions = await Transaction.findAll({
            where: {
                user_id: data.user_id,
                date: {
                    [Op.between]: [startOfMonth, endOfMonth]
                }
            }
        });

        let totalIncome = 0;
        let totalExpense = 0;

        for (const tx of transactions) {
            const amount = parseInt(tx.amount);

            if (tx.type === "income") totalIncome += amount;
            if (tx.type === "expense") totalExpense += amount
        }

        const amountToAdd = parseInt(data.amount);

        if (
            data.type === "expense" &&
            totalIncome < totalExpense + amountToAdd

        ) {
            throw new BadrequestError("Income Bulan ini tidak mencukupi")
        }

        return await Transaction.create(data);
    }

    async update(id, data) {
        const transaction = await Transaction.findByPk(id);
        if (!transaction) throw new Notfound("Transaksi Tidak DI temukan");
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

        const transactions = await Transaction.findAll({
            where: {
                user_id: data.user_id,
                date: {
                    [Op.between]: [startOfMonth, endOfMonth]
                }
            }
        });

        let totalIncome = 0;
        let totalExpense = 0;

        for (const tx of transactions) {
            const amount = parseInt(tx.amount);

            if (tx.type === "income") totalIncome += amount;
            if (tx.type === "expense") totalExpense += amount
        }

        const amountToAdd = parseInt(data.amount);

        if (
            data.type === "expense" &&
            totalIncome < totalExpense + amountToAdd

        ) {
            throw new BadrequestError("Income Bulan ini tidak mencukupi")
        }

        return await transaction.update(data);
    }

    async delete(id) {
        const transaction = await Transaction.findByPk(id);
        if (!transaction) throw new Notfound("Transaksi Tidak DI temukan");
        await transaction.destroy();
        return true

    }

    async getMontlySummary(userId) {

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

        const transactions = await Transaction.findAll({
            where: {
                user_id: userId,
                date: {
                    [Op.between]: [startOfMonth, endOfMonth]
                }
            }
        });

        let totalIncome = 0;
        let totalExpense = 0;

        for (const tx of transactions) {
            const amount = parseInt(tx.amount);

            if (tx.type === "income") totalIncome += amount;
            if (tx.type === "expense") totalExpense += amount
        }

        const balance = totalIncome - totalExpense;
        const saving = Math.florr(
            Math.max(0, totalIncome - totalExpense) * 0.3 + totalIncome * 0.05
        );

        return {
            income: totalIncome,
            expense: totalExpense,
            balance,
            saving
        }




    }

    async getMontlyChart(userId) {

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)


        const transactions = await Transaction.findAll({
            where: {
                user_id: data.user_id,
                date: {
                    [Op.between]: [startOfMonth, endOfMonth]
                }
            }
        });

        const daysInMonth = endOfMonth.getDate();
        const chartData = [];

        for (let daya = 1; day <= daysInMonth; day++) {
            chartData.push({
                date: `${now.getFullYear()}=${String(now.getMonth() + 1).padStart(2, "0")}`,
                income: 0,
                expense: 0
            });
        }

        for (const tx of transactions) {
            const date = new Date(tx.date);
            const day = date.getDate();
            const amount = parseInt(tx.amount);

            if(chartData[day - 1]) {
             if(tx.type === "income") chartData[day - 1].income += amount;
             if(tx.type === "expense") chartData[day - 1].expense += amount;

            }
        }

        return chartData;
    }

    async getTodayTransactions (userId) {
        const today = new Date();
        today.setHours(0,0,0,0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 99, 999);

         const transactions = await Transaction.findAll({
            where: {
                user_id: data.user_id,
                date: {
                    [Op.between]: [today, endOfDay]
                }
            },
            order: [['date', 'DESC']],
            include: [
                {
                    model: Category,
                    attributes: ['name', 'description'],
                    as: 'category',
                    require: false
                },
                {
                    model: User,
                    attributes: ['id', 'name', 'email', 'number'],
                    as: 'user',
                    require: false
                }

            ]
        });

        return transactions;



    }

    async getTodayExpenseState(userId) {
         const today = new Date();
        today.setHours(0,0,0,0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 99, 999);

         const transactions = await Transaction.findAll({
            where: {
                user_id: userId,
                type: 'expense',
                date: {
                    [Op.between]: [today, endOfDay]
                }
            },
            order: [['date', 'DESC']],
            
        });


          const total = transactions.reduce((sum, tx ) => sum+ parseInt(tx.amount), 0)

          return {
            totalExpense: total,
            count: transactions.length
          }

    }

}

module.exports = new TransactionSercive();