import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt timestamps
    tableName: 'users', // Optional: sets the table name explicitly
});

// You can define additional model methods here if necessary
User.prototype.toJSON = function() {
    const values = {...this.get() };
    delete values.password; // Exclude password from the returned user object
    return values;
};

export default User;