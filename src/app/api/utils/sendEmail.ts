import sgMail from "@sendgrid/mail";

const sendgridApiKey = process.env.SENDGRID_API_KEY;
const fromEmail = process.env.FROM_EMAIL;

if (!sendgridApiKey || !fromEmail) {
  throw new Error("SendGrid API key or FROM_EMAIL is missing in environment variables.");
}

sgMail.setApiKey(sendgridApiKey);

export async function sendOtpEmail(to: string, otp: string) {
  const msg = {
    to,
    from: fromEmail as string,
    subject: "Your Athlos One OTP Code",
    text: `Your Athlos One verification code is: ${otp}`,
    html: `<p>Your Athlos One verification code is: <strong>${otp}</strong></p>`
  };
  await sgMail.send(msg);
}
