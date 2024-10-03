import express from "express";
import db from "../db/connection.js"; // Import your DB connection

const router = express.Router();

// Get the current balance
router.get("/", async (req, res) => {
  try {
    const collection = db.collection("balance");
    const result = await collection.findOne({}); // Assuming only one document exists for balance

    if (!result) {
      return res.status(404).send({ message: "Balance not found" });
    }
    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving balance");
  }
});

// Update the balance (add to it)
router.post("/", async (req, res) => {
  try {
    const amount = req.body.amount;

    if (typeof amount !== 'number') {
      return res.status(400).send({ message: "Amount must be a number" });
    }

    const collection = db.collection("balance");
    const currentBalance = await collection.findOne({});
    
    if (!currentBalance) {
      await collection.insertOne({ balance: amount }); // Create new balance document
      return res.status(201).send({ balance: amount });
    } else {
      const newBalance = currentBalance.balance + amount;
      await collection.updateOne({}, { $set: { balance: newBalance } });
      res.status(200).send({ balance: newBalance });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating balance");
  }
});

export default router;
