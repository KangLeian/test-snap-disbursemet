const { json } = require("body-parser");
const config = require("../config/index.js")
const { headersAuthGenerator } = require("../helpers/headersGenerator");
const axios = require("axios");

class Token{
    static getToken(req, res){
        res.render("get_token.ejs");
    }

    static getTokenFromDuitku(req, res){
        let data = {}
        let date = new Date()
        let endPoint = "/auth/v1.0/access-token/b2b"
        // date.setDate(1)
        const headers = headersAuthGenerator(date)
        const body = {
            "grantType": "client_credentials"
        }
        data.headers = JSON.stringify(headers, null, 2)
        data.body = JSON.stringify(body, null, 2)
        data.api = config.sandboxDomain + endPoint
        console.log(headers, body)
        axios.post( config.sandboxDomain + endPoint, body, {headers: headers })
            .then(response => {
                // JSON.parse(response.data)
                data.response = JSON.stringify(response.data, null, 2)
                data.token = response.data.accessToken
                config.accessToken = response.data.accessToken
                res.render("token_view.ejs", {data});
            }
            )
            .catch(err => {
                console.log(err.response.data)
                // res.json(err.response.data)
                data.response = JSON.stringify(err.response.data, null, 2)
                data.token = null
                res.render("token_view.ejs", {data});
            })
    }
}

module.exports = Token;