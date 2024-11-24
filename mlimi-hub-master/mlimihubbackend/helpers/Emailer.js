const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const Logo="https://www.google.com/imgres?imgurl=https%3A%2F%2Flookaside.fbsbx.com%2Flookaside%2Fcrawler%2Fmedia%2F%3Fmedia_id%3D100072103208297&tbnid=OeLGX6ZinfvFJM&vet=12ahUKEwj3xdHN95qFAxUiTaQEHQ9LDT0QMygBegQIARBW..i&imgrefurl=https%3A%2F%2Fwww.facebook.com%2FMzuniOnline%2F&docid=W4vTsTg2BlC3XM&w=319&h=319&q=mzuni%20logo&client=ubuntu-sn&ved=2ahUKEwj3xdHN95qFAxUiTaQEHQ9LDT0QMygBegQIARBW"

exports.sendMail = async (subject, recipientEmail, message) => {
  try {
    const oauth2Client = new OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.REFRESH_TOKEN,
    });

    const accessToken = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          console.log("*ERR: ", err);
          reject();
        }
        resolve(token);
      });
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.USER_EMAIL,
        accessToken,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
      },
    });
    
    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: recipientEmail,
      subject: subject,
      html: `
      <div style="max-width: 600px; margin: 0 auto; font-size: 16px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); text-align: center; padding: 20px; background-color: #f5f5f5; color: #333; border: 1px solid #ddd;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src=${Logo} alt="Logo" style="max-width: 200px;">
      </div>
      <div style="text-align: center; padding: 20px; background-color: #fff; color: #333; border-radius: 5px;">
        <h3 style="margin-top: 0; font-size: 22px; font-weight: bold; color: #333;">${subject}</h3>
        <p style="margin-bottom: 20px; line-height: 1.6;">${message}</p>
      </div>
    </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.log("ERROR: ", err);
  }
};