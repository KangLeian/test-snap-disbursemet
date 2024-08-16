const config = require("../config")
const { headersSymetricGenerator } = require("../helpers/headersGenerator")
const toIsoString = require("../helpers/toIsoString")
const axios = require("axios")

class Transfer {
    static main (req, res){
        let data = {}
        let date = new Date()
        let method = "POST"
        let duitkuDomain = config.sandboxDomain
        let endpoint = "/db/snap/v1.0/transfer-interbank"
        if(req.body.transferType == "RTGS"){
            endpoint = endpoint.split("-")[0] + "-rtgs"
        }
        if(req.body.transferType == "SKN"){
            endpoint = endpoint.split("-")[0] + "-skn"
        }
        if(req.body.transferType == "intrabank"){
            endpoint = endpoint.split("-")[0] + "-intrabank"
        }
        const api = duitkuDomain + endpoint
        let accessToken = req.body.token
        let randomNumber = Math.floor(100000000000000000000 + Math.random() * 900000000000000000000).toString()
        const body = Transfer.bodyTransferGenerator(req.body, date, req.body.transferType)
        const headers = headersSymetricGenerator(date, method, endpoint, body, accessToken, randomNumber )
        data.headers = JSON.stringify(headers, null, 2)
        data.body = JSON.stringify(body, null, 2)
        data.api = api
        axios.post(api, body, {headers: headers })
            .then(response => {
                // JSON.parse(response.data)
                data.response = JSON.stringify(response.data, null, 2)
                res.render("transfer.ejs", {data});
            }
            )
            .catch(err => {
                console.log(err)
                // res.json(err.response.data)
                data.response = JSON.stringify(err.response.data, null, 2)
                data.token = null
                res.render("transfer.ejs", {data});
            })
    }

    static bodyTransferGenerator(body, date, type){
        if(type == "RTGS" || type == "SKN"){
            return {
                partnerReferenceNo: body.partnerReferenceNo,
                beneficiaryAccountNo: body.accountNo,
                beneficiaryBankCode: body.bankCode,
                sourceAccountNo: config.userId,
                transactionDate: toIsoString(date),
                beneficiaryCustomerResidence: body.citizenship,
                beneficiaryCustomerType: body.beneficiaryType,
                amount: {
                    value: body.amount + ".00",
                    currency: "IDR"
                },
                additionalInfo: {
                    remark: body.remark
                }
                    
            }
        }else if(type == "intrabank"){
            return {
                partnerReferenceNo: body.partnerReferenceNo,
                beneficiaryAccountNo: body.accountNo,
                sourceAccountNo: config.userId,
                transactionDate: toIsoString(date),
                amount: {
                    value: body.amount + ".00",
                    currency: "IDR"
                },
                additionalInfo: {
                    beneficiaryBankCode: body.bankCode,
                    remark: body.remark
                }
                    
            }
        }else{
            return {
                partnerReferenceNo: body.partnerReferenceNo,
                beneficiaryAccountNo: body.accountNo,
                beneficiaryBankCode: body.bankCode,
                transactionDate: toIsoString(date),
                amount: {
                        value: body.amount + ".00",
                        currency: "IDR"
                    }
                ,
                sourceAccountNo: config.userId,
                additionalInfo: {
                    remark: body.remark
                }
            }
        }
    }
}

module.exports = Transfer