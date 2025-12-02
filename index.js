// server.js
require("dotenv").config()
const express = require('express');
const { getPool } = require('./config/db');
const SalesRoute = require("./routes/salesRoute");
const PurchaseRoute = require("./routes/purchaseRoute");
const TransactionRoute = require("./routes/transactionRoute");
const TransactionReportRoute = require("./routes/reports/itemtransaction");
const StockReportRoute = require("./routes/reports/stock")
const LedgerReportRoute = require("./routes/reports/ledger")
const CustomerLedgerReportRoute = require("./routes/reports/customerledger")
const ItemsLookup = require("./routes/lookup/itemlookup")
const BunitsLookup = require("./routes/lookup/buintlookup")
const LocationLookup = require("./routes/lookup/locationlookup")
const IsegLookup = require("./routes/lookup/iseglookup")
const PeriodLookup = require("./routes/lookup/periodlookup")
const SupplierLookup = require("./routes/lookup/supplierlookup")
const CustomerLookup = require("./routes/lookup/customer")
const RolesLookup = require("./routes/lookup/roles")
const LoginRoute = require("./routes/auth/login")
const UserRoute = require("./routes/auth/users")
const CreateUserRoute = require("./routes/auth/signup")
const DashboardRoute = require("./routes/dashboard")
const CurrentPeriodRoute = require("./routes/currentperiod")
const RoleRoute = require("./routes/roleroute")

const App = express();
App.use(express.json());


// reports
App.use("/api/report/itemtransaction", TransactionReportRoute)
App.use("/api/report/stock", StockReportRoute)
App.use("/api/report/ledger", LedgerReportRoute)
App.use("/api/report/customerledger", CustomerLedgerReportRoute)

// lookups
App.use("/api/lookup/items", ItemsLookup)
App.use("/api/lookup/buinits", BunitsLookup)
App.use("/api/lookup/location", LocationLookup)
App.use("/api/lookup/iseg", IsegLookup)
App.use("/api/lookup/period", PeriodLookup)
App.use("/api/lookup/supplier", SupplierLookup)
App.use("/api/lookup/customer", CustomerLookup)
App.use("/api/lookup/roles", RolesLookup)


App.use("/api/sales", SalesRoute)
App.use("/api/purchase", PurchaseRoute)
App.use("/api/transaction", TransactionRoute)
App.use("/api/currentperiod", CurrentPeriodRoute)
App.use("/api/dashboard", DashboardRoute)
App.use("/api/roles", RoleRoute)

// Auth
App.use("/api/auth/createuser", CreateUserRoute)
App.use("/api/auth/login", LoginRoute)
App.use("/api/auth/users", UserRoute)

const PORT = 5000;

getPool().then((res) => {
    App.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}).catch((err) => {
    console.log(err)
})
