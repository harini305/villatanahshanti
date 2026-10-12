// Image registry: optimised files (images.generated.json, produced by scripts/optimize-images.mjs)
// joined with descriptive alt text. Words baked into the pixels (room names, "Tofu Curry"…) are
// included in the alt text so screen-reader users get the same information.
import generated from './images.generated.json';

const ALT = {
  // brand
  'logo-rice-plant': '',
  'wheat-field': '',
  'palm-leaf-janur': '',
  'young-coconuts': 'A pile of fresh young green coconuts, ready to be opened for their juice.',
  // home
  'team-on-stairs':
    'The Villa Tanah Shanti staff, Putri, Arik, Dewa and Wayan, posing on the villa’s marble staircase in matching green batik shirts.',
  'team-in-doorway': 'Five smiling members of the villa staff in green batik shirts peeking out from behind a stone doorway.',
  'video-poster': 'A woman in a white kebaya and pink sash carrying a canang offering down the villa’s garden steps.',
  // rooms
  'batur-hero': 'Batur bedroom with three king single beds under white mosquito nets and blue cushions, with “Batur” written in script.',
  // yoga
  'yoga-shala':
    'The empty yoga shala: a honey-toned sprung timber floor, open sides to the jungle and three large rattan cocoon pendant lights.',
  'yoga-room-entrance':
    'A woman sitting quietly behind the open carved wooden doors of the yoga room, framed by leaves, with the words “Yoga Room Entrance”.',
  'ganesha-statue': 'A stone Ganesha statue garlanded with orange marigolds.',
  'shala-set-up-with-mats': 'The yoga shala set up for a class with purple mats and green bolsters laid out in rows.',
  // spa
  'exhale-spa': 'The open-sided Exhale Spa treatment room facing the garden, with “Exhale Spa” written in script.',
  'spa-treatment-room':
    'The open-sided in-house spa with a treatment bed, an easel and green loungers facing the garden, with “Exhale Spa” written in script.',
  // food
  'tofu-cashew-curry': 'Tofu and cashew curry served with red rice and a carved carrot rose, with the words “Tofu Curry”.',
  'mexican-bean-wraps': 'Mexican bean wraps with guacamole served on a banana leaf.',
  'noodle-salad': 'A fresh noodle salad served on a banana leaf and decorated with orchids.',
  // gallery — Agung
  'agung-canopy-bed': 'Agung: a king-sized canopy bed draped in white netting, with doors open to the garden.',
  'agung-ensuite-bath': 'Agung ensuite: a stone vanity and a freestanding bath.',
  'agung-bedroom': 'Agung bedroom with a canopy bed and colourful cushions, with “Agung” written in script.',
  'agung-veranda': 'Agung’s private veranda with lounge chairs overlooking the jungle ravine.',
  'agung-timber-ceiling': 'Agung bedroom beneath its massive peaked timber ceiling.',
  // Batukaru
  'batukaru-bedroom-wide': 'Batukaru: a wide view of the bedroom and its peaked timber ceiling.',
  'batukaru-veranda': 'Batukaru’s veranda looking out to the green jungle.',
  'batukaru-bedroom': 'Batukaru bedroom with a netted four-poster bed, with “Batukaru” written in script.',
  'batukaru-bedroom-desk': 'Batukaru bedroom with a writing desk beside the bed.',
  'batukaru-petal-bath': 'A round bath in the Batukaru ensuite strewn with flower petals.',
  'batukaru-ensuite-vanity': 'Batukaru ensuite vanity decorated with red heliconia flowers.',
  // Catur
  'catur-bedroom-framed': 'Catur bedroom, shown in a white photo frame.',
  'catur-bedroom-portrait-art': 'Catur bedroom with a large portrait artwork above the beds.',
  'catur-bedroom': 'Catur bedroom with netted beds and a marble and rock wall, with “Catur” written in script.',
  'catur-bedroom-wall': 'Catur bedroom and its natural stone feature wall, shown in a white photo frame.',
  'catur-rain-shower': 'Catur ensuite with a rain-effect shower and marble and stone vanity.',
  // Batur
  'batur-two-beds': 'Batur bedroom with netted single beds and blue-cushioned benches.',
  'batur-ensuite-vanity': 'Batur’s marble and stone ensuite vanity, shown in a white photo frame.',
  'batur-seating-nook': 'A seating nook with recycled timber furniture in Batur, shown in a white photo frame.',
  'batur-three-beds': 'Batur bedroom with three single beds and blue cushions.',
  'batur-twin-beds': 'Twin beds in Batur, shown in a white photo frame.',
  'batur-window-bed': 'A bed beside a large window looking out to the trees in Batur.',
  // Abang
  'abang-garden-terrace': 'Abang’s garden terrace with rattan seats.',
  'abang-ensuite': 'The Abang ensuite bathroom.',
  'abang-bedroom': 'Abang bedroom with a netted bed and a timber desk, with “Abang” written in script.',
  'abang-stone-shower': 'Abang’s stone-walled rain shower with a ladder towel rail.',
  'abang-pool-wall-garden': 'A green-tiled pool wall and garden steps beside Abang.',
  'abang-garden-staircase': 'A stone staircase winding through the lush garden.',
  // Living area
  'living-dining-kitchen': 'The long timber dining table with rattan stools and the European style kitchen behind.',
  'living-dining-wide': 'A wide view of the open dining area and kitchen under a slatted timber ceiling.',
  'living-lounge-mural': 'The lounge with a large portrait mural and statement furniture.',
  'living-retreat-group-sofa': 'A smiling retreat group gathered together on the lounge sofa.',
  'living-infinity-pool': 'The stone-lined infinity pool with sun loungers and a backdrop of green jungle.',
  'living-pool-pavilion': 'The infinity pool beside the open lounge pavilion.',
  'living-infinity-pool-edge': 'The edge of the infinity pool merging into the jungle view.',
  'living-poolside-yoga': 'A retreat group stretching together beside the infinity pool.',
  // Happy snaps
  'snaps-villa-render': 'An architectural render of Villa Tanah Shanti, shown in a white photo frame.',
  'snaps-staircase-hall': 'The staircase and hall with a timber handrail.',
  'snaps-aerial-view': 'An aerial view of the villa surrounded by jungle and rice fields.',
  'snaps-carved-entry-door': 'A carved entry door and lawn, shown in a white photo frame.',
  'snaps-staff-jumping': 'The villa staff jumping for joy beside the pool.',
  'snaps-towel-art-bed': 'Rolled green towels and orange flowers arranged on a freshly made bed, shown in a white photo frame.',
  'snaps-entrance-courtyard': 'The entrance courtyard with a traditional carved door.',
  'snaps-towel-swans': 'Two towel swans forming a heart on a bed, shown in a white photo frame.',
  'snaps-flower-mandala': 'A retreat group sitting around a flower mandala.',
  'snaps-kitten-statue': 'A kitten sitting beside a stone statue, shown in a white photo frame.',
  'snaps-offerings-on-steps': 'Women in traditional dress carrying offerings up the steps.',
};

// Images whose white frame and shadow are rendered into the pixels (no extra UI frame).
const BAKED_FRAME = new Set([
  'snaps-kitten-statue',
  'tofu-cashew-curry',
  'snaps-towel-swans',
  'batur-seating-nook',
  'snaps-carved-entry-door',
  'catur-bedroom-framed',
  'catur-bedroom-wall',
  'snaps-villa-render',
  'batur-twin-beds',
  'team-in-doorway',
  'yoga-room-entrance',
  'snaps-towel-art-bed',
  'batur-ensuite-vanity',
]);

export function img(name) {
  const g = generated[name];
  if (!g || g.skipped) throw new Error(`Unknown image: ${name}`);
  return { name, src: g.src, width: g.width, height: g.height, blurDataURL: g.blurDataURL, alt: ALT[name] ?? '', bakedFrame: BAKED_FRAME.has(name) };
}
