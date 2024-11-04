const axios = require("axios");
const { headersSymetricGenerator } = require("../helpers/headersGenerator");
const config = require("../config");

class AccountInquiry {
    static display(req, res) {
        let data = {}
        data.accessToken = config.accessToken || ""
        data.intrabanks = [
            {
                "beneficiaryBankCode": "014",
                "beneficiaryBankName": "BANK CENTRAL ASIA",
                "type": "Bank Transfer",
                "isBifast": true
            },
            {
                "beneficiaryBankCode": "009",
                "beneficiaryBankName": "BANK NEGARA INDONESIA",
                "type": "Bank Transfer",
                "isBifast": true
            },
            {
                "beneficiaryBankCode": "002",
                "beneficiaryBankName": "BANK RAKYAT INDONESIA",
                "type": "Bank Transfer",
                "isBifast": true
            },
            {
                "beneficiaryBankCode": "008",
                "beneficiaryBankName": "BANK MANDIRI",
                "type": "Bank Transfer",
                "isBifast": true
            },
            {
                "beneficiaryBankCode": "013",
                "beneficiaryBankName": "BANK PERMATA",
                "type": "Bank Transfer",
                "isBifast": true
            },
            {
                "beneficiaryBankCode": "022",
                "beneficiaryBankName": "BANK CIMB NIAGA",
                "type": "Bank Transfer",
                "isBifast": true
            }
          ]
        AccountInquiry.bankSelection((banks, err) => {
            if(err) {
                data.banks = [
                    {
                      "beneficiaryBankCode": "014",
                      "beneficiaryBankName": "BANK CENTRAL ASIA",
                      "type": "Bank Transfer",
                      "isBifast": true
                    },
                    {
                      "beneficiaryBankCode": "1012",
                      "beneficiaryBankName": "DANA",
                      "type": "E-Wallet",
                      "isBifast": false
                    }
                  ]
                res.render("account_inquiry.ejs", {data});
            }else{
                data.banks = banks
                res.render("account_inquiry.ejs", {data});
            }
        })
    }

    static bankSelection(cb){
        let date = new Date()
        let method = "POST"
        let duitkuDomain = config.sandboxDomain
        let endpoint = "/db/snap/v1.0/bank-list"
        let api = duitkuDomain + endpoint
        let accessToken = config.accessToken
        let randomNumber = Math.floor(100000000000000000000 + Math.random() * 900000000000000000000).toString()
        const body = {
            "accountNo": config.userId
        }
        const headers = headersSymetricGenerator(date, method, endpoint, body, accessToken, randomNumber )
        axios.post(api, body, {headers: headers })
            .then(response => {
                cb(response.data.banks);
            })
            .catch(err => {
                console.log("error cuy")
                console.log(err)
                cb({}, err);
            })
    }

    static inquiryInternal(req, res){
        let data = {}
        let date = new Date()
        let method = "POST"
        const duitkuDomain = config.sandboxDomain
        const endpoint = "/db/snap/v1.0/account-inquiry-internal"
        const api = duitkuDomain + endpoint
        let accessToken = req.body.token
        let randomNumber = Math.floor(100000000000000000000 + Math.random() * 900000000000000000000).toString()
        const body = {
            beneficiaryAccountNo: req.body.accountNo,
            partnerReferenceNo: randomNumber,
            additionalInfo: {
                customerReference: req.body.transNo,
                amount: {
                    value: req.body.amount + ".00",
                    currency: "IDR"
                },
                beneficiaryBankCode: req.body.bankCode
            }
        }
        const headers = headersSymetricGenerator(date, method, endpoint, body, accessToken, randomNumber )
        data.headers = JSON.stringify(headers, null, 2)
        data.body = JSON.stringify(body, null, 2)
        data.api = api
        axios.post(api, body, {headers: headers })
            .then(response => {
                // JSON.parse(response.data)
                data.response = JSON.stringify(response.data, null, 2)
                data.referenceNo = response.data.referenceNo
                data.accountNo = response.data.beneficiaryAccountNo
                data.accountName = response.data.beneficiaryAccountName
                data.bank = response.data.additionalInfo.beneficiaryBankName
                data.bankCode = response.data.additionalInfo.beneficiaryBankCode
                data.transferType = "intrabank"
                data.partnerReferenceNo = randomNumber
                data.token = accessToken
                data.amount = parseInt(response.data.additionalInfo.amount.value)
                res.render("account_inquiry_view.ejs", {data});
            }
            )
            .catch(err => {
                console.log(err.response.data)
                // res.json(err.response.data)
                data.response = JSON.stringify(err.response.data, null, 2)
                data.token = null
                res.render("account_inquiry_view.ejs", {data});
            })
    }

    static inquiry(req, res){
        let data = {}
        let date = new Date()
        let method = "POST"
        const duitkuDomain = config.sandboxDomain
        const endpoint = "/db/snap/v1.0/account-inquiry-external"
        const api = duitkuDomain + endpoint
        let accessToken = req.body.token
        let randomNumber = Math.floor(100000000000000000000 + Math.random() * 900000000000000000000).toString()
        const body = {
            beneficiaryAccountNo: req.body.accountNo,
            beneficiaryBankCode: req.body.bankCode,
            partnerReferenceNo: randomNumber,
            additionalInfo: {
                billType: req.body.transferType,
                amount: {
                    value: req.body.amount + ".00",
                    currency: "IDR"
                },
                customerReference: req.body.transNo
            }
        }
        const headers = headersSymetricGenerator(date, method, endpoint, body, accessToken, randomNumber )
        data.headers = JSON.stringify(headers, null, 2)
        data.body = JSON.stringify(body, null, 2)
        data.api = api
        axios.post(api, body, {headers: headers })
            .then(response => {
                // JSON.parse(response.data)
                data.response = JSON.stringify(response.data, null, 2)
                data.referenceNo = response.data.referenceNo
                data.accountNo = response.data.beneficiaryAccountNo
                data.accountName = response.data.beneficiaryAccountName
                data.bank = response.data.beneficiaryBankName
                data.bankCode = response.data.beneficiaryBankCode
                data.transferType = req.body.transferType
                data.partnerReferenceNo = randomNumber
                data.token = accessToken
                data.amount = parseInt(response.data.additionalInfo.amount.value)
                res.render("account_inquiry_view.ejs", {data});
            }
            )
            .catch(err => {
                console.log(err.response.data)
                // res.json(err.response.data)
                data.response = JSON.stringify(err.response.data, null, 2)
                data.token = null
                res.render("account_inquiry_view.ejs", {data});
            })
    }
}

module.exports = AccountInquiry;