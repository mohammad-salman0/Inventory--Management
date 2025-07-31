const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');


router.get('/summary', dashboardController.getSalesSummary);
router.get('/low-stock', dashboardController.getLowStockAlerts);

module.exports = router;
