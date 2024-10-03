import express from "express";
import db from "../db/connection.js";
import { getBalance, updateBalance } from "../db/balance.js"; // Import balance functions

const router = express.Router();

// Get all records
router.get("/", async (req, res) => {
    try {
        const collection = db.collection("records"); // Assuming the collection name is 'records'
        const results = await collection.find({}).toArray(); // Retrieve all records as an array
        res.status(200).send(results); // Send the records in the response
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching records"); // Handle errors
    }
});

// Add a new record and deduct from balance
router.post("/", async (req, res) => {
    try {
        const { name, rate, date } = req.body;

        // Validate rate
        if (typeof rate !== 'number' || rate <= 0) {
            return res.status(400).send("Rate must be a positive number.");
        }

        // Validate date
        if (!date || isNaN(new Date(date).getTime())) {
            return res.status(400).send("Invalid date.");
        }

        const currentBalance = await getBalance();
        if (currentBalance < rate) {
            return res.status(400).send("Insufficient balance.");
        }

        // Insert the record
        const collection = db.collection("records");
        await collection.insertOne({ name, rate, date: new Date(date) }); // Store date as a Date object

        // Update the balance
        const newBalance = currentBalance - rate;
        await updateBalance(newBalance);

        res.status(201).send({ name, rate, date, balance: newBalance });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error adding record");
    }
});

export default router;
