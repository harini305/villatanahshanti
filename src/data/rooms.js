// The five bedrooms plus the kitchen & dining area. Copy is verbatim from villatanahshanti.com/our-rooms.
// `occupancy` restates only what each room's own copy says.
import { img } from './images';
import { galleryById } from './gallery';

export const rooms = [
  {
    slug: 'agung',
    name: 'Agung',
    occupancy: 'King-sized double or two king-sized singles',
    view: 'Overlooks the jungle ravine',
    hero: img('agung-bedroom'),
    galleryId: 'agung',
    paragraphs: [
      'Directly overlooking the jungle ravine and with a massive peaked timber ceiling this room feels as though you are in your own majestic piece of paradise. Fall asleep upon a sumptuous pillow-top mattress, (on beds which can be configured as a huge king-sized double or two king-sized singles) with soft, plump pillows and luxurious sheets and wake to your own dawn chorus metres away from the veranda. Then wander into the huge and gobsmacking ensuite and pamper yourself with a hot shower or a romantic, petal strewn bath.',
      'As well as a bar fridge for your drinks and a safe box for your valuables there is a massive, open, but hidden, walk-through wardrobe space that can easily accommodate all of your belongings. And by midday the amazing staff have made your bed and serviced the room. How good can life get?',
    ],
  },
  {
    slug: 'batukaru',
    name: 'Batukaru',
    occupancy: 'King-sized double or two king-sized singles',
    view: 'Overlooks the jungle ravine',
    hero: img('batukaru-bedroom'),
    galleryId: 'batukaru',
    paragraphs: [
      'This room almost reflects the design and layout of Agung just across the enticing horizon infinity pool, It too overlooks the jungle ravine and, with a massive peaked timber ceiling, feels almost cathedral like in its spaciousness. Here you can fall asleep upon the sumptuous pillow-top mattress in beds that can be configured as a huge king-sized double or two king-sized singles, with soft, plump pillows and luxurious sheets and awake to your own dawn chorus meters away from the veranda. Pamper yourself with a hot or cool shower or a totally relaxing floral bath in the ensuite which, whilst totally private, also opens onto and embraces the green nature outside the window spaces.',
      'The room has a bar fridge for your drinks and a safe box for your valuables. There is a huge walk-in wardrobe and luggage room that can easily accommodate your travel belongings.',
    ],
  },
  {
    slug: 'catur',
    name: 'Catur',
    occupancy: 'Up to three: three king singles, or a king double and one single',
    view: 'Marble and rock fascias keep it cool',
    hero: img('catur-bedroom'),
    galleryId: 'catur',
    paragraphs: [
      'As well as boasting the same luxurious bedding as all the other rooms, Catur, along with Batur, can accommodate up to three people, either in three individual king sized single beds or as a king sized double and one single. This room does not open directly to the elements but as a result of this, and the marble and rock fascias, this room maintains a very pleasant and comfortable temperature, even during the hottest of Bali days. The beautiful ensuite bathroom has a rain-effect shower and very large marble and stone vanity. The overall effect is stunning.',
      'The room has a bar fridge for your drinks and a safe box for your valuables. There is a large, walk-in wardrobe and luggage room that has three individual hanging and shelf spaces to easily accommodate the belongings of its three guests.',
    ],
  },
  {
    slug: 'batur',
    name: 'Batur',
    occupancy: 'Up to three: three king singles, or a king double and one single',
    view: 'Veranda over the rice fields and jungle tree line',
    hero: img('batur-hero'),
    galleryId: 'batur',
    extraPhotos: [img('batur-hero')],
    paragraphs: [
      "Batur is located directly above Catur and has an identical layout, meaning that it too can accommodate up to three people, either in three individual king sized single beds or as a king sized double and one single. Each of the beds has the same luxurious bedding as all the other rooms, It is open and airy with a veranda overlooking the rice fields and the jungle tree line. Beautifully furnished, incorporating furniture made from natural, organically shaped and recycled timber, maybe one can sit here and take in nature's essences before joining others in the living areas. Peace, nature and nurture.",
      'The beautiful ensuite bathroom has a rain-effect shower and very large marble and stone vanity. The room has a bar fridge for your drinks and a safe box for your valuables. There is a large, walk-in wardrobe and luggage room that has three individual hanging and shelf spaces to easily accommodate the travel belongings of its three guests.',
    ],
  },
  {
    slug: 'abang',
    name: 'Abang',
    occupancy: 'Single occupant',
    view: 'Direct access to the garden',
    hero: img('abang-bedroom'),
    galleryId: 'abang',
    paragraphs: [
      "This is our only single occupant room, usually utilised by the teacher when a retreat is being held. It is tucked away in a private spot on the villa's lowest level and has direct access into the small, beautiful and lush garden area. It shares all the same furnishing styles as all the other rooms and you can luxuriate within the sumptuous bedding.",
      'The ensuite is beautifully appointed and no doubt the hot rain shower at the end of the day is very welcomed by the occupant.',
    ],
  },
];

export const kitchenDining = {
  slug: 'kitchen-dining',
  name: 'Kitchen & dining',
  hero: img('living-dining-kitchen'),
  secondary: img('living-infinity-pool'),
  galleryId: 'living-area',
  paragraphs: [
    'The first impression one has of the living area is the huge scale and openness. The European style kitchen is fully equipped and includes a gas oven where, incidentally, our girls can often be found baking their speciality and gluten free breads; so add baking smells to the enticing aspects of this villa!',
    'The simple but grand and very stylish dining and lounge furniture are all statement pieces in their own rights and the whole area overlooks the beautiful, stone lined, horizon/infinity pool with its own lush backdrop of the green jungle. All of this is enclosed within the limestone clad walls and reflected on the beautifully coloured marble floor. Different areas are picked out with natural stone lined features or with slatted timber ceilings.',
    'At night, with the dark jungle under the night sky, the warmth and detail of the numerous lighting combinations brings its own amazing and spectacular ambiance to the place. For sure, a place to relax and enjoy the company of friends and other guests.',
  ],
};

// Photos shown when "View photos" is pressed for a room: the room's gallery category,
// plus any room image that only appears on the Rooms page (Batur's hero).
export function roomPhotos(room) {
  const base = galleryById[room.galleryId].images;
  const extra = (room.extraPhotos || []).filter((e) => !base.some((b) => b.name === e.name));
  return [...extra, ...base];
}
