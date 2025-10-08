import { User } from './User.js';
import { Category } from './Category.js';
import { Transaction } from './Transaction.js';

// 1. User ve Category: Bir Kullanıcının birden çok Kategorisi olur.
User.hasMany(Category, { foreignKey: 'userId' });
Category.belongsTo(User, { foreignKey: 'userId' });

// 2. User ve Transaction: Bir Kullanıcının birden çok İşlemi olur.
User.hasMany(Transaction, { foreignKey: 'userId' });
Transaction.belongsTo(User, { foreignKey: 'userId' });

// 3. Category ve Transaction: Bir Kategorinin birden çok İşlemi olur.
Category.hasMany(Transaction, { foreignKey: 'categoryId' });
Transaction.belongsTo(Category, { foreignKey: 'categoryId' });

console.log("✅ Sequelize Modelleri başarıyla ilişkilendirildi.");

// Modellerin dışa aktarılmasına gerek yoktur, ilişkilendirmeler burada kurulmuştur.
