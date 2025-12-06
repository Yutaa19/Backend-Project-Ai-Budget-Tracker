module.exports = (sequelize, DataTypes) => {
    const category = sequelize.define('Category', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        created_at: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    }, {
        tableName: 'categories',
        timestamps: true,

    });

    category.associate = (models) => {
        category.hasMany(models.Transaction, { foreignKey: 'category_id', as: 'transaction' })
    };
    return category;
}

