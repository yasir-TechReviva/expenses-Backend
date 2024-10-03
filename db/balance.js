// db/balance.js
import db from "./connection.js"; // Your DB connection

const getBalance = async () => {
    const collection = db.collection("balance");
    const balance = await collection.findOne({});
    return balance ? balance.balance : 0; // Return 0 if no balance found
};

const updateBalance = async (newBalance) => {
    const collection = db.collection("balance");
    await collection.updateOne({}, { $set: { balance: newBalance } });
};

export { getBalance, updateBalance };
