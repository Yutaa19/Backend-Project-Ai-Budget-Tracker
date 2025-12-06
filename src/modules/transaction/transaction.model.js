module.exports = (sequelize, DataTypes) => {
    const Transaction = sequelize.define('Transaction', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        type: {
            type: DataTypes.ENUM('income', 'expense'),
            allownull: false
        },
        amaount: {
            type: DataTypes.STRING,
            allownull: false
        },
        date: {
            type: DataTypes.DATE,
            allownull: true

        },
        note: {
            type: DataTypes.TEXT,
            allownull: true

        },
        user_id: {
            type: DataTypes.STRING,
            allownull: false
        },
        category_id: {
            type: DataTypes.INTEGER,
            allownull: false
        },
        created_at: {
            allownull: false,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        updated_at: {
            allownull: false,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    }, {
        tableName: 'transaction',
        timestamp: true,
        underscored: true
    });

    Transaction.associate = (models) => {
        Transaction.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
        Transaction.belongsTo(models.Category, { foreignKey: 'category_id', as: 'category' });
    };

    return Transaction

}