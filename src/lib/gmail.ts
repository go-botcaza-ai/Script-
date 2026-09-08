/**
 * Sends a Pay Per View access confirmation and receipt email via Gmail API.
 */
export async function sendPayPerViewReceiptEmail({
  accessToken,
  recipientEmail,
  recipientName,
  contentTitle,
  amount,
  currency,
  paymentGateway,
  accessKey,
  accessDuration
}: {
  accessToken: string;
  recipientEmail: string;
  recipientName: string;
  contentTitle: string;
  amount: number;
  currency: string;
  paymentGateway: string;
  accessKey: string;
  accessDuration: string;
}): Promise<{ id: string; threadId: string }> {
  const subject = `Tu acceso Pay Per View: ${contentTitle} [Token: ${accessKey.substring(0, 8)}]`;
  const formattedAmount = `${amount.toFixed(2)} ${currency}`;
  const currentDate = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const bodyHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
    .card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
    .header { background: #0f172a; padding: 28px 32px; color: #ffffff; text-align: left; }
    .header h1 { margin: 0 0 6px 0; font-size: 20px; font-weight: 700; color: #f8fafc; }
    .header p { margin: 0; font-size: 13px; color: #94a3b8; }
    .content { padding: 32px; }
    .token-box { background: #f1f5f9; border-radius: 8px; border: 1px dashed #cbd5e1; padding: 18px; margin: 24px 0; text-align: center; }
    .token-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-bottom: 6px; }
    .token-code { font-family: monospace; font-size: 20px; font-weight: 700; color: #0f172a; letter-spacing: 2px; }
    .details-table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 14px; }
    .details-table td { padding: 10px 0; border-bottom: 1px solid #f1f5f9; }
    .details-table td.label { color: #64748b; width: 40%; }
    .details-table td.value { font-weight: 600; text-align: right; color: #0f172a; }
    .footer { background: #f8fafc; padding: 20px 32px; font-size: 12px; color: #94a3b8; text-align: center; border-top: 1px solid #f1f5f9; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>Pago Confirmado — Pay Per View</h1>
      <p>Script PHP Monetizador de Contenido Exclusivo</p>
    </div>
    <div class="content">
      <p>Hola <strong>${recipientName || 'Estimado Usuario'}</strong>,</p>
      <p>Tu pago para acceder al contenido premium ha sido validado correctamente por el procesador de pagos.</p>
      
      <div class="token-box">
        <div class="token-label">Tu Clave Única de Desbloqueo (Access Token)</div>
        <div class="token-code">${accessKey}</div>
      </div>

      <table class="details-table">
        <tr>
          <td class="label">Contenido:</td>
          <td class="value">${contentTitle}</td>
        </tr>
        <tr>
          <td class="label">Importe Pagado:</td>
          <td class="value">${formattedAmount}</td>
        </tr>
        <tr>
          <td class="label">Pasarela:</td>
          <td class="value">${paymentGateway.toUpperCase()}</td>
        </tr>
        <tr>
          <td class="label">Vigencia del Pase:</td>
          <td class="value">${accessDuration}</td>
        </tr>
        <tr>
          <td class="label">Fecha y Hora:</td>
          <td class="value">${currentDate}</td>
        </tr>
      </table>

      <p style="margin-top: 24px; font-size: 13px; color: #64748b;">
        Ya puedes reproducir el video en alta definición sin restricciones ni publicidad desde cualquier dispositivo móvil o de escritorio.
      </p>
    </div>
    <div class="footer">
      Pay Per View Monetization Engine &bull; Generado automáticamente vía API de Gmail
    </div>
  </div>
</body>
</html>
  `;

  // Construct RFC 2822 email message
  const utf8Subject = `=?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`;
  const emailLines = [
    `To: ${recipientEmail}`,
    `Subject: ${utf8Subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=utf-8',
    '',
    bodyHtml
  ];

  const rawEmail = emailLines.join('\r\n');
  // Safe base64url encode
  const encodedEmail = btoa(unescape(encodeURIComponent(rawEmail)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      raw: encodedEmail
    })
  });

  if (!response.ok) {
    const errorDetails = await response.text();
    throw new Error(`Error en la API de Gmail (${response.status}): ${errorDetails}`);
  }

  return response.json();
}

/**
 * Reads user's Gmail profile to obtain current email address
 */
export async function getGmailProfile(accessToken: string): Promise<{ emailAddress: string }> {
  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    throw new Error('No se pudo consultar el perfil de Gmail');
  }

  return response.json();
}
