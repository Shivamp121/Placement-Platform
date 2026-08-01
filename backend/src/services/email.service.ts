import nodemailer from "nodemailer";

export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendEmail(to: string, subject: string, htmlContent: string) {
    try {
      const info = await this.transporter.sendMail({
        from: `"Placement Portal" <${process.env.SMTP_EMAIL}>`,
        to,
        subject,
        html: htmlContent,
      });
      console.log(`Email sent to ${to}: ${info.messageId}`);
      return true;
    } catch (error) {
      console.error("Email sending failed:", error);
      return false;
    }
  }
}