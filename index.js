const axios = require("axios");
const jwt = require('jsonwebtoken');

const BASE_URL = "https://services.santimpay.com/api/v1/gateway";

class SantimpaySdk {
  constructor(merchantId, token, privateKey) {
    this.token = token;
    this.privateKey = privateKey;
    this.merchantId = merchantId;
  }

  generateSignedToken(amount, paymentReason) {
    const time = Math.floor(Date.now() / 1000);

    const payload = {
      amount,
      paymentReason,
      merchantId: this.merchantId,
      generated: time,
    }

    return jwt.sign(JSON.stringify(payload), this.privateKey, { algorithm: 'ES256' })
  }

  async generatePaymentUrl(id, amount, paymentReason, successRedirectUrl, failureRedirectUrl, notifyUrl) {
    try {

      const token = this.generateSignedToken(amount, paymentReason);

      const response = await axios.post(`${BASE_URL}/initiate-payment`, {
        id,
        amount,
        reason: paymentReason,
        merchantId: this.merchantId,
        signedToken: token,
        successRedirectUrl,
        failureRedirectUrl,
        notifyUrl
      }, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      });

      if (response.status === 200) {
        return response.data.url;
      } else {
        throw new Error("Failed to initiate payment");
      }
    } catch (error) {
      if (error.response) {
        throw error.response;
      }
      throw error;
    }
  }
}

module.exports = SantimpaySdk;
