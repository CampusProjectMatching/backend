const {fetchOtp} = require('../Database/query');

const timeDelay = 300000; // 5 minutes

async function verifyOtp(email,otp){
    const otpData = await fetchOtp(email);
    if(otpData.otp === otp){
        if(new Date() - new Date(otpData.created_at) < timeDelay){
            return true;
        }
    }
    return false;
}

module.exports = verifyOtp;