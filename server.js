import express from "express";
import cors from "cors";
import records from "./routes/record.js";
import balanceRoutes from "./routes/balance.js"; // Adjust the path accordingly



const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/record", records);
app.use("/balance", balanceRoutes);

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
