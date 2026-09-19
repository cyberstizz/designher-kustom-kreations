/**
 * Email: layout, templates, sending.
 *
 * Email clients are not browsers. Gmail strips <style> blocks and external
 * fonts, Outlook renders through Word, and nothing supports flexbox
 * reliably. So this is tables and inline styles only, 600px wide, with a
 * web-safe stack that echoes the site: Georgia italic standing in for
 * Fraunces, Helvetica for Manrope, Courier for Space Mono.
 *
 * Every template returns { subject, html, text }. The plain-text version is
 * not optional — some clients show it, and spam filters read it.
 *
 * Inert until RESEND_API_KEY and NOTIFY_FROM are set, so this can ship
 * before Dianna's Resend account exists. Callers ignore the result: a
 * missed email must never fail a payment or lose a lead.
 */

const INK = '#150F1A';
const INK_SOFT = '#1E1624';
const BONE = '#F6EFE4';
const MUTED = '#B5ADA6';
const RUBY = '#B0142F';
const CHAMPAGNE = '#CBA35C';
const LINE = '#332B38';

const SERIF = "Georgia,'Times New Roman',serif";
const SANS = "Helvetica,Arial,sans-serif";
const MONO = "'Courier New',Courier,monospace";

const SITE = process.env.URL || 'https://designherck.com';
const CONTACT = 'designherinc@gmail.com';

export function money(cents) {
  return `$${(cents / 100).toFixed(2).replace(/\.00$/, '')}`;
}

function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** First name only, for a greeting that doesn't read like a form letter. */
function firstName(fullName) {
  const first = String(fullName || '').trim().split(/\s+/)[0];
  return first ? first.charAt(0).toUpperCase() + first.slice(1) : 'there';
}

/**
 * The shell every email shares.
 *
 * preheader — the grey line beside the subject in an inbox list. Worth
 *   setting; left empty, clients pull the first visible words instead.
 * rows — [[label, value]] rendered as a spec table. Skipped when empty.
 */
function layout({ preheader, eyebrow, heading, body, highlight, rows = [], cta, ctaUrl, footnote }) {
  const detailRows = rows
    .filter(([, v]) => v)
    .map(
      ([label, value]) => `
            <tr>
              <td style="padding:11px 0;border-bottom:1px solid ${LINE};font-family:${MONO};font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:${MUTED};width:33%;padding-right:16px;vertical-align:top;">${esc(label)}</td>
              <td style="padding:11px 0;border-bottom:1px solid ${LINE};font-family:${SANS};font-size:14px;line-height:1.5;color:${BONE};">${esc(value)}</td>
            </tr>`
    )
    .join('');

  const hero = highlight
    ? `
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:26px 0 0;background:#241A2C;border-left:3px solid ${RUBY};border-radius:3px;">
            <tr>
              <td style="padding:20px 22px;">
                <div style="font-family:${MONO};font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:${MUTED};padding-bottom:8px;">${esc(highlight.label)}</div>
                <div style="font-family:${SERIF};font-size:36px;line-height:1;color:${BONE};">${esc(highlight.value)}</div>
                ${highlight.note ? `<div style="font-family:${SANS};font-size:12.5px;color:${MUTED};padding-top:10px;">${esc(highlight.note)}</div>` : ''}
              </td>
            </tr>
          </table>`
    : '';

  const button = cta && ctaUrl
    ? `
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:30px 0 0;">
            <tr>
              <td align="center" bgcolor="${RUBY}" style="border-radius:3px;">
                <a href="${ctaUrl}" style="display:inline-block;padding:15px 30px;font-family:${SANS};font-size:15px;font-weight:bold;color:${BONE};text-decoration:none;border-radius:3px;">${esc(cta)}</a>
              </td>
            </tr>
          </table>`
    : '';

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<title>${esc(heading)}</title>
</head>
<body style="margin:0;padding:0;background:#0E0A12;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader || '')}</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0E0A12;padding:28px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:100%;background:${INK};border:1px solid ${LINE};border-radius:6px;overflow:hidden;">

          <!-- wordmark -->
          <tr>
            <td style="padding:30px 34px 0;">
              <div style="font-family:${SERIF};font-style:italic;font-size:26px;color:${BONE};line-height:1;">Designher</div>
              <div style="font-family:${MONO};font-size:9px;letter-spacing:.3em;color:${CHAMPAGNE};padding-top:5px;">CUSTOM KREATIONS</div>
            </td>
          </tr>

          <!-- body -->
          <tr>
            <td style="padding:30px 34px 34px;">
              ${eyebrow ? `<div style="font-family:${MONO};font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:${CHAMPAGNE};padding-bottom:14px;">${esc(eyebrow)}</div>` : ''}
              <h1 style="margin:0 0 16px;font-family:${SERIF};font-weight:normal;font-size:27px;line-height:1.2;color:${BONE};">${esc(heading)}</h1>
              <div style="font-family:${SANS};font-size:15px;line-height:1.7;color:#D8D0C8;">${body}</div>
              ${hero}
              ${detailRows ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:26px 0 0;border-top:1px solid ${LINE};">${detailRows}</table>` : ''}
              ${button}
            </td>
          </tr>

          <!-- footer -->
          <tr>
            <td style="padding:22px 34px 28px;background:${INK_SOFT};border-top:1px solid ${LINE};">
              ${footnote ? `<div style="font-family:${SANS};font-size:12.5px;line-height:1.7;color:${MUTED};padding-bottom:14px;">${footnote}</div>` : ''}
              <div style="font-family:${MONO};font-size:10px;letter-spacing:.1em;color:#7E7680;line-height:1.9;">
                HAND-SET IN LAURELTON, QUEENS<br>
                <a href="mailto:${CONTACT}" style="color:#7E7680;text-decoration:none;">${CONTACT}</a>
                &nbsp;·&nbsp;
                <a href="${SITE}" style="color:#7E7680;text-decoration:none;">designherck.com</a>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Strip the HTML body copy down to something readable in plain text. */
function plain({ heading, lines, rows = [], cta, ctaUrl }) {
  const out = [heading, ''];
  lines.forEach((l) => out.push(l, ''));
  rows.filter(([, v]) => v).forEach(([label, value]) => out.push(`${label}: ${value}`));
  if (rows.length) out.push('');
  if (cta && ctaUrl) out.push(`${cta}: ${ctaUrl}`, '');
  out.push('—', 'Designher Custom Kreations', 'Hand-set in Laurelton, Queens', CONTACT);
  return out.join('\n');
}

/* ========================================================== templates */

/** To Dianna: somebody just asked for a kreation. */
export function adminNewRequest(inquiry) {
  const rows = [
    ['Name', inquiry.full_name],
    ['Email', inquiry.email],
    ['Phone', inquiry.phone],
    ['Piece', inquiry.base],
    ['Occasion', inquiry.occasion],
    ['Colors', inquiry.palette],
    ['Personalization', inquiry.personalization],
    ['Size', inquiry.size],
    ['Needed by', inquiry.timeline],
    ['Budget', inquiry.budget],
    ['Ships to', inquiry.ship_state],
    ['Reference photo', inquiry.reference_photo ? 'Attached in the studio' : 'None sent'],
  ];
  const lines = [
    `${firstName(inquiry.full_name)} sent a custom request through the website.`,
    'Everything they told you is below. Open the studio to send a price or ask a question first.',
  ];
  return {
    subject: `New kreation request — ${inquiry.full_name || 'website'}`,
    html: layout({
      preheader: `${inquiry.base || 'A custom piece'} for ${inquiry.occasion || 'no occasion given'}`,
      eyebrow: 'New request',
      heading: 'Someone wants a kreation',
      body: lines.map((l) => `<p style="margin:0 0 14px;">${esc(l)}</p>`).join(''),
      rows,
      cta: 'Open the studio',
      ctaUrl: `${SITE}/admin`,
      footnote: 'You are getting this because a request came in on designherck.com.',
    }),
    text: plain({ heading: 'New kreation request', lines, rows, cta: 'Open the studio', ctaUrl: `${SITE}/admin` }),
  };
}

/** To the customer: we have it, here's what happens next. */
export function customerRequestReceived(inquiry) {
  const rows = [
    ['Piece', inquiry.base],
    ['Occasion', inquiry.occasion],
    ['Colors', inquiry.palette],
    ['Needed by', inquiry.timeline],
  ];
  const lines = [
    `Hi ${firstName(inquiry.full_name)} — your request is in Dianna's hands.`,
    'She reads every request herself, so the next email you get is a real price from a real person, not an automatic estimate. That usually takes a day or two.',
    'Nothing is owed and nothing is started until you see the price and say yes.',
  ];
  return {
    subject: 'We got your kreation request',
    html: layout({
      preheader: 'Dianna reads every request herself — your price is coming soon.',
      eyebrow: 'Request received',
      heading: "It's in her hands",
      body: lines.map((l) => `<p style="margin:0 0 14px;">${esc(l)}</p>`).join(''),
      rows,
      cta: 'Check on your request',
      ctaUrl: `${SITE}/account`,
      footnote: `Something to add? Just reply to this email, or write to <a href="mailto:${CONTACT}" style="color:${CHAMPAGNE};">${CONTACT}</a>.`,
    }),
    text: plain({
      heading: 'We got your kreation request',
      lines,
      rows,
      cta: 'Check on your request',
      ctaUrl: `${SITE}/account`,
    }),
  };
}

/** To the customer: here is the price. */
export function customerQuoteReady(inquiry, quote) {
  const lines = [
    `Hi ${firstName(inquiry.full_name)} — Dianna has looked over your ${inquiry.base || 'piece'} and set a price.`,
  ];
  if (quote.message) lines.push(`In her words: “${quote.message}”`);
  lines.push(
    'Sign in to see it in full and accept when you are ready. Once you accept, you can pay securely by card and she starts setting stones.'
  );
  const rows = [
    ['Piece', inquiry.base],
    ['Turnaround', 'About 14 days once you accept'],
  ];
  return {
    subject: `Your kreation price — ${money(quote.amount_cents)}`,
    html: layout({
      preheader: `${money(quote.amount_cents)} for your ${inquiry.base || 'custom piece'}, ready when you are.`,
      eyebrow: 'Your quote',
      heading: 'Your price is ready',
      body: lines.map((l) => `<p style="margin:0 0 14px;">${esc(l)}</p>`).join(''),
      highlight: {
        label: 'Your price',
        value: money(quote.amount_cents),
        note: 'Full payment by card once you accept. Nothing is charged before that.',
      },
      rows,
      cta: 'See your quote',
      ctaUrl: `${SITE}/account`,
      footnote: 'Prices are held for 14 days. Questions or changes? Reply to this email.',
    }),
    text: plain({
      heading: 'Your price is ready',
      lines,
      rows: [['Your price', money(quote.amount_cents)], ...rows],
      cta: 'See your quote',
      ctaUrl: `${SITE}/account`,
    }),
  };
}

/** To Dianna: money landed. */
export function adminPaid(inquiry, amountCents) {
  const lines = [
    `${inquiry.full_name || 'A customer'} just paid in full.`,
    'The request has moved to "Being made" in your studio. Stripe will pay out to your bank on its normal schedule.',
  ];
  const rows = [
    ['Paid', money(amountCents)],
    ['Customer', inquiry.full_name],
    ['Email', inquiry.email],
    ['Piece', inquiry.base],
  ];
  return {
    subject: `Paid — ${money(amountCents)} from ${inquiry.full_name || 'a customer'}`,
    html: layout({
      preheader: `${money(amountCents)} received. Time to set some stones.`,
      eyebrow: 'Payment received',
      heading: 'You got paid',
      body: lines.map((l) => `<p style="margin:0 0 14px;">${esc(l)}</p>`).join(''),
      rows,
      cta: 'Open the studio',
      ctaUrl: `${SITE}/admin`,
    }),
    text: plain({ heading: 'Payment received', lines, rows, cta: 'Open the studio', ctaUrl: `${SITE}/admin` }),
  };
}

/** To the customer: thank you, here's what happens next. */
export function customerPaid(inquiry, amountCents, receiptUrl) {
  const lines = [
    `Thank you, ${firstName(inquiry.full_name)}. Your payment went through and your kreation is officially on Dianna's table.`,
    'She sets every stone by hand, so expect about 14 days. You will hear from her when it ships.',
  ];
  const rows = [
    ['Piece', inquiry.base],
    ['Turnaround', 'About 14 days'],
  ];
  return {
    subject: 'Payment received — your kreation is underway',
    html: layout({
      preheader: 'Paid in full. Dianna has started on your piece.',
      eyebrow: 'Thank you',
      heading: 'Your kreation is underway',
      body: lines.map((l) => `<p style="margin:0 0 14px;">${esc(l)}</p>`).join(''),
      highlight: { label: 'Paid in full', value: money(amountCents) },
      rows,
      cta: 'Track your kreation',
      ctaUrl: `${SITE}/account`,
      footnote: receiptUrl
        ? `Your card receipt from Stripe: <a href="${receiptUrl}" style="color:${CHAMPAGNE};">view receipt</a>.`
        : 'Stripe emails your card receipt separately.',
    }),
    text: plain({
      heading: 'Payment received',
      lines,
      rows: [['Paid', money(amountCents)], ...rows],
      cta: 'Track your kreation',
      ctaUrl: `${SITE}/account`,
    }),
  };
}

/** To the customer: Dianna wrote back in the thread. */
export function customerMessage(inquiry, body) {
  const lines = [
    `Hi ${firstName(inquiry.full_name)} — Dianna replied about your ${inquiry.base || 'kreation'}.`,
  ];
  return {
    subject: 'Dianna replied about your kreation',
    html: layout({
      preheader: body.slice(0, 90),
      eyebrow: 'New message',
      heading: 'Dianna wrote back',
      body:
        lines.map((l) => `<p style="margin:0 0 14px;">${esc(l)}</p>`).join('') +
        `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:22px 0 0;background:#241A2C;border-left:3px solid ${CHAMPAGNE};border-radius:3px;">
           <tr><td style="padding:18px 20px;font-family:${SANS};font-size:14.5px;line-height:1.7;color:${BONE};">${esc(body).replace(/\n/g, '<br>')}</td></tr>
         </table>`,
      cta: 'Reply on the site',
      ctaUrl: `${SITE}/account`,
      footnote: 'Replying to this email reaches her too.',
    }),
    text: plain({
      heading: 'Dianna wrote back',
      lines: [...lines, body],
      cta: 'Reply on the site',
      ctaUrl: `${SITE}/account`,
    }),
  };
}

/** To Dianna: the customer wrote in the thread. */
export function adminMessage(inquiry, body) {
  const lines = [`${inquiry.full_name || 'A customer'} replied about their ${inquiry.base || 'request'}.`];
  return {
    subject: `${inquiry.full_name || 'A customer'} replied`,
    html: layout({
      preheader: body.slice(0, 90),
      eyebrow: 'New message',
      heading: 'A customer wrote back',
      body:
        lines.map((l) => `<p style="margin:0 0 14px;">${esc(l)}</p>`).join('') +
        `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:22px 0 0;background:#241A2C;border-left:3px solid ${CHAMPAGNE};border-radius:3px;">
           <tr><td style="padding:18px 20px;font-family:${SANS};font-size:14.5px;line-height:1.7;color:${BONE};">${esc(body).replace(/\n/g, '<br>')}</td></tr>
         </table>`,
      cta: 'Open the studio',
      ctaUrl: `${SITE}/admin`,
      footnote: 'Answer in the studio to keep it in the thread, or just reply to this email.',
    }),
    text: plain({
      heading: 'A customer wrote back',
      lines: [...lines, body],
      cta: 'Open the studio',
      ctaUrl: `${SITE}/admin`,
    }),
  };
}

/** To Dianna: they took the price. Now she waits for the card. */
export function adminQuoteAccepted(inquiry, quote) {
  const lines = [
    `${inquiry.full_name || 'A customer'} accepted your price of ${money(quote.amount_cents)}.`,
    'They can pay by card from their account page now. You will get another email the moment the payment clears — that is when to start.',
  ];
  const rows = [
    ['Accepted', money(quote.amount_cents)],
    ['Customer', inquiry.full_name],
    ['Piece', inquiry.base],
  ];
  return {
    subject: `Accepted — ${money(quote.amount_cents)} from ${inquiry.full_name || 'a customer'}`,
    html: layout({
      preheader: 'They said yes. Payment is the next step.',
      eyebrow: 'Quote accepted',
      heading: 'They said yes',
      body: lines.map((l) => `<p style="margin:0 0 14px;">${esc(l)}</p>`).join(''),
      rows,
      cta: 'Open the studio',
      ctaUrl: `${SITE}/admin`,
    }),
    text: plain({ heading: 'Quote accepted', lines, rows, cta: 'Open the studio', ctaUrl: `${SITE}/admin` }),
  };
}

/* ============================================================= sending */

/**
 * Send one template. Never throws — callers are in payment and lead paths
 * where an email problem must not surface as a failure.
 */
export async function send(to, template, { replyTo } = {}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.NOTIFY_FROM;
  if (!apiKey || !from) return { sent: false, reason: 'resend not configured' };
  if (!to) return { sent: false, reason: 'no recipient' };

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to,
        subject: template.subject,
        html: template.html,
        text: template.text,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });
    if (!res.ok) {
      console.error('[email] rejected', res.status, await res.text());
      return { sent: false, reason: `http ${res.status}` };
    }
    return { sent: true };
  } catch (err) {
    console.error('[email] threw', err.message);
    return { sent: false, reason: err.message };
  }
}

/** Dianna's inbox. */
export function adminAddress() {
  return process.env.NOTIFY_TO || process.env.NOTIFY_FROM || null;
}