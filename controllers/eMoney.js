const axios = require("axios");
const { headersSymetricGenerator } = require("../helpers/headersGenerator");
const config = require("../config");

class EMoney {
    static display(req, res){
        let data = {}
        data.accessToken = config.accessToken || ""
        EMoney.eMoneySelection((eMoney, err) => {
            if(err) {
                console.log(err)
            }else{
                data.eMoney = eMoney || []
            }
            res.render("e_money.ejs", {data});
        })
    }
    
    static eMoneySelection(cb){
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
        let duitkuDomain = config.sandboxDomain
        let endpoint = "/db/snap/v1.0/emoney/account-inquiry"
        let api = duitkuDomain + endpoint
        let accessToken = req.body.token
        let randomNumber = Math.floor(100000000000000000000 + Math.random() * 900000000000000000000).toString()
        const body = {
            partnerReferenceNo: randomNumber,
            customerNumber: req.body.accountNo,
            amount: {
                value: req.body.amount + ".00",
                currency: "IDR"
            },
            additionalInfo: {
                beneficiaryBankCode: req.body.eMoney,
                customerReference: req.body.transNo
            }
        }
        // console.log(req.body)
        const headers = headersSymetricGenerator(date, method, endpoint, body, accessToken, randomNumber )
        data.headers = JSON.stringify(headers, null, 2)
        data.body = JSON.stringify(body, null, 2)
        data.api = api
        axios.post(api, body, {headers: headers })
            .then(response => {
                // JSON.parse(response.data)
                data.response = JSON.stringify(response.data, null, 2)
                data.partnerReferenceNo = response.data.partnerReferenceNo
                data.referenceNo = response.data.referenceNo
                data.customerName = response.data.customerName
                data.customerNumber = response.data.customerNumber
                data.amount = response.data.amount.value.split(".")[0]
                data.beneficiaryBankCode = response.data.additionalInfo.beneficiaryBankCode
                data.beneficiaryBankName = response.data.additionalInfo.beneficiaryBankName
                data.token = accessToken
                data.accountNo = req.body.accountNo
                res.render("e_money_inquiry.ejs", {data});
            }
            )
            .catch(err => {
                console.log(err.response.data)
                // res.json(err.response.data)
                data.response = JSON.stringify(err.response.data, null, 2)
                data.token = null
                res.render("e_money_inquiry.ejs", {data});
            })
    }

    static topup(req, res){
        let data = {}
        let date = new Date()
        let method = "POST"
        let duitkuDomain = config.sandboxDomain
        let endpoint = "/db/snap/v1.0/emoney/topup"
        let api = duitkuDomain + endpoint
        let accessToken = req.body.token
        let randomNumber = Math.floor(100000000000000000000 + Math.random() * 900000000000000000000).toString()
        const body = {
            partnerReferenceNo: req.body.partnerReferenceNo,
            customerNumber: req.body.accountNo,
            amount: {
                value: req.body.amount + ".00",
                currency: "IDR"
            },
            additionalInfo: {
                beneficiaryBankCode: req.body.beneficiaryBankCode,
                remark: req.body.remark
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
                res.render("e_money_transfer.ejs", {data});
            }
            )
            .catch(err => {
                console.log(err.response.data)
                // res.json(err.response.data)
                data.response = JSON.stringify(err.response.data, null, 2)
                data.token = null
                res.render("e_money_transfer.ejs", {data});
            })
    }
}

module.exports = EMoney