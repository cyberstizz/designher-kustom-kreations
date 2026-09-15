/**
 * Email notifications through Resend.
 *
 * Inert until RESEND_API_KEY and NOTIFY_FROM are set in Netlify, so calling
 * this before you sign up for Resend is a no-op rather than an error. Every
 * caller ignores the result: a missed email must never fail a payment.
 */
export async function notify({ to, subject, heading, body, linkUrl, linkLabel }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.NOTIFY_FROM;
  if (!apiKey || !from || !to) return { sent: false, reason: 'not configured' };

  const html = `
    <div style="font-family:Helvetica,Arial,sans-serif;background:#150F1A;color:#F6EFE4;padding:32px;">
      <p style="font-family:Georgia,serif;font-style:italic;font-size:22px;margin:0 0 4px;">Designher</p>
      <p style="font-size:10px;letter-spacing:.3em;color:#E4CA97;margin:0 0 28px;">CUSTOM KREATIONS</p>
      <h1 style="font-family:Georgia,serif;font-weight:500;font-size:24px;margin:0 0 14px;">${heading}</h1>
      <p style="font-size:15px;line-height:1.6;color:#d8d0c6;margin:0 0 24px;">${body}</p>
      ${linkUrl ? `<a href="${linkUrl}" style="display:inline-block;background:#B0142F;color:#F6EFE4;text-decoration:none;padding:12px 22px;border-radius:4px;font-size:14px;">${linkLabel || 'Open'}</a>` : ''}
      <p style="font-size:12px;color:#8b8289;line-height:1.6;margin:24px 0 0;">Hand-set in Laurelton, Queens.</p>
    </div>`;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to, subject, html }),
    });
    if (!res.ok) {
      console.error('[notify] send failed', res.status, await res.text());
      return { sent: false, reason: `http ${res.status}` };
    }
    return { sent: true };
  } catch (err) {
    console.error('[notify] send threw', err.message);
    return { sent: false, reason: err.message };
  }
}