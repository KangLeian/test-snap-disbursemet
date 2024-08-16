const bodyParser = require('body-parser');
const Main = require('../controllers/main');
const Token = require('../controllers/token');
const AccountInquiry = require('../controllers/accountInquiry');
const Transfer = require('../controllers/transfer');
const TransactionStatus = require('../controllers/transactionStatus');
const Utilities = require('../controllers/utilities');
const EMoney = require('../controllers/eMoney');

const router = require('express').Router();

router.get('/', Main.display)
router.get('/getToken', Token.getToken)
router.post('/getToken', Token.getTokenFromDuitku)
router.get('/accountInquiry', AccountInquiry.display)
router.post('/accountInquiryInternal', AccountInquiry.inquiryInternal)
router.post('/accountInquiry', AccountInquiry.inquiry)
router.post('/transfer', Transfer.main)
router.get('/transactionStatus', TransactionStatus.display)
router.post('/transactionStatus', TransactionStatus.check)
router.get('/checkBalance', Utilities.balance)
router.post('/getBalance', Utilities.getBalance)
router.get('/getBankList', Utilities.bankList)
router.post('/getBankList', Utilities.getBankList)
router.get('/eMoney', EMoney.display)
router.post('/eMoney', EMoney.inquiry)
router.post('/topup', EMoney.topup)

module.exports = router