/* ---------------------------------------------------------------------------
 * PLACEHOLDER CONTENT — NOT REAL CUSTOMER REVIEWS.
 *
 * Every quote below was written to demonstrate the layout. None of it came
 * from an actual customer. Replace this whole array with real reviews (Etsy,
 * Instagram comments, text messages Dianna has saved) before launch.
 *
 * Shape of a review:
 *   id        unique string
 *   name      first name + last initial is plenty
 *   location  "City, ST"
 *   piece     what was made
 *   category  must match an id in REVIEW_FILTERS below
 *   rating    1-5
 *   body      the review itself
 * ------------------------------------------------------------------------ */

export const REVIEW_FILTERS = [
  { id: 'all', label: 'Everything' },
  { id: 'sneakers', label: 'Sneakers' },
  { id: 'boots', label: 'Boots' },
  { id: 'jackets', label: 'Jackets' },
  { id: 'kids', label: 'Kids' },
];

export const REVIEWS = [
  {
    id: 'r1',
    name: 'Renee W.',
    location: 'Bronx, NY',
    piece: 'Hand-set Converse',
    category: 'sneakers',
    rating: 5,
    body:
      'My sorority sisters asked where I got them before I even sat down. ' +
      'Worth every day of the wait.',
  },
  {
    id: 'r2',
    name: 'Tasha M.',
    location: 'Newark, NJ',
    piece: 'Diamond Girl boots',
    category: 'boots',
    rating: 5,
    body:
      "Ordered these for my daughter's graduation. The photos came back looking " +
      'like a magazine shoot.',
  },
  {
    id: 'r3',
    name: 'Monique J.',
    location: 'Queens, NY',
    piece: 'Manifesting Blessings jacket',
    category: 'jackets',
    rating: 5,
    body:
      'The jacket fits exactly how we sketched it out over text. That kind of ' +
      'care is rare now.',
  },
  {
    id: 'r4',
    name: 'Iris B.',
    location: 'Atlanta, GA',
    piece: 'Custom sneakers',
    category: 'sneakers',
    rating: 5,
    body:
      'Shipped to Atlanta in exactly fourteen days, just like she said it would. ' +
      'Already planning the next pair.',
  },
  {
    id: 'r5',
    name: 'Danielle P.',
    location: 'Philadelphia, PA',
    piece: 'Unicorn bow set',
    category: 'kids',
    rating: 5,
    body:
      'My four-year-old refuses to take it off. She sleeps in it. I am not ' +
      'exaggerating for the review.',
  },
  {
    id: 'r6',
    name: 'Carla R.',
    location: 'Mount Vernon, NY',
    piece: 'Pearl low-tops',
    category: 'sneakers',
    rating: 4,
    body:
      'Beautiful work. I asked for a rush and she was upfront that it would push ' +
      'the timeline instead of just saying yes. I respected that.',
  },
  {
    id: 'r7',
    name: 'Yvette S.',
    location: 'Laurelton, NY',
    piece: 'Rhinestone booties',
    category: 'boots',
    rating: 5,
    body:
      'Third order. She remembers what I picked last time and works around it so ' +
      'nothing looks repeated.',
  },
  {
    id: 'r8',
    name: 'Brianna T.',
    location: 'Baltimore, MD',
    piece: 'Denim jacket',
    category: 'jackets',
    rating: 5,
    body:
      'Sent a blurry inspiration photo off Pinterest and got back something better ' +
      'than the picture.',
  },
];
