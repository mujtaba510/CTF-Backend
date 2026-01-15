// Utility for OTP expiration time
const getOTPExpiry = () => new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

export { getOTPExpiry };
