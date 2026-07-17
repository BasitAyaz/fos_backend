// server.js
require("dotenv").config()
const express = require('express');
const { getPool, getu2Pool } = require('./config/db');
const SalesRoute = require("./routes/salesRoute");
const u2SalesRoute = require("./u2_routes/salesRoute");
const PurchaseRoute = require("./routes/purchaseRoute");
const u2PurchaseRoute = require("./u2_routes/purchaseRoute");
const TransactionRoute = require("./routes/transactionRoute");
const u2TransactionRoute = require("./u2_routes/transactionRoute");
const TransactionReportRoute = require("./routes/reports/itemtransaction");
const u2TransactionReportRoute = require("./u2_routes/reports/itemtransaction");
const StockReportRoute = require("./routes/reports/stock")
const u2StockReportRoute = require("./u2_routes/reports/stock")
const LedgerReportRoute = require("./routes/reports/ledger")
const u2LedgerReportRoute = require("./u2_routes/reports/ledger")
const CustomerLedgerReportRoute = require("./routes/reports/customerledger")
const u2CustomerLedgerReportRoute = require("./u2_routes/reports/customerledger")
const ItemsLookup = require("./routes/lookup/itemlookup")
const u2ItemsLookup = require("./u2_routes/lookup/itemlookup")
const BunitsLookup = require("./routes/lookup/buintlookup")
const u2BunitsLookup = require("./u2_routes/lookup/buintlookup")
const LocationLookup = require("./routes/lookup/locationlookup")
const u2LocationLookup = require("./u2_routes/lookup/locationlookup")
const IsegLookup = require("./routes/lookup/iseglookup")
const u2IsegLookup = require("./u2_routes/lookup/iseglookup")
const PeriodLookup = require("./routes/lookup/periodlookup")
const u2PeriodLookup = require("./u2_routes/lookup/periodlookup")
const SupplierLookup = require("./routes/lookup/supplierlookup")
const u2SupplierLookup = require("./u2_routes/lookup/supplierlookup")
const CustomerLookup = require("./routes/lookup/customer")
const u2CustomerLookup = require("./u2_routes/lookup/customer")
const RolesLookup = require("./routes/lookup/roles")
const u2RolesLookup = require("./u2_routes/lookup/roles")
const LoginRoute = require("./routes/auth/login")
const u2LoginRoute = require("./u2_routes/auth/login")
const UserRoute = require("./routes/auth/users")
const u2UserRoute = require("./u2_routes/auth/users")
const CreateUserRoute = require("./routes/auth/signup")
const u2CreateUserRoute = require("./u2_routes/auth/signup")
const DashboardRoute = require("./routes/dashboard")
const u2DashboardRoute = require("./u2_routes/dashboard")
const CurrentPeriodRoute = require("./routes/currentperiod")
const u2CurrentPeriodRoute = require("./u2_routes/currentperiod")
const RoleRoute = require("./routes/roleroute")
const u2RoleRoute = require("./u2_routes/roleroute")

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



App.use("/api/u2/report/itemtransaction", u2TransactionReportRoute)
App.use("/api/u2/report/stock", u2StockReportRoute)
App.use("/api/u2/report/ledger", u2LedgerReportRoute)
App.use("/api/u2/report/customerledger", u2CustomerLedgerReportRoute)
App.use("/api/u2/lookup/items", u2ItemsLookup)
App.use("/api/u2/lookup/buinits", u2BunitsLookup)
App.use("/api/u2/lookup/location", u2LocationLookup)
App.use("/api/u2/lookup/iseg", u2IsegLookup)
App.use("/api/u2/lookup/period", u2PeriodLookup)
App.use("/api/u2/lookup/supplier", u2SupplierLookup)
App.use("/api/u2/lookup/customer", u2CustomerLookup)
App.use("/api/u2/lookup/roles", u2RolesLookup)
App.use("/api/u2/sales", u2SalesRoute)
App.use("/api/u2/purchase", u2PurchaseRoute)
App.use("/api/u2/transaction", u2TransactionRoute)
App.use("/api/u2/currentperiod", u2CurrentPeriodRoute)
App.use("/api/u2/dashboard", u2DashboardRoute)
App.use("/api/u2/roles", u2RoleRoute)
App.use("/api/u2/auth/createuser", u2CreateUserRoute)
App.use("/api/u2/auth/login", u2LoginRoute)
App.use("/api/u2/auth/users", u2UserRoute)


const PORT = 5000;

getPool().then(async (res) => {
    await getu2Pool()
    App.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}).catch((err) => {
    console.log(err)
})
