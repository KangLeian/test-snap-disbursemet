const axios = require("axios");
const { headersSymetricGenerator } = require("../helpers/headersGenerator");
const config = require("../config");

class AccountInquiry {
    static display(req, res) {
        let data = {}
        data.accessToken = config.accessToken || ""
        AccountInquiry.bankSelection((banks, err) => {
            if(err) {
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

    static inquiry(req, res){
        let data = {}
        let date = new Date()
        let method = "POST"
        const duitkuDomain = config.sandboxDomain
        const endpoint = "/db/snap/v1.0/account-inquiry"
        const api = duitkuDomain + endpoint
        let accessToken = req.body.token
        let randomNumber = Math.floor(100000000000000000000 + Math.random() * 900000000000000000000).toString()
        const body = {
            beneficiaryAccountNo: req.body.accountNo,
            beneficiaryBankCode: JSON.parse(req.body.bankCode).beneficiaryBankCode,
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