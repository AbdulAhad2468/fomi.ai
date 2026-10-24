export const assets = {
  ridge: '/assets/ridge.png',
  glass: '/assets/glass.png',
  house: '/assets/house.png',
  portraitA: '/assets/portrait-a.png',
  portraitB: '/assets/portrait-b.png'
};

export const starterWorks = [
  { id: 'work-1', image: assets.ridge, title: 'The long way home', prompt: 'A solitary traveler crossing a volcanic ridge at first light. A sense of scale, quiet, and possibility.', direction: 'Atmosphere', ratio: 'Landscape', date: 'Today, 10:42', type: 'image' },
  { id: 'work-2', image: assets.glass, title: 'Blue hour / object study', prompt: 'A translucent cobalt glass object on dark basalt. Sculptural light and restrained reflections.', direction: 'Product', ratio: 'Square', date: 'Today, 09:18', type: 'image' },
  { id: 'work-3', image: assets.house, title: 'An unhurried place', prompt: 'A modernist concrete home tucked into an olive grove at golden hour.', direction: 'Spaces', ratio: 'Landscape', date: 'Yesterday, 16:24', type: 'image' }
];

export const directions = [
  { id: 'Atmosphere', description: 'Mood, story, and place' },
  { id: 'Product', description: 'Materials, form, and light' },
  { id: 'Spaces', description: 'Architecture and interiors' }
];
