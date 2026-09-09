// Physical coordinates in the SVG viewBox, independent of text direction.
// To add a service, use its content id, optional asset, and both layouts.
export const ecosystemServices = [
  { id: 'software', image: 'software', desktop: [235, 105], mobile: [150, 450],
    path: 'M360 325 L360 242 Q360 218 337 204 L235 145',
    mobilePath: 'M300 190 L300 322 Q300 342 280 352 L170 415 Q150 425 150 450',
    enter: [-20, -25], duration: 3.8 },
  { id: 'mobile', image: 'mobile', desktop: [570, 160], mobile: [450, 450],
    path: 'M360 325 L453 268 Q472 256 489 248 L570 200',
    mobilePath: 'M300 190 L300 322 Q300 342 320 352 L430 415 Q450 425 450 450',
    enter: [25, -20], duration: 4.4 },
  { id: 'web', image: null, desktop: [100, 320], mobile: [150, 770],
    path: 'M360 325 L255 373 Q235 381 215 374 L100 337',
    mobilePath: 'M300 190 L300 642 Q300 662 280 672 L170 735 Q150 745 150 770',
    enter: [-30, 0], duration: 5.1 },
  { id: 'iot', image: 'iot', desktop: [235, 535], mobile: [450, 770],
    path: 'M360 325 L360 405 Q360 425 342 437 L235 505',
    mobilePath: 'M300 190 L300 642 Q300 662 320 672 L430 735 Q450 745 450 770',
    enter: [-20, 25], duration: 4.1 },
  { id: 'seo', image: 'seo', desktop: [575, 505], mobile: [300, 1080],
    path: 'M360 325 L447 402 Q462 416 483 428 L575 475',
    mobilePath: 'M300 190 L300 1080',
    enter: [20, 25], duration: 5.5 },
] as const;
