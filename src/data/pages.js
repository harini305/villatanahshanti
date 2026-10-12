// Verbatim page copy from villatanahshanti.com (CONTENT_ASSET_INVENTORY.md).
// Inline links are structured segments ({ text, href, external }) rendered by <RichText>.
import { site } from './site';
import { img } from './images';

export const home = {
  about: {
    label: 'About Us',
    paragraphs: [
      "Villa Tanah Shanti is a luxurious, architecturally designed villa with a modern Bali feel. Situated only a 10 minute walk from Ubud's town centre, it is quietly set amongst nature with a stunning view onto a deep jungle ravine. This villa was designed as a perfect place to host a yoga retreat, a training event or simply as a holiday base for up to 11 people. And we can accommodate another 6 students in a 'sister' villa alongside of us which is finished and furnished to the same high standard and in a similar style to Villa Tanah Shanti. This allows for a total of 17 people to be accommodated.",
      [
        'The villa is fully staffed, including during the evenings and into the night-time, and our cooks can conjure up some amazing banquets or, if you wish, just a simple meal. The kitchen is of a modern European design and the adjacent living and dining area is huge! Our guests have the choice of 5 stunning bedrooms, all beautifully appointed and decorated, 2 of which can be configured for double, twin or triple occupancy, 2 for double or twin occupancy and 1 single occupant room. Or of course you can have the whole villa for just you and whoever you wish to share your amazing experience with. We do take bookings for individual rooms when we are not hosting a retreat and you can check availability ',
        { text: 'here', href: site.airbnbUrl, external: true, label: 'check room availability on Airbnb' },
        '.',
      ],
      'We have an on-site spa where our guests can indulge in numerous body treatments for which Bali is famous and a 6 x 10 meter yoga studio which overlooks our spectacular infinity pool and the jungle ravine. The studio can also be used for workshops, dancing, art retreats and similar events.',
      'We invite you to come and experience our hospitality and impeccable service, beautiful food, exquisite surroundings and let us share with you everything else that the Island of the Gods has to offer you.',
    ],
    signOff: 'Om shanti, shanti shanti - The Villa Tanah Shanti Team.',
    // Short restatements of facts given in the About copy above (no new claims).
    facts: [
      { value: '10 min', label: "walk from Ubud's town centre" },
      { value: '5', label: 'stunning bedrooms' },
      { value: '11', label: 'guests, or 17 with our sister villa' },
      { value: '6 × 10 m', label: 'yoga studio over the infinity pool' },
    ],
  },
  team: {
    label: 'The Team',
    intro: 'This is the amazing and fabulous crew that helps make this place what it is.',
    order: 'Clockwise from bottom left,',
    members: [
      { name: 'Putri', text: "Putri is Wayan's apprentice and a real delight. She has a wicked sense of humour and will always find something to smile about." },
      { name: 'Arik', text: "Arik is a 'can-do' guy. If you need a local contact, he will surely be able to assist you." },
      { name: 'Dewa', text: 'Dewa is another DIY marvel and a jester who can certainly keep you entertained. When you want to be!' },
      {
        name: 'Wayan',
        text: "And finally, Wayan. She is the key to keeping everything running smoothly. She is someone everybody loves and if she can't help you, no one can!",
      },
    ],
    closing:
      "You might also catch sight of Dadong, Wayan's quiet but determined mother, who is often on site tending her beautiful gardens and generally lending a hand.",
    photo: img('team-on-stairs'),
    secondaryPhoto: img('team-in-doorway'),
  },
};

export const yoga = {
  label: 'Yoga Shala',
  title: 'Our Yoga Shala',
  hero: img('yoga-shala'),
  paragraphs: [
    'Villa Tanah Shanti has primarily been designed as a beautiful place to hold yoga retreats and trainings or other, similar, activities such as art or dance retreats. As well as creating amazing and luxurious living quarters we have also been able to focus our attention on creating a breath-taking and yet practical, fully equipped space complete with mats, bolsters, blankets, straps and eight aerial silks.',
    "Our space measures 6 x 12 mtrs and is open to nature's surroundings with an inspiring view of our infinity pool and the jungle ravine. A high peaked timber and rattan ceiling, fans and three huge cocoon shaped lights all add to the stunning scale of the place.",
    'With yoga practitioners in mind, the studio has a superb sprung timber floor, perfect for yoga, dance and other similar activities. We have a high quality stereo sound system in the room, with cable or Bluetooth connection, although nature provides the perfect meditation music with the many birds, luwaks, butterflies, squirrels, dragonflies, cicadas, tokays, fire-flies, frogs, and probably other, yet to be discovered, neighbours! Your very own symphony of sound. It is a joy to practise in this nature enriched space.',
    'The studio is fully equipped with quality yoga mats, blankets, blocks, straps, meditation cushions, bolsters and eye pillows. And we also have art stands and stools for those looking for somewhere to host an art based retreat perhaps.',
  ],
  // Restated from the copy above.
  equipment: [
    'Quality yoga mats',
    'Bolsters',
    'Blankets',
    'Blocks',
    'Straps',
    'Meditation cushions',
    'Eye pillows',
    'Eight aerial silks',
    'Art stands and stools',
    'Stereo with cable or Bluetooth',
  ],
  features: [
    { value: '6 × 12 m', label: 'open to nature' },
    { value: 'Sprung', label: 'timber floor' },
    { value: '3', label: 'huge cocoon shaped lights' },
  ],
  setUp: img('shala-set-up-with-mats'),
  // the three photos recovered from the legacy /yoga-space-and-facilities page, plus related retreat shots
  photos: [img('shala-set-up-with-mats'), img('yoga-room-entrance'), img('snaps-flower-mandala')],
};

export const spa = {
  label: 'Exhale Spa',
  title: 'Our In-house Spa',
  hero: img('spa-treatment-room'),
  feature: img('exhale-spa'),
  paragraphs: [
    'Set on the lowest level of the villa, this quiet and private spa is for the exclusive use of our guests. Treatments will usually need to be booked in advance so that our specially trained therapists can attend.',
    "We use and recommend a beautiful local organic skin and body product, 'Sensatia Botanicals', which we have trialed extensively. This superb range is rich in nutrients and vitamins and blended with a mixture of high quality natural plant extracts. We also use hand-produced, unrefined, virgin coconut oil from one of our close by local villages, for our massages.",
  ],
  listIntro: 'We can offer the following treatments on site:',
  treatments: ['Balinese traditional massage', 'Hot rock massage', 'Facial treatments', 'Body scrubs', 'Pedicures', 'Manicures'],
};

export const food = {
  label: 'Meals',
  title: 'Our Cuisine',
  hero: img('young-coconuts'),
  dishes: [img('tofu-cashew-curry'), img('mexican-bean-wraps'), img('noodle-salad')],
  paragraphs: [
    "Our amazing staff take great pride in preparing all our food on the premises and strive to create dishes that are beyond guests' expectations. We run a completely gluten free kitchen at the villa and we even make our own bread, baked on the premises of course, and you know how good that smells!",
    'Meals are generally based on traditional Balinese cuisine and come with a twist. We do a tasty Mexican bean wrap as well as, we think, the best cashew curry in Bali! And you also have to try our delicious roasted tomato soup.',
    "Breakfasts, being the meal that sets us up for the day, are both delicious and nutritious. We use fresh seasonal produce and certainly organic produce if it is available. We have a fresh drinks menu that you can order from throughout your day, as well as having a selection of herbal teas on tap all day for our guests. Fresh, filtered drinking water is also plentiful. Or why not, when in Bali, do as the Balinese do and simply grab a young coconut, from our coconut stand, and sip the refreshing juice using an organic straw which is made from the papaya tree's leaf stems. There is no better way to quench your thirst than with nature's very own coconut water. And all done perhaps whilst lounging next to the pool taking in the sounds and serenity of nature.",
    'Oh, and did I mention the home made coconut ice-cream?',
  ],
};

export const contact = {
  successMessage: 'Thank you for your enquiry. We will get back to you as soon as we can.',
};
