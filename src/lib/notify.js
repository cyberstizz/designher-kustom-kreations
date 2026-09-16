/**
 * Tells the server that something happened, so it can send the emails.
 *
 * Fire-and-forget on purpose. The request or the quote is already saved in
 * the database by the time this runs, so a failed email must never surface
 * to the person as a failed submission. Errors go to the console only.
 */
export function notify(event, id) {
  if (!id) return Promise.resolve();
  return fetch('/.netlify/functions/notify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event, id }),
  })
    .then((res) => {
      if (!res.ok) console.error('[notify]', event, res.status);
    })
    .catch((err) => {
      console.error('[notify]', event, err.message);
    });
}

/** A customer just sent a custom request. Emails Dianna and the customer. */
export function notifyInquiryCreated(inquiryId) {
  return notify('inquiry_created', inquiryId);
}

/** Dianna just priced a request. Emails the customer their quote. */
export function notifyQuoteSent(quoteId) {
  return notify('quote_sent', quoteId);
}
