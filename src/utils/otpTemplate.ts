export const getVerifyEmailTemplates = (otp: string, name: string) => ({
    subject: "Verify Your Email Address",
    text: `Hi ${name}, 
    
  Thank you for signing up with ScrollStack! Please use the following OTP to verify your email address:
  
  OTP: ${otp}
  
  If you didn't sign up for this account, you can safely ignore this email.
  
  Best regards,
  The ScrollStack Team`,
    html: `
    <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email Address</title>
    <style>
      @import url('https://fonts.cdnfonts.com/css/satoshi');
  
      body {
        font-family: 'Satoshi', sans-serif;
      }
    </style>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
      <tr>
        <td align="center" style="padding: 40px 0;">
          <table role="presentation" style="width: 100%; max-width: 400px; border-collapse: collapse; background-color: #F0F8FF; border-radius: 20px; overflow: hidden;">
            <tr>
              <td align="center" style="padding: 30px 20px;">
                <!-- Check Icon -->
                <div style="background-color: #3498DB; width: 50px; height: 50px; border-radius: 25px; margin-bottom: 20px; display: inline-flex; align-items: center; justify-content: center;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
  
                <!-- Title -->
                <h1 style="color: #000; font-size: 20px; margin: 0 0 20px 0;">
                  ✨ Verify Your Email Address! ✨
                </h1>
  
                <!-- OTP Box -->
                <div style="background-color: #f0f0f0; padding: 20px; border-radius: 15px; margin-bottom: 20px;">
                  <span style="font-size: 36px; font-weight: bold; color: #4a4a4a; letter-spacing: 5px;">${otp}</span>
                </div>
  
                <!-- Main Content Box -->
                <div style="background-color: rgba(255, 255, 255, 0.9); padding: 25px; border-radius: 15px; margin: 0 10px;">
                  <p style="color: #000; font-size: 14px; line-height: 1.6; margin: 0 0 15px 0;">
                    Thank you for signing up with us, ${name}! Please use the OTP above to verify your email address.
                  </p>
                  <p style="color: #000; font-size: 14px; line-height: 1.6; margin: 0 0 15px 0;">
                    This OTP will expire in 10 minutes. Do not share this code with anyone.
                  </p>
                  <p style="color: #000; font-size: 14px; line-height: 1.6; margin: 0;">
                    If you didn't sign up for this account, you can safely ignore this email.
                  </p>
                </div>
  
                <!-- Footer Logo -->
                <div style="margin-top: 30px;">
                  <span style="color: #3498DB; font-size: 20px; font-weight: bold;">ScrollStack</span>
                  <span style="color: #2ECC71; font-size: 20px;">●</span>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
    `,
})