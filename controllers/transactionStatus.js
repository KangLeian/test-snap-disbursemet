const axios = require("axios");
const { headersSymetricGenerator } = require("../helpers/headersGenerator");
const config = require("../config");

class TransactionStatus{
    static display(req, res){
        let data = {}
        data.accessToken = config.accessToken || ""
        res.render("transaction_status.ejs", {data});
    }

    static check(req, res){
        let data = {}
        let date = new Date()
        let method = "POST"
        let duitkuDomain = config.sandboxDomain
        let endpoint = "/db/snap/v1.0/transfer/status"
        if(req.body.transferMethod == "38"){
            endpoint = "/db/snap/v1.0/emoney/topup-status"
        }
        const api = duitkuDomain + endpoint
        let accessToken = req.body.token
        let randomNumber = Math.floor(100000000000000000000 + Math.random() * 900000000000000000000).toString()
        const body = TransactionStatus.bodyStatusGenerator(req.body)
        const headers = headersSymetricGenerator(date, method, endpoint, body, accessToken, randomNumber )
        data.headers = JSON.stringify(headers, null, 2)
        data.body = JSON.stringify(body, null, 2)
        data.api = api
        axios.post(api, body, {headers: headers })
            .then(response => {
                // JSON.parse(response.data)
                data.response = JSON.stringify(response.data, null, 2)
                res.render("transaction_status_view.ejs", {data});
            }
            )
            .catch(err => {
                console.log(err.response)
                // res.json(err.response.data)
                data.response = JSON.stringify(err.response.data, null, 2)
                data.token = null
                res.render("transaction_status_view.ejs", {data});
            })
    }

    static bodyStatusGenerator(body){
        if(body.partnerReferenceNo.length > 0 && body.referenceNo.length > 0){
            return {
                originalPartnerReferenceNo: body.partnerReferenceNo,
                originalReferenceNo: body.referenceNo,
                serviceCode: body.transferMethod
            }
        }else if(body.partnerReferenceNo.length > 0 && body.referenceNo.length < 1){
            return {
                originalPartnerReferenceNo: body.partnerReferenceNo,
                serviceCode: body.transferMethod
            }
        }else if(body.partnerReferenceNo.length < 1 && body.referenceNo.length > 0){
            return {
                originalReferenceNo: body.referenceNo,
                serviceCode: body.transferMethod
            }
        }
    }
}

module.exports = TransactionStatus