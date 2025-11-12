// server.js
require("dotenv").config()
const express = require('express');
const { getPool } = require('./config/db');
const SalesRoute = require("./routes/salesRoute");
const PurchaseRoute = require("./routes/purchaseRoute");
const TransactionRoute = require("./routes/transactionRoute");
const TransactionReportRoute = require("./routes/reports/itemtransaction");
const ItemsLookup = require("./routes/lookup/itemlookup")
const BunitsLookup = require("./routes/lookup/buintlookup")

const App = express();
App.use(express.json());


App.use("/api/sales", SalesRoute)
App.use("/api/purchase", PurchaseRoute)
App.use("/api/transaction", TransactionRoute)
App.use("/api/report/itemtransaction", TransactionReportRoute)
App.use("/api/lookup/items", ItemsLookup)
App.use("/api/lookup/buinits", BunitsLookup)

const PORT = 5000;

getPool().then((res) => {
    App.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}).catch((err) => {
    console.log(err)
})
