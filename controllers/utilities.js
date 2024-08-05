const axios = require("axios");
const config = require("../config");
const { headersSymetricGenerator } = require("../helpers/headersGenerator");

class Utilities {
    static balance(req, res){
        let data = {}
        data.accessToken = config.accessToken || ""
        res.render("get_balance.ejs", {data});
    }

    static bankList(req, res){
        let data = {}
        data.accessToken = config.accessToken || ""
        res.render("get_bank_list.ejs", {data});
    }

    static getBalance(req, res){
        let data = {}
        let date = new Date()
        let method = "POST"
        let duitkuDomain = config.sandboxDomain
        let endpoint = "/db/snap/v1.0/balance-inquiry"
        const api = duitkuDomain + endpoint
        let accessToken = req.body.token
        let randomNumber = Math.floor(100000000000000000000 + Math.random() * 900000000000000000000).toString()
        const body = {
            "accountNo": config.userId
        }
        const headers = headersSymetricGenerator(date, method, endpoint, body, accessToken, randomNumber )
        data.headers = JSON.stringify(headers, null, 2)
        data.body = JSON.stringify(body, null, 2)
        data.api = api
        axios.post(api, body, {headers: headers })
            .then(response => {
                // JSON.parse(response.data)
                console.log(response.data)
                data.response = JSON.stringify(response.data, null, 2)
                data.balance = response.data.accountInfo[0].availableBalance.value
                res.render("display_balance.ejs", {data});
            }
            )
            .catch(err => {
                console.log("error cuy")
                console.log(err)
                // res.json(err.response.data)
                data.response = JSON.stringify(err.response.data, null, 2)
                data.token = null
                res.render("display_balance.ejs", {data});
            })
    }

    static getBankList(req, res){
        let data = {}
        let date = new Date()
        let method = "POST"
        let duitkuDomain = config.sandboxDomain
        let endpoint = "/db/snap/v1.0/bank-list"
        const api = duitkuDomain + endpoint
        let accessToken = req.body.token
        let randomNumber = Math.floor(100000000000000000000 + Math.random() * 900000000000000000000).toString()
        const body = {
            "accountNo": config.userId
        }
        const headers = headersSymetricGenerator(date, method, endpoint, body, accessToken, randomNumber )
        data.headers = JSON.stringify(headers, null, 2)
        data.body = JSON.stringify(body, null, 2)
        data.api = api
        axios.post(api, body, {headers: headers })
            .then(response => {
                // JSON.parse(response.data)
                data.response = JSON.stringify(response.data, null, 2)
                data.banks = response.data.banks
                res.render("display_bank_list.ejs", {data});
            })
            .catch(err => {
                console.log("error cuy")
                console.log(err)
                // res.json(err.response.data)
                data.response = JSON.stringify(err.response.data, null, 2)
                data.token = null
                res.render("display_bank_list.ejs", {data});
            })
    }
}

module.exports = Utilities