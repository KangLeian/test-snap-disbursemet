const config = require("../config")
const toIsoString = require("./toIsoString")
const rs = require('jsrsasign')
const rsu = require('jsrsasign-util')
const CryptoJS = require('crypto-js')

function headersSymetricGenerator(date, method, endpoint, body, accessToken, randomNumber){
    let minifyBody = JSON.stringify(body)
    let encBody = CryptoJS.SHA256(minifyBody).toString()
    let stringToSign = `${method}:${endpoint}:${accessToken}:${encBody.toLowerCase()}:${toIsoString(date)}`
    let signature = CryptoJS.HmacSHA512(stringToSign, config.clientSecret).toString(CryptoJS.enc.Base64)
    let headers = {
        "X-TIMESTAMP": toIsoString(date),
        "X-SIGNATURE": signature,
        "X-PARTNER-ID": config.clientKey,
        "X-EXTERNAL-ID": randomNumber,//Math.floor(100000000000000000000 + Math.random() * 900000000000000000000).toString(),
        "channel-id": config.channelId,
        Authorization: `Bearer ${accessToken}`
    }
    console.log("minifyBody : ", minifyBody)
    console.log("encBody : ", encBody)
    console.log("stringToSign : ", stringToSign)
    return headers
}

function headersAuthGenerator(date){
    let stringToSign = `${config.clientKey}|${toIsoString(date)}`
    let privateKey = rs.KEYUTIL.getKey(rsu.readFile("./mykey/privatekey.pem"))
    let sign = new rs.KJUR.crypto.Signature({"alg": "SHA256withRSA"});
    sign.init(privateKey)
    let hash = sign.signString(stringToSign)
    const signature = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Hex.parse(hash))
    let headers = {
        "X-TIMESTAMP": toIsoString(date),
        "X-SIGNATURE": signature,
        "X-CLIENT-KEY": config.clientKey
    }
    return headers
}

module.exports = {
    headersAuthGenerator,
    headersSymetricGenerator
}