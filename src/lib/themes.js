/**
 * Home page themes.
 *
 * THEMES is the spec: the copy each theme swaps into the home page and the
 * particle recipe for its hero. Everything visual (colors, frames, garland)
 * lives in src/styles/pages/home-themes.css keyed on data-theme.
 *
 * Copy may contain {orderBy}, {venue}, {eventDate} and {eventTime}. Those are
 * filled from the theme's saved row (see resolveTheme) so Dianna owns the
 * dates and never edits code.
 *
 * Storage: one row per theme in home_themes (image, caption, dates, event
 * details) so each theme remembers what she last chose for it. Which theme
 * is live is the 'active_theme' key in site_settings.
 */

const REST_URL = import.meta.env.VITE_SUPABASE_URL;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const isConfigured = Boolean(REST_URL && ANON_KEY);

export const THEME_KEYS = [
  'default',
  'christmas',
  'halloween',
  'mothers-day',
  'valentines',
  'july-4',
  'juneteenth',
  'popup',
  'new-years',
];

export const THEMES = {
  default: {
    label: 'Default',
    swatch: ['#150F1A', '#B0142F', '#CBA35C'],
    bar: null,
    notice: null,
    eyebrow: 'Hand-set in Laurelton, Queens',
    h1: ['Every stone,', 'set by hand', 'for you.'],
    lede:
      'Designher Custom Kreations turns Converse, boots, denim and Crocs into one-of-one pieces — rhinestone by rhinestone, made to your story. No printed shortcuts, no two alike.',
    cta1: 'Start a Kreation',
    cta2: 'Shop Ready-Made',
    headerCta: 'Start a Kreation',
    badge: 'No. 001 — "Sapphire Row" Converse',
    stats: [
      ['2022', 'Founded by Dianna Beaty'],
      ['14 Days', 'Custom Turnaround'],
      ['50', 'State Shipping'],
    ],
    marquee: [
      '◆ Hand made always',
      '◆ designherck@gmail.com',
      '◆ Facebook / DesignHerInc',
      '◆ TikTok / @designher_inc',
      '◆ Made to order, not mass produced',
    ],
    shopEye: 'The Collection',
    shopH2: 'Shop the kreations',
    shopP:
      'Four silhouettes, endless combinations. Every piece starts as a genuine retail item — then Dianna makes it yours.',
    ribbon: '',
    bandEye: 'Ready When You Are',
    bandH2: ['Your next kreation', 'is one message away.'],
    band1: 'Start a Kreation',
    band2: 'Browse the Shop',
    fx: [],
    hasOrderBy: false,
  },

  christmas: {
    label: 'Christmas',
    swatch: ['#0C1F18', '#B0142F', '#D9B45E'],
    bar: { text: 'Holiday orders are open', detail: 'Order by {orderBy} to unwrap on time', link: 'Start a gift kreation', to: '/custom' },
    notice: { title: 'Holiday orders are open', body: 'Dianna is taking gift kreations until {orderBy}. Hand-set, one of one, wrapped and shipped in time.', cta: 'Start a gift kreation', to: '/custom' },
    eyebrow: 'Holiday kreations, set by hand',
    h1: ['Something sparkling', 'under the tree,', 'made for them.'],
    lede:
      'A pair of stones for someone who has everything. Dianna hand-sets every holiday order to their story — initials, colors, the year — so it is the gift nobody else could have wrapped.',
    cta1: 'Start a gift kreation',
    cta2: 'Shop gift-ready pieces',
    headerCta: 'Start a gift kreation',
    badge: 'Holiday No. 012 — Evergreen & Ruby Converse',
    stats: [
      ['{orderBy}', 'Holiday order cutoff'],
      ['14 Days', 'Custom Turnaround'],
      ['50', 'State Shipping'],
    ],
    marquee: [
      '✦ Holiday orders open',
      '✦ Order by {orderBy}',
      '✦ Gift-wrapped on request',
      '✦ Hand made always',
      '✦ TikTok / @designher_inc',
    ],
    shopEye: 'Gift-ready',
    shopH2: 'Ready to give, ready to wear',
    shopP:
      'Finished pieces that ship this week, for the gift you almost forgot. Every one still hand-set, still one-of-one.',
    ribbon: 'Gift pick',
    bandEye: 'Twelve days of sparkle',
    bandH2: ['The best gifts', 'are set by hand.'],
    band1: 'Start a gift kreation',
    band2: 'Browse gift-ready',
    fx: [{ type: 'snow', n: 60 }],
    hasOrderBy: true,
    defaultOrderBy: '12-06',
  },

  halloween: {
    label: 'Halloween',
    swatch: ['#0E0A14', '#E06A15', '#C9A0FF'],
    bar: { text: 'Costume season', detail: 'Custom orders placed by {orderBy} arrive before the 31st', link: 'Get spooky', to: '/custom' },
    notice: { title: 'Costume season is here', body: 'Order by {orderBy} and your stones are set before the 31st. Pumpkin, violet, jet black.', cta: 'See the dark collection', to: '/shop' },
    eyebrow: 'Costume-ready customs, Queens',
    h1: ['Bewitching stones,', 'set by hand', 'after dark.'],
    lede:
      'Pumpkin, violet, jet black — a costume is only as good as the shoes. Dianna sets rhinestone Converse, boots and Crocs that steal the party and still work on November 1st.',
    cta1: 'Start a Halloween kreation',
    cta2: 'Shop the dark collection',
    headerCta: 'Start a Kreation',
    badge: 'Halloween No. 004 — Midnight Pumpkin Boots',
    stats: [
      ['{orderBy}', 'Order by for Halloween'],
      ['14 Days', 'Custom Turnaround'],
      ['50', 'State Shipping'],
    ],
    marquee: [
      '◆ Costume season is open',
      '◆ Order by {orderBy}',
      '◆ Glow-stone options available',
      '◆ Hand made always',
      '◆ TikTok / @designher_inc',
    ],
    shopEye: 'The Dark Collection',
    shopH2: 'Trick, treat, and a little bit of both',
    shopP:
      'Ready-made pieces in pumpkin, violet and jet, for anyone whose costume deserves better shoes.',
    ribbon: 'Glows',
    bandEye: 'Dare to sparkle',
    bandH2: ['Your costume', 'is missing its shoes.'],
    band1: 'Start a Halloween kreation',
    band2: 'Browse the dark collection',
    fx: [{ type: 'ember', n: 28 }, { type: 'bat', n: 5 }],
    hasOrderBy: true,
    defaultOrderBy: '10-10',
  },

  'mothers-day': {
    label: "Mother's Day",
    swatch: ['#1E1219', '#C94A78', '#D8B27A'],
    bar: { text: "Mother's Day", detail: 'Order by {orderBy} for delivery before Sunday', link: 'Make hers', to: '/custom' },
    notice: { title: "Mother's Day kreations", body: 'Set by one mother for another. Order by {orderBy} to have it in her hands on the day.', cta: 'Make hers', to: '/custom' },
    eyebrow: 'For the woman who set every stone in you',
    h1: ['For the one', 'who made you', 'shine first.'],
    lede:
      'Her initials, her birthstone colors, her favorite pair of sneakers — set by another mother, by hand, in Laurelton. Dianna started this business as a mom; this is the order she loves most.',
    cta1: 'Start her kreation',
    cta2: 'Shop gifts for mom',
    headerCta: 'Start her kreation',
    badge: "Mother's Day No. 007 — Rose & Pearl Converse",
    stats: [
      ['{orderBy}', "Order by for Mother's Day"],
      ['14 Days', 'Custom Turnaround'],
      ['50', 'State Shipping'],
    ],
    marquee: [
      "♥ Mother's Day orders open",
      '♥ Order by {orderBy}',
      '♥ Pearl and rose stones in stock',
      '♥ Hand made always',
      '♥ Gift note included',
    ],
    shopEye: 'For Mom',
    shopH2: 'Pieces she will actually wear',
    shopP:
      'Soft rose, pearl and champagne on the silhouettes moms reach for every day. Ready to ship, ready to make her cry a little.',
    ribbon: 'For mom',
    bandEye: 'From one mother to another',
    bandH2: ['She never asked', 'for anything. Give this.'],
    band1: 'Start her kreation',
    band2: 'Browse gifts for mom',
    fx: [{ type: 'petal', n: 26 }],
    hasOrderBy: true,
    defaultOrderBy: '04-26',
  },

  valentines: {
    label: "Valentine's",
    swatch: ['#200712', '#FF3D63', '#E7B4C0'],
    bar: { text: "Valentine's Day", detail: 'Custom orders placed by {orderBy} arrive by February 14', link: 'Say it in stones', to: '/custom' },
    notice: { title: 'Say it in stones', body: 'Roses last a week. Order by {orderBy} and hand-set stones last a lot longer.', cta: 'Start a Valentine kreation', to: '/custom' },
    eyebrow: 'Hand-set in Laurelton, with love',
    h1: ['Say it', 'in stones,', 'not roses.'],
    lede:
      'Roses last a week. A pair of hand-set rhinestone Converse with your date, your initials, or the thing only the two of you say — that lasts. Made to order, no two alike.',
    cta1: 'Start a Valentine kreation',
    cta2: 'Shop the love edit',
    headerCta: 'Start a Kreation',
    badge: 'Valentine No. 002 — Heartline Ruby Converse',
    stats: [
      ['{orderBy}', 'Order by for Feb 14'],
      ['14 Days', 'Custom Turnaround'],
      ['50', 'State Shipping'],
    ],
    marquee: [
      '♥ Valentine orders open',
      '♥ Order by {orderBy}',
      '♥ Matching pairs available',
      '♥ Hand made always',
      '♥ TikTok / @designher_inc',
    ],
    shopEye: 'The Love Edit',
    shopH2: 'Ready-made, ready to give',
    shopP:
      'Ruby, blush and pearl on the pieces they already love. Ships this week for the ones who plan late.',
    ribbon: 'Pairs',
    bandEye: 'Fourteen days, one pair',
    bandH2: ['Love is', 'a made-to-order thing.'],
    band1: 'Start a Valentine kreation',
    band2: 'Browse the love edit',
    fx: [{ type: 'heart', n: 18 }],
    hasOrderBy: true,
    defaultOrderBy: '01-31',
  },

  'july-4': {
    label: '4th of July',
    swatch: ['#0C1330', '#C8102E', '#EDEFF2'],
    bar: { text: 'Independence Day', detail: 'Red, white and rhinestone customs — order by {orderBy}', link: 'Start yours', to: '/custom' },
    notice: { title: 'Red, white and rhinestone', body: 'Ruby, platinum and sapphire for the cookout. Order by {orderBy} for the long weekend.', cta: 'Start yours', to: '/custom' },
    eyebrow: 'Hand-set in Queens, worn nationwide',
    h1: ['Red, white', 'and', 'rhinestone.'],
    lede:
      'Cookout, block party, the parade on Merrick Boulevard — Dianna sets ruby, platinum and sapphire stones on the Converse, boots and Crocs you will be wearing when the fireworks go up.',
    cta1: 'Start a July 4th kreation',
    cta2: 'Shop red, white & blue',
    headerCta: 'Start a Kreation',
    badge: 'July 4th No. 003 — Stars & Stripes Converse',
    stats: [
      ['{orderBy}', 'Order by for July 4'],
      ['14 Days', 'Custom Turnaround'],
      ['50', 'State Shipping'],
    ],
    marquee: [
      '★ Independence Day orders open',
      '★ Order by {orderBy}',
      '★ Ruby, platinum and sapphire in stock',
      '★ Hand made always',
      '★ Facebook / DesignHerInc',
    ],
    shopEye: 'Stars & Stripes',
    shopH2: 'Ready for the cookout',
    shopP:
      'Ready-made pieces in ruby, platinum and sapphire. Ships in time for the long weekend.',
    ribbon: 'Parade ready',
    bandEye: 'Light it up',
    bandH2: ['Every firework', 'needs a pair of shoes.'],
    band1: 'Start a July 4th kreation',
    band2: 'Browse the edit',
    fx: [{ type: 'spark', n: 7 }],
    hasOrderBy: true,
    defaultOrderBy: '06-20',
  },

  juneteenth: {
    label: 'Juneteenth',
    swatch: ['#0B0B0D', '#C8102E', '#007940'],
    bar: { text: 'Juneteenth', detail: 'Celebrating freedom, community and Black-owned craft in Queens', link: 'Read our story', to: '/about' },
    notice: { title: 'Juneteenth, set by hand', body: 'A Black woman-owned studio in Southeast Queens. Red, black, green and gold, ordered by {orderBy}.', cta: 'Read our story', to: '/about' },
    eyebrow: 'Black-owned, hand-set in Laurelton',
    h1: ['Freedom,', 'set by hand,', 'one stone at a time.'],
    lede:
      'Designher is a Black woman-owned studio in Southeast Queens. This June we are setting red, black, green and gold on Converse, boots and Crocs for the cookouts, parades and family days that matter.',
    cta1: 'Start a Juneteenth kreation',
    cta2: 'Shop the freedom edit',
    headerCta: 'Start a Kreation',
    badge: 'Juneteenth No. 001 — Red, Black & Green Converse',
    stats: [
      ['{orderBy}', 'Order by for June 19'],
      ['14 Days', 'Custom Turnaround'],
      ['50', 'State Shipping'],
    ],
    marquee: [
      '★ Juneteenth orders open',
      '★ Order by {orderBy}',
      '★ Black woman-owned since 2022',
      '★ Hand made always',
      '★ Laurelton, Queens',
    ],
    shopEye: 'The Freedom Edit',
    shopH2: 'Red, black, green and gold',
    shopP:
      'Ready-made pieces in the colors of the day, on the silhouettes you already wear.',
    ribbon: 'Juneteenth',
    bandEye: 'Since 1865, since 2022',
    bandH2: ['Made free.', 'Made by hand.'],
    band1: 'Start a Juneteenth kreation',
    band2: 'Browse the edit',
    fx: [{ type: 'star', n: 22 }],
    hasOrderBy: true,
    defaultOrderBy: '06-05',
  },

  popup: {
    label: 'Pop-up shop',
    swatch: ['#150F1A', '#FF3D63', '#CBA35C'],
    bar: { text: 'Pop-up shop', detail: '{eventDate} · {venue} · {eventTime}', link: 'Get directions', to: 'directions' },
    notice: { title: 'Pop-up shop — {eventDateShort}', body: '{venue}, {eventTime}. Try pieces on, take them home the same day. Cash and card.', cta: 'Get directions', to: 'directions' },
    eyebrow: 'Next pop-up · {venue}',
    h1: ['See the stones', 'in person', '{eventDayPhrase}'],
    lede:
      'Dianna is bringing the full inventory to {venue} — sneakers, boots, jackets and Crocs you can hold, try on and take home the same day. No wait, no shipping, cash and card.',
    cta1: 'Get directions',
    cta2: 'Shop online instead',
    headerCta: 'Get directions',
    badge: '',
    stats: [
      ['{eventDateShort}', '{venue}'],
      ['{eventTimeShort}', 'Same-day pickup'],
      ['40+', 'Pieces on the table'],
    ],
    marquee: [
      '◆ Pop-up · {eventDate}',
      '◆ {venue}',
      '◆ {eventTime}',
      '◆ Try on, take home',
      '◆ Cash and card',
    ],
    shopEye: 'On the table',
    shopH2: 'Come see these in person',
    shopP:
      'A preview of what is coming to the pop-up. Anything you see here can be held at the table.',
    ribbon: 'At the pop-up',
    bandEye: '{venue} · {eventDate}',
    bandH2: ["Can't make it?", 'The shop never closes.'],
    band1: 'Shop online',
    band2: 'Start a Kreation',
    fx: [{ type: 'pin', n: 12 }],
    hasOrderBy: false,
    hasEvent: true,
  },

  'new-years': {
    label: "New Year's",
    swatch: ['#09080B', '#E0BC63', '#EDEFF2'],
    bar: { text: 'New Year, new one-of-ones', detail: 'Custom orders for the countdown close {orderBy}', link: 'Ring it in', to: '/custom' },
    notice: { title: 'New year, new one-of-ones', body: 'Champagne, platinum and jet for midnight. Custom orders close {orderBy}.', cta: 'Start a kreation', to: '/custom' },
    eyebrow: 'Hand-set in Laurelton, ready for midnight',
    h1: ['New year,', 'new', 'one-of-ones.'],
    lede:
      'Champagne, platinum, jet black. Whatever you are wearing at midnight, Dianna sets the stones that catch every flash in the room — and every year that follows.',
    cta1: "Start a New Year's kreation",
    cta2: 'Shop the midnight edit',
    headerCta: 'Start a Kreation',
    badge: 'New Year No. 027 — Champagne Toast Converse',
    stats: [
      ['{orderBy}', 'Order by for the countdown'],
      ['14 Days', 'Custom Turnaround'],
      ['50', 'State Shipping'],
    ],
    marquee: [
      "✦ New Year's orders open",
      '✦ Order by {orderBy}',
      '✦ Champagne and platinum stones',
      '✦ Hand made always',
      '✦ Set by hand',
    ],
    shopEye: 'The Midnight Edit',
    shopH2: 'Ready before the ball drops',
    shopP:
      'Champagne, platinum and jet on ready-made pieces. Ships in time for the countdown.',
    ribbon: 'Midnight',
    bandEye: 'Ten, nine, eight',
    bandH2: ['Start the year', 'one-of-one.'],
    band1: "Start a New Year's kreation",
    band2: 'Browse the midnight edit',
    fx: [{ type: 'bubble', n: 26 }, { type: 'confetti', n: 22 }],
    hasOrderBy: true,
    defaultOrderBy: '12-20',
  },
};

/* ------------------------------------------------------------- formatting */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** 'YYYY-MM-DD' -> local Date (avoids the UTC-midnight shift of new Date(str)). */
export function parseDate(str) {
  if (!str) return null;
  const [y, m, d] = str.split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

/** 'HH:MM[:SS]' -> '11am' / '5:30pm' */
export function fmtTime(str) {
  if (!str) return '';
  const [h, m] = str.split(':').map(Number);
  const ampm = h >= 12 ? 'pm' : 'am';
  const hh = h % 12 || 12;
  return m ? `${hh}:${String(m).padStart(2, '0')}${ampm}` : `${hh}${ampm}`;
}

function fill(text, vars) {
  return text.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? ''));
}

/**
 * Merge a theme spec with its saved row and fill every placeholder.
 * Returns plain strings the page can render directly.
 */
export function resolveTheme(key, row, siteDefaults) {
  const spec = THEMES[key] || THEMES.default;
  row = row || {};

  // Order-by: saved date, else the spec's default month-day in the current year.
  let orderBy = '';
  if (spec.hasOrderBy) {
    let d = parseDate(row.order_by_date);
    if (!d && spec.defaultOrderBy) {
      const [m, dd] = spec.defaultOrderBy.split('-').map(Number);
      d = new Date(new Date().getFullYear(), m - 1, dd);
    }
    if (d) orderBy = `${MONTHS[d.getMonth()]} ${d.getDate()}`;
  }

  // Pop-up event details.
  const venue = row.event_venue || 'Rochdale Village';
  const address = row.event_address || '';
  const eventDateObj = parseDate(row.event_date);
  const eventDate = eventDateObj
    ? `${DAYS[eventDateObj.getDay()]}, ${MONTHS_LONG[eventDateObj.getMonth()]} ${eventDateObj.getDate()}`
    : 'Date to be announced';
  const eventDateShort = eventDateObj
    ? `${DAYS[eventDateObj.getDay()].slice(0, 3)} ${MONTHS[eventDateObj.getMonth()]} ${eventDateObj.getDate()}`
    : 'TBA';
  const start = fmtTime(row.event_start);
  const end = fmtTime(row.event_end);
  const eventTime = start && end ? `${start} – ${end}` : start || 'Hours to be announced';
  const eventTimeShort = start && end ? `${start.replace(/[ap]m/, '')} – ${end.replace(/[ap]m/, '')}` : start || 'TBA';

  let eventDayPhrase = 'soon.';
  if (eventDateObj) {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const diff = Math.round((eventDateObj - today) / 86400000);
    if (diff === 0) eventDayPhrase = 'today.';
    else if (diff === 1) eventDayPhrase = 'tomorrow.';
    else if (diff > 1 && diff <= 6) eventDayPhrase = `this ${DAYS[eventDateObj.getDay()]}.`;
    else if (diff > 6) eventDayPhrase = `on ${MONTHS[eventDateObj.getMonth()]} ${eventDateObj.getDate()}.`;
    else eventDayPhrase = 'soon.';
  }

  // Countdown target (local time) for the pop-up card.
  let eventStartAt = null;
  if (eventDateObj) {
    eventStartAt = new Date(eventDateObj);
    if (row.event_start) {
      const [h, m] = row.event_start.split(':').map(Number);
      eventStartAt.setHours(h || 0, m || 0, 0, 0);
    }
  }

  const vars = { orderBy, venue, eventDate, eventDateShort, eventTime, eventTimeShort, eventDayPhrase };
  const f = (s) => fill(s, vars);

  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address ? `${venue}, ${address}` : `${venue}, Queens, NY`
  )}`;

  // Did Dianna actually pick a photo FOR this theme, or is this just the
  // everyday hero standing in? The notification card needs to know: showing
  // a sneaker beside the words "Valentine's Day" looks worse than showing
  // no photo at all.
  const ownImage = Boolean(row.hero_image_url);
  const heroImage = row.hero_image_url || siteDefaults.hero_image_url;
  const heroBadge =
    key === 'default'
      ? (siteDefaults.hero_badge ?? spec.badge)
      : (row.hero_badge ?? spec.badge);

  return {
    key,
    label: spec.label,
    bar: spec.bar
      ? {
          text: f(spec.bar.text),
          detail: f(spec.bar.detail),
          link: spec.bar.link,
          to: spec.bar.to === 'directions' ? directionsUrl : spec.bar.to,
          external: spec.bar.to === 'directions',
        }
      : null,
    eyebrow: f(spec.eyebrow),
    h1: spec.h1.map(f),
    lede: f(spec.lede),
    cta1: spec.cta1,
    cta2: spec.cta2,
    headerCta: spec.headerCta,
    cta1To: key === 'popup' ? directionsUrl : '/custom',
    cta2To: '/shop',
    badge: heroBadge,
    stats: spec.stats.map(([b, s]) => [f(b), f(s)]),
    marquee: spec.marquee.map(f),
    shopEye: f(spec.shopEye),
    shopH2: f(spec.shopH2),
    shopP: f(spec.shopP),
    ribbon: spec.ribbon,
    bandEye: f(spec.bandEye),
    bandH2: spec.bandH2.map(f),
    band1: spec.band1,
    band2: spec.band2,
    band1To: key === 'popup' ? '/shop' : '/custom',
    band2To: key === 'popup' ? '/custom' : '/shop',
    fx: spec.fx,
    heroImage,
    ownImage,
    notice: spec.notice
      ? {
          title: f(spec.notice.title),
          body: f(spec.notice.body),
          cta: spec.notice.cta,
          to: spec.notice.to === 'directions' ? directionsUrl : spec.notice.to,
          external: spec.notice.to === 'directions',
        }
      : null,
    event: spec.hasEvent
      ? { venue, address, eventDate, eventTime, startAt: eventStartAt, directionsUrl }
      : null,
  };
}

/* ---------------------------------------------------------------- reads */

const restHeaders = { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` };

/** All saved theme rows, keyed by theme_key. Admin + public. */
export async function fetchThemeRows() {
  if (!isConfigured) return {};
  try {
    const res = await fetch(`${REST_URL}/rest/v1/home_themes?select=*`, { headers: restHeaders });
    if (!res.ok) return {};
    const rows = await res.json();
    return Object.fromEntries((rows || []).map((r) => [r.theme_key, r]));
  } catch {
    return {};
  }
}

/** The key of the live theme. Falls back to 'default' on any failure. */
export async function fetchActiveThemeKey() {
  if (!isConfigured) return 'default';
  try {
    const res = await fetch(
      `${REST_URL}/rest/v1/site_settings?select=value&key=eq.active_theme`,
      { headers: restHeaders }
    );
    if (!res.ok) return 'default';
    const rows = await res.json();
    const v = rows?.[0]?.value;
    return THEMES[v] ? v : 'default';
  } catch {
    return 'default';
  }
}

/* --------------------------------------------------------------- writes */

async function sdk() {
  const mod = await import('./supabase.js');
  return mod.supabase;
}

/** Save (upsert) one theme's own settings. */
export async function saveThemeRow(themeKey, patch) {
  const supabase = await sdk();
  const { error } = await supabase
    .from('home_themes')
    .upsert({ theme_key: themeKey, ...patch }, { onConflict: 'theme_key' });
  return { error };
}

/** Make a theme live. */
export async function setActiveTheme(themeKey) {
  const supabase = await sdk();
  const { error } = await supabase
    .from('site_settings')
    .upsert({ key: 'active_theme', value: themeKey }, { onConflict: 'key' });
  return { error };
}