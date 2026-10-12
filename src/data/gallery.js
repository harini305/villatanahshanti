// The /photos gallery: 7 categories, 47 images, in the order of the original Wix Pro Gallery.
import { img } from './images';

const cat = (id, label, names) => ({ id, label, images: names.map(img) });

export const galleryCategories = [
  cat('agung', 'Agung', ['agung-canopy-bed', 'agung-ensuite-bath', 'agung-bedroom', 'agung-veranda', 'agung-timber-ceiling']),
  cat('batukaru', 'Batukaru', [
    'batukaru-bedroom-wide',
    'batukaru-veranda',
    'batukaru-bedroom',
    'batukaru-bedroom-desk',
    'batukaru-petal-bath',
    'batukaru-ensuite-vanity',
  ]),
  cat('catur', 'Catur', ['catur-bedroom-framed', 'catur-bedroom-portrait-art', 'catur-bedroom', 'catur-bedroom-wall', 'catur-rain-shower']),
  cat('batur', 'Batur', ['batur-two-beds', 'batur-ensuite-vanity', 'batur-seating-nook', 'batur-three-beds', 'batur-twin-beds', 'batur-window-bed']),
  cat('abang', 'Abang', [
    'abang-garden-terrace',
    'abang-ensuite',
    'abang-bedroom',
    'abang-stone-shower',
    'abang-pool-wall-garden',
    'abang-garden-staircase',
  ]),
  cat('living-area', 'Living Area', [
    'living-dining-kitchen',
    'living-dining-wide',
    'living-lounge-mural',
    'living-retreat-group-sofa',
    'living-infinity-pool',
    'living-pool-pavilion',
    'living-infinity-pool-edge',
    'living-poolside-yoga',
  ]),
  cat('happy-snaps', 'Happy snaps', [
    'snaps-villa-render',
    'snaps-staircase-hall',
    'snaps-aerial-view',
    'snaps-carved-entry-door',
    'snaps-staff-jumping',
    'snaps-towel-art-bed',
    'snaps-entrance-courtyard',
    'snaps-towel-swans',
    'snaps-flower-mandala',
    'snaps-kitten-statue',
    'snaps-offerings-on-steps',
  ]),
];

export const galleryById = Object.fromEntries(galleryCategories.map((c) => [c.id, c]));
export const galleryCount = galleryCategories.reduce((n, c) => n + c.images.length, 0);
