import nodemailer from "nodemailer";

function getTransporter() {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
}

function getCodeEmailTemplate(code: string) {
  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8"/>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@300;400;500&display=swap');
  </style>
</head>
<body style="margin:0;padding:0;background-color:#f5f0e8;font-family:'Montserrat',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f5f0e8;padding:48px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;">
        <tr><td align="center" style="padding-bottom:32px;">
          <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:13px;font-weight:600;color:#bfa76f;letter-spacing:0.35em;text-transform:uppercase;">
            ✦ &nbsp; Luma Skin Laser Studio &nbsp; ✦
          </div>
        </td></tr>
        <tr><td style="background:#ffffff;border:1px solid #e8e0d0;border-top:3px solid #bfa76f;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="padding:40px 52px 0;">
              <table width="100%"><tr>
                <td><div style="width:24px;height:24px;border-left:1px solid #bfa76f;border-top:1px solid #bfa76f;"></div></td>
                <td align="right"><div style="width:24px;height:24px;border-right:1px solid #bfa76f;border-top:1px solid #bfa76f;margin-left:auto;"></div></td>
              </tr></table>
            </td></tr>
            <tr><td align="center" style="padding:28px 52px 4px;">
              <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:36px;color:#2a2a2a;line-height:1.2;">Potwierdzenie</div>
              <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:36px;font-style:italic;color:#bfa76f;line-height:1.2;">adresu e-mail</div>
            </td></tr>
            <tr><td align="center" style="padding:16px 52px;">
              <div style="width:48px;height:1px;background:#bfa76f;margin:0 auto;"></div>
            </td></tr>
            <tr><td align="center" style="padding:0 52px 28px;">
              <p style="font-size:14px;font-weight:300;color:#6a6a6a;line-height:1.8;letter-spacing:0.02em;margin:0;text-align:center;">
                  Dziękujemy za rejestrację.<br/>Wprowadź poniższy kod, aby dokończyć tworzenie konta.
              </p>
            </td></tr>
            <tr><td style="padding:0 52px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f4ec;border:1px solid #e0d5c0;">
                <tr><td align="center" style="padding:16px 24px 4px;">
                  <div style="font-size:10px;font-weight:500;color:#bfa76f;letter-spacing:0.3em;text-transform:uppercase;">Twój kod</div>
                </td></tr>
                <tr><td align="center" style="padding:8px 24px 16px;">
                  <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:52px;font-weight:600;color:#2a2a2a;letter-spacing:0.2em;line-height:1;">${code}</div>
                </td></tr>
                <tr><td align="center" style="padding:0 24px 16px;">
                  <div style="font-size:11px;font-weight:300;color:#9a9a9a;">Действителен в течение <span style="color:#bfa76f;font-weight:500;">10 минут</span></div>
                </td></tr>
              </table>
            </td></tr>
            <tr><td style="padding:0 52px 40px;">
              <table width="100%"><tr>
                <td><div style="width:24px;height:24px;border-left:1px solid #bfa76f;border-bottom:1px solid #bfa76f;"></div></td>
                <td align="center"><p style="font-size:11px;font-weight:300;color:#b0b0b0;margin:0;letter-spacing:0.03em;">Jeśli nie tworzyłeś konta — po prostu zignoruj tę wiadomość.</p></td>
                <td align="right"><div style="width:24px;height:24px;border-right:1px solid #bfa76f;border-bottom:1px solid #bfa76f;margin-left:auto;"></div></td>
              </tr></table>
            </td></tr>
          </table>
        </td></tr>
        <tr><td align="center" style="padding-top:28px;">
          <div style="font-size:11px;font-weight:300;color:#a0906a;letter-spacing:0.15em;text-transform:uppercase;">Luma Skin Laser Studio</div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendEmailCode(email: string, code: string) {
  const transporter = getTransporter();
  
  // Проверяем соединение перед отправкой
  await transporter.verify();
  console.log("📡 SMTP соединение OK");
  
  await transporter.sendMail({
    from: `"Beauty Studio" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Ваш код подтверждения",
    html: getCodeEmailTemplate(code)
  });
}
