// src/models/associations.js

import { User } from './User.js';
import { Category } from './Category.js';
import { Transaction } from './Transaction.js';


// User -> Category
User.hasMany(Category, { foreignKey: 'user_id', as: 'categories' });
Category.belongsTo(User, { foreignKey: 'user_id', as: 'owner' });

// User -> Transaction
User.hasMany(Transaction, { foreignKey: 'user_id', as: 'transactions' });
Transaction.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Category -> Transaction
Category.hasMany(Transaction, { foreignKey: 'category_id', as: 'transactions' });
Transaction.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

console.log("✅ Sequelize Modelleri başarıyla ilişkilendirildi.");
