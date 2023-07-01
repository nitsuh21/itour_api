const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const santimpaySdk = require("./index.js");
const SANTIMPAY_GATEWAY_TOKEN = "nMHcCAQEEIBTX9Mw89X65SGZqOaE";

const PRIVATE_KEY_IN_PEM = `-----BEGIN EC PRIVATE KEY-----\nMHcCAQEEIBTX9Mw89X65SGZqOaE ... \n-----END EC PRIVATE KEY-----\n`

const GATEWAY_MERCHANT_ID = "f660f84e-7395-417b-91ff-542026c38326"

const client = new santimpaySdk(GATEWAY_MERCHANT_ID, SANTIMPAY_GATEWAY_TOKEN, PRIVATE_KEY_IN_PEM);

const successRedirectUrl = "https://santimpay.com";
const failureRedirectUrl = "https://santimpay.com";

const notifyUrl = "https://santimpay.com";

app.post('/santimapi/payment',(req,res)=>{
    console.log('changes')
    console.log(req.body)
    var id = req.body.id
    var amount = req.body.amount
    var paymentReason = req.body.paymentReason
    client.generatePaymentUrl(id,amount,paymentReason, successRedirectUrl, failureRedirectUrl, notifyUrl).then(url => {
        console.log("Payment URL: ", url);
    }).catch(error => {
        console.error(error)
    })
})

app.listen(port, () => console.log(`Server started on port ${port}`));