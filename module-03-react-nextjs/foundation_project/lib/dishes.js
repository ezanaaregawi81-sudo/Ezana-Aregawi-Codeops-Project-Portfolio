import 'server-only';

// The dish data source. Every page reads dishes through the async functions at the
// bottom of this file, never through DISHES directly, so swapping this array for a
// database query later only changes this module.
//
// Data carried over from the original Addis Eats (Vite) app. Ids are URL slugs so a
// dish lives at /menu/kitfo rather than /menu/3.
const DISHES = [
  {
    id: 'doro-wat',
    name: 'Doro Wat',
    category: 'Main',
    price: 350,
    emoji: '🍗',
    color: '#c0392b',
    rating: 4.8,
    spicy: 3,
    prepTime: 35,
    tags: ['Gluten-Free'],
    special: true,
    description:
      "Slow-simmered chicken stew in a rich berbere sauce, served with a boiled egg and injera on the side. A festive classic and Ethiopia's national dish.",
  },
  {
    id: 'shiro-tegabino',
    name: 'Shiro Tegabino',
    category: 'Vegetarian',
    price: 180,
    emoji: '🥣',
    color: '#d4a017',
    rating: 4.6,
    spicy: 1,
    prepTime: 20,
    tags: ['Vegan', 'Gluten-Free'],
    special: true,
    description:
      'Smooth, spiced chickpea-flour stew simmered with garlic, onion and berbere. Comfort food served bubbling hot in a clay pot with injera.',
  },
  {
    id: 'kitfo',
    name: 'Special Kitfo',
    category: 'Main',
    price: 420,
    emoji: '🥩',
    color: '#8e2a2a',
    rating: 4.7,
    spicy: 2,
    prepTime: 15,
    tags: ['Gluten-Free'],
    special: true,
    description:
      'Finely minced raw beef seasoned with mitmita and niter kibbeh, served with ayib (cottage cheese) and gomen (collard greens).',
  },
  {
    id: 'beyaynetu',
    name: 'Beyaynetu',
    category: 'Vegetarian',
    price: 220,
    emoji: '🥗',
    color: '#2e8b57',
    rating: 4.5,
    spicy: 1,
    prepTime: 25,
    tags: ['Vegan'],
    special: false,
    description:
      'A colorful platter of lentils, split peas, cabbage, beets and greens arranged on injera — the ultimate fasting-day sampler.',
  },
  {
    id: 'beef-tibs',
    name: 'Beef Tibs',
    category: 'Main',
    price: 380,
    emoji: '🍖',
    color: '#a0522d',
    rating: 4.6,
    spicy: 2,
    prepTime: 20,
    tags: ['Gluten-Free'],
    special: false,
    description: 'Sauteed cubes of beef tossed with onions, rosemary, jalapeño and awaze sauce, sizzling hot off the pan.',
  },
  {
    id: 'chechebsa',
    name: 'Chechebsa',
    category: 'Breakfast',
    price: 160,
    emoji: '🥞',
    color: '#e8a33d',
    rating: 4.3,
    spicy: 0,
    prepTime: 15,
    tags: ['Vegetarian'],
    special: false,
    description: 'Shredded flatbread pan-fried with berbere-spiced butter, honey drizzle optional. A hearty highland breakfast.',
  },
  {
    id: 'tibs-firfir',
    name: 'Tibs Firfir',
    category: 'Breakfast',
    price: 200,
    emoji: '🌯',
    color: '#b5651d',
    rating: 4.4,
    spicy: 2,
    prepTime: 15,
    tags: [],
    special: false,
    description: 'Torn injera tossed through a spiced tomato and beef sauce, a favorite morning-after-a-feast dish.',
  },
  {
    id: 'vegetable-alicha',
    name: 'Vegetable Alicha',
    category: 'Vegetarian',
    price: 170,
    emoji: '🥕',
    color: '#6a9c3d',
    rating: 4.2,
    spicy: 0,
    prepTime: 20,
    tags: ['Vegan', 'Gluten-Free'],
    special: false,
    description: 'A mild turmeric-spiced stew of carrots, potatoes and cabbage — gentle on the palate and full of flavor.',
  },
  {
    id: 'gomen-besiga',
    name: 'Gomen Besiga',
    category: 'Main',
    price: 300,
    emoji: '🥬',
    color: '#3d6b35',
    rating: 4.4,
    spicy: 1,
    prepTime: 25,
    tags: ['Gluten-Free'],
    special: false,
    description: 'Collard greens sauteed with tender chunks of beef, garlic and ginger. Earthy, savory, and deeply satisfying.',
  },
  {
    id: 'fish-goulash',
    name: 'Fish Goulash',
    category: 'Main',
    price: 340,
    emoji: '🐟',
    color: '#3a6ea5',
    rating: 4.3,
    spicy: 2,
    prepTime: 30,
    tags: ['Gluten-Free'],
    special: false,
    description: 'Nile perch simmered in a berbere-tomato sauce with peppers and onions, a lakeside favorite from Bahir Dar.',
  },
  {
    id: 'ambasha-bread',
    name: 'Ambasha Bread',
    category: 'Sides',
    price: 90,
    emoji: '🍞',
    color: '#c98a3e',
    rating: 4.1,
    spicy: 0,
    prepTime: 10,
    tags: ['Vegetarian'],
    special: false,
    description: 'Slightly sweet, cardamom-scented flatbread, baked fresh and stamped with a decorative pattern.',
  },
  {
    id: 'sambusa',
    name: 'Sambusa (3 pcs)',
    category: 'Sides',
    price: 110,
    emoji: '🥟',
    color: '#d97b29',
    rating: 4.5,
    spicy: 1,
    prepTime: 15,
    tags: ['Vegetarian'],
    special: false,
    description: 'Crisp fried pastry triangles filled with spiced lentils or minced beef. The perfect starter or snack.',
  },
  {
    id: 'buna',
    name: 'Buna (Ethiopian Coffee)',
    category: 'Drinks',
    price: 60,
    emoji: '☕',
    color: '#4b2e2e',
    rating: 4.9,
    spicy: 0,
    prepTime: 10,
    tags: ['Vegan', 'Gluten-Free'],
    special: true,
    description: 'Freshly roasted and brewed in a traditional jebena, served in the birthplace of coffee itself.',
  },
  {
    id: 'tej',
    name: 'Tej (Honey Wine)',
    category: 'Drinks',
    price: 130,
    emoji: '🍯',
    color: '#c99a2e',
    rating: 4.4,
    spicy: 0,
    prepTime: 5,
    tags: ['Vegetarian'],
    special: false,
    description: 'Traditional fermented honey wine, sweet and lightly tangy, served chilled in a berele flask.',
  },
  {
    id: 'baklava',
    name: 'Baklava Ethio-Style',
    category: 'Dessert',
    price: 140,
    emoji: '🍮',
    color: '#a8763e',
    rating: 4.2,
    spicy: 0,
    prepTime: 10,
    tags: ['Vegetarian'],
    special: false,
    description: 'Layers of crisp filo, honey syrup and spiced nuts — a sweet finish with an Addis twist.',
  },
  {
    id: 'mango-avocado-juice',
    name: 'Mango Avocado Juice',
    category: 'Drinks',
    price: 100,
    emoji: '🥤',
    color: '#4f7d3c',
    rating: 4.6,
    spicy: 0,
    prepTime: 5,
    tags: ['Vegan', 'Gluten-Free'],
    special: false,
    description: 'Layered fresh-pressed mango and avocado juice — a colorful, creamy Addis Ababa street favorite.',
  },
];

export async function getDishes() {
  return DISHES;
}

export async function getDish(id) {
  return DISHES.find((dish) => dish.id === id) ?? null;
}

export async function getSpecials() {
  return DISHES.filter((dish) => dish.special);
}

// Categories in menu order, each with how many dishes it has.
export async function getCategories() {
  const counts = new Map();
  for (const dish of DISHES) counts.set(dish.category, (counts.get(dish.category) ?? 0) + 1);
  return [...counts].map(([name, count]) => ({ name, count }));
}

export async function getRelatedDishes(dish, limit = 3) {
  return DISHES.filter((other) => other.category === dish.category && other.id !== dish.id).slice(0, limit);
}

// Synchronous lookup for validation code that already has an id in hand.
export function findDish(id) {
  return DISHES.find((dish) => dish.id === id) ?? null;
}
