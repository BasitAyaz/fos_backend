// server.js
require("dotenv").config()
const express = require('express');
const { getPool } = require('./config/db');
const SalesRoute = require("./routes/salesRoute");
const PurchaseRoute = require("./routes/purchaseRoute");
const TransactionRoute = require("./routes/transactionRoute");
const TransactionReportRoute = require("./routes/reports/itemtransaction");
const StockReportRoute = require("./routes/reports/stock")
const ItemsLookup = require("./routes/lookup/itemlookup")
const BunitsLookup = require("./routes/lookup/buintlookup")
const LocationLookup = require("./routes/lookup/locationlookup")
const IsegLookup = require("./routes/lookup/iseglookup")
const PeriodLookup = require("./routes/lookup/periodlookup")
const LoginRoute = require("./routes/auth/login")
const CreateUserRoute = require("./routes/auth/signup")
const DashboardRoute = require("./routes/dashboard")

const App = express();
App.use(express.json());


App.use("/api/sales", SalesRoute)
App.use("/api/purchase", PurchaseRoute)
App.use("/api/transaction", TransactionRoute)
App.use("/api/report/itemtransaction", TransactionReportRoute)
App.use("/api/report/stock", StockReportRoute)
App.use("/api/lookup/items", ItemsLookup)
App.use("/api/lookup/buinits", BunitsLookup)
App.use("/api/lookup/location", LocationLookup)
App.use("/api/lookup/iseg", IsegLookup)
App.use("/api/lookup/period", PeriodLookup)
App.use("/api/auth/createuser", CreateUserRoute)
App.use("/api/auth/login", LoginRoute)
App.use("/api/dashboard", DashboardRoute)

const PORT = 5000;

getPool().then((res) => {
    App.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}).catch((err) => {
    console.log(err)
})
