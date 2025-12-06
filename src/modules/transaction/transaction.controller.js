const { success } = require('zod/v4');
const BadrequestError = require('../../errors/BadRequestError');
const ForbiddenError = require('../../errors/ForbiddenError');
const TransactionSercive = require('./transaction.service');

class TransactionController {
    async getAll(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const seacrh = req.query.seacrh || "";

            const result = await TransactionSercive.getAllByUser(req.user_id, page, limit, seacrh)
                res.json({
                    success: true,
                    message: "Daftra transaksi kamu",
                    data: result.data,
                    pagination: result.pagination,
                })
        } catch (error) {
            next(error);

        }
    }

    async getById(req, res, next) {

        try{
            const transaction  = await TransactionSercive.getById(req.params.id);
            if(transaction.user_id !== req.userId) {
                return ForbiddenError("kamu tidak bisa akses transaksi ini")
            }

            res.status(200).json({
                success: true,
                message: "Transaksi Di temukan",
                data: transaction
            })

        } catch(error) {
            next(error);

        }

    }
    async create(req, res, next) {

        try{

            const data = {
                ...req.body,
                user_id: req.userId
            }

            const transaction = await TransactionSercive.create(data);
            res.status(201).json({
                success: true,
                message: "Transaksi sudah di buat",
                data: transaction
            })

        } catch(error) {
            next(error);

        }

    }
    async update(req, res, next) {

        try{
            const transaction  = await TransactionSercive.getById(req.params.id);
             if(transaction.user_id !== req.userId) {
                throw new ForbiddenError("kamu tidak bisa akses transaksi ini")
            }

            const data = {...req.body}
            delete data.user_id;

            await TransactionSercive.update(req.params.id, data)
               res.status(200).json({
                success: true,
                message: "Transaksi sudah di update"
            })

        } catch(error) {
            next(error);

        }

    }
    async delete(req, res, next) {
       try{
         await TransactionSercive.delete(req.params.id); 
          res.status(200).json({
                success: true,
                message: "Transaksi sudah di hapus"
            })

        } catch(error) {
            next(error);

        }

    }
    async getMonthlySummary(req, res, next) {

        try{
            const data = await TransactionSercive.getMontlySummary(req.userId);
            res.status(200).json({
                success: true,
                message: "Sumaary data sudah di update", data 
            })

        } catch(error) {
            next(error);

        }

    }
    async getMonthlyChart(req, res, next) {

        try{
              const data = await TransactionSercive.getMonthlyChart(req.userId);
            res.status(200).json({
                success: true,
                message: "Chart data sudah di update", data 
            })

        } catch(error) {
            next(error);

        }

    }
    async getTodayTransactions(req, res, next) {

        try{
               const data = await TransactionSercive.getTodayTransactions(req.userId);
            res.status(200).json({
                success: true,
                message: "Data Transaksi hari ini berhasil di ambil", data 
            })

        } catch(error) {
            next(error);

        }

    }
    async getTodayExpense(req, res, next) {

        try{
                const data = await TransactionSercive.getTodayExpense(req.userId);
            res.status(200).json({
                success: true,
                message: "Data Pengeluaran hari ini berhasil di ambil", data 
            })

        } catch(error) {
            next(error);

        }

    }
}

module.exports = new TransactionController();