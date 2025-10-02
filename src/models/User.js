import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

// Kullanıcı modelini tek seferde dışa aktararak tanımlıyoruz.
export const User = sequelize.define('User', {
  id: {
   type: DataTypes.UUID,
     defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
   },
  username: {
     type: DataTypes.STRING,
     allowNull: false,
    unique: true
   },
   email: {
     type: DataTypes.STRING,
    allowNull: false,
     unique: true
  },
   password_hash: {
    type: DataTypes.STRING,
    allowNull: false
   },
 //
}, {
    tableName: 'users',
    timestamps: true
});


