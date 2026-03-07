import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const GOLD = "#C6A667";
const BG = "#fafaf7";
const CARD = "#ffffff";
const TEXT = "#1a1a1a";
const MUTED = "#777777";
const BORDER = "#e8ddc8";

export interface BookingEmailData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  serviceName: string;
  servicePrice?: string;
  date: string; // formatted string e.g. "15 июня 2025"
  time: string;
  comment?: string;
  status?: string;
}

function statusLabel(status: string): string {
  const map: Record<string, string> = {
    pending: "Ожидает подтверждения",
    confirmed: "Подтверждена",
    cancelled: "Отменена",
  };
  return map[status] ?? status;
}

function statusColor(status: string): string {
  const map: Record<string, string> = {
    pending: "#d97706",
    confirmed: "#16a34a",
    cancelled: "#dc2626",
  };
  return map[status] ?? GOLD;
}

function detailRow(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid ${BORDER};color:${MUTED};font-size:13px;width:40%;vertical-align:top;">
        ${label}
      </td>
      <td style="padding:10px 0;border-bottom:1px solid ${BORDER};color:${TEXT};font-size:14px;font-weight:600;vertical-align:top;">
        ${value}
      </td>
    </tr>`;
}

function baseTemplate(title: string, preheader: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:${BG};font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;color:${BG};">${preheader}</div>
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${BG};padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom:28px;">
              <div style="display:inline-block;border-bottom:2px solid ${GOLD};padding-bottom:8px;">
                <span style="font-size:22px;font-weight:700;letter-spacing:3px;color:${TEXT};text-transform:uppercase;">
                  Запись
                </span>
              </div>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:${CARD};border:1px solid ${BORDER};border-radius:8px;padding:32px 36px;">
              ${body}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:24px;">
              <p style="margin:0;font-size:12px;color:${MUTED};">
                Это автоматическое письмо. Пожалуйста, не отвечайте на него.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── New Booking — client email ───────────────────────────────────────────────
function newBookingClientHtml(data: BookingEmailData): string {
  const body = `
    <h2 style="margin:0 0 6px;font-size:20px;color:${TEXT};">Ваша запись принята!</h2>
    <p style="margin:0 0 28px;font-size:14px;color:${MUTED};">
      Мы получили вашу заявку и скоро свяжемся с вами для подтверждения.
    </p>

    <div style="background:${BG};border-left:3px solid ${GOLD};border-radius:4px;padding:14px 18px;margin-bottom:28px;">
      <span style="font-size:13px;color:${MUTED};">Статус:</span>&nbsp;
      <span style="font-size:13px;font-weight:700;color:${GOLD};">Ожидает подтверждения</span>
    </div>

    <table width="100%" cellpadding="0" cellspacing="0">
      ${detailRow("Имя", `${data.firstName} ${data.lastName}`)}
      ${detailRow("Услуга", data.serviceName)}
      ${data.servicePrice ? detailRow("Стоимость", data.servicePrice) : ""}
      ${detailRow("Дата", data.date)}
      ${detailRow("Время", data.time)}
      ${detailRow("Телефон", data.phone)}
      ${detailRow("Email", data.email)}
      ${data.comment ? detailRow("Комментарий", data.comment) : ""}
    </table>

    <p style="margin:28px 0 0;font-size:13px;color:${MUTED};line-height:1.6;">
      Если у вас возникнут вопросы или вы хотите перенести запись — свяжитесь с нами.
    </p>
  `;
  return baseTemplate(
    "Запись подтверждена",
    `Ваша запись на ${data.serviceName} ${data.date} в ${data.time}`,
    body
  );
}

// ─── New Booking — admin email ────────────────────────────────────────────────
function newBookingAdminHtml(data: BookingEmailData): string {
  const body = `
    <h2 style="margin:0 0 6px;font-size:20px;color:${TEXT};">Новая запись!</h2>
    <p style="margin:0 0 28px;font-size:14px;color:${MUTED};">
      Клиент оставил заявку через сайт. Проверьте и подтвердите.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0">
      ${detailRow("Клиент", `${data.firstName} ${data.lastName}`)}
      ${detailRow("Телефон", data.phone)}
      ${detailRow("Email", data.email)}
      ${detailRow("Услуга", data.serviceName)}
      ${data.servicePrice ? detailRow("Стоимость", data.servicePrice) : ""}
      ${detailRow("Дата", data.date)}
      ${detailRow("Время", data.time)}
      ${data.comment ? detailRow("Комментарий", data.comment) : ""}
    </table>
  `;
  return baseTemplate(
    "Новая запись",
    `Новая запись: ${data.firstName} ${data.lastName} — ${data.serviceName}`,
    body
  );
}

// ─── Status Change — client email ─────────────────────────────────────────────
function statusChangeHtml(data: BookingEmailData): string {
  const status = data.status ?? "confirmed";
  const label = statusLabel(status);
  const color = statusColor(status);

  const messages: Record<string, string> = {
    confirmed:
      "Ваша запись подтверждена. Ждём вас в назначенное время!",
    cancelled:
      "К сожалению, ваша запись была отменена. Свяжитесь с нами для переноса.",
    pending:
      "Статус вашей записи обновлён.",
  };
  const message = messages[status] ?? messages.pending;

  const body = `
    <h2 style="margin:0 0 6px;font-size:20px;color:${TEXT};">Статус записи изменён</h2>
    <p style="margin:0 0 28px;font-size:14px;color:${MUTED};">${message}</p>

    <div style="background:${BG};border-left:3px solid ${color};border-radius:4px;padding:14px 18px;margin-bottom:28px;">
      <span style="font-size:13px;color:${MUTED};">Новый статус:</span>&nbsp;
      <span style="font-size:13px;font-weight:700;color:${color};">${label}</span>
    </div>

    <table width="100%" cellpadding="0" cellspacing="0">
      ${detailRow("Имя", `${data.firstName} ${data.lastName}`)}
      ${detailRow("Услуга", data.serviceName)}
      ${data.servicePrice ? detailRow("Стоимость", data.servicePrice) : ""}
      ${detailRow("Дата", data.date)}
      ${detailRow("Время", data.time)}
    </table>

    <p style="margin:28px 0 0;font-size:13px;color:${MUTED};line-height:1.6;">
      Если у вас возникнут вопросы — свяжитесь с нами.
    </p>
  `;
  return baseTemplate(
    `Запись: ${label}`,
    `Статус вашей записи на ${data.serviceName} изменён на «${label}»`,
    body
  );
}

// ─── Public send functions ────────────────────────────────────────────────────

export async function sendNewBookingEmails(data: BookingEmailData) {
  const from = `"Запись" <${process.env.SMTP_FROM}>`;

  await Promise.all([
    // to client
    transporter.sendMail({
      from,
      to: data.email,
      subject: `Ваша запись на ${data.serviceName} — ${data.date} в ${data.time}`,
      html: newBookingClientHtml(data),
    }),
    // to admin
    transporter.sendMail({
      from,
      to: process.env.ADMIN_EMAIL,
      subject: `Новая запись: ${data.firstName} ${data.lastName} — ${data.serviceName}`,
      html: newBookingAdminHtml(data),
    }),
  ]);
}

export async function sendStatusChangeEmail(data: BookingEmailData) {
  const from = `"Запись" <${process.env.SMTP_FROM}>`;
  const label = statusLabel(data.status ?? "confirmed");

  await transporter.sendMail({
    from,
    to: data.email,
    subject: `Статус вашей записи: ${label}`,
    html: statusChangeHtml(data),
  });
}

// ─── Helper: format date for emails ──────────────────────────────────────────
export function formatBookingDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
