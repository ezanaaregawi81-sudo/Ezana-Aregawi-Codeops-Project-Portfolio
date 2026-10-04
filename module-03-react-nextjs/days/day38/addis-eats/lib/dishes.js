export const DISHES = [
  {
    id: 'doro-wat',
    name: 'Doro Wat (Traditional Chicken Stew)',
    amharicName: 'ዶሮ ወጥ',
    category: 'Signature',
    price: 450,
    priceFormatted: '450 ETB',
    spiceLevel: 'Spicy 🌶️🌶️🌶️',
    isFasting: false,
    rating: 4.9,
    prepTime: '25 min',
    description: 'The iconic Ethiopian national dish. Tender chicken leg slow-simmered in a rich, berbere-infused onion gravy, accompanied by hard-boiled eggs infused with spice.',
    ingredients: ['Free-range Chicken', 'Berbere Spice', 'Niter Kibbeh (Spiced Butter)', 'Hard-boiled Eggs', 'Red Onions', 'Garlic & Ginger', 'Injera'],
    image: '🍗',
    popular: true,
  },
  {
    id: 'kitfo',
    name: 'Special Kitfo',
    amharicName: 'ክትፎ',
    category: 'Signature',
    price: 480,
    priceFormatted: '480 ETB',
    spiceLevel: 'Medium-Spicy 🌶️🌶️',
    isFasting: false,
    rating: 4.95,
    prepTime: '15 min',
    description: 'Freshly minced prime lean beef warmed with infused niter kibbeh (clarified spiced butter) and authentic mitmita spice. Served with house-made ayib (cottage cheese) and gomen.',
    ingredients: ['Prime Lean Beef', 'Mitmita Spice', 'Niter Kibbeh', 'Ayib (Cheese)', 'Collard Greens', 'Kocho / Injera'],
    image: '🥩',
    popular: true,
  },
  {
    id: 'beyaynetu',
    name: 'Yetsom Beyaynetu (Veggie Combo)',
    amharicName: 'የጾም በያይነቱ',
    category: 'Fasting / Veggie',
    price: 320,
    priceFormatted: '320 ETB',
    spiceLevel: 'Mild to Medium 🌶️',
    isFasting: true,
    rating: 4.85,
    prepTime: '10 min',
    description: 'A vibrant, colorful feast of vegan dishes arranged on soft teff injera. Features Shiro, Misir Wat (red lentils), Kik Alicha (yellow split peas), Gomen, and Beet salad.',
    ingredients: ['Misir Wat (Spicy Lentils)', 'Kik Alicha (Yellow Peas)', 'Shiro', 'Gomen (Collards)', 'Key Sir (Beetroot)', 'Fasolia (Green Beans)', 'Teff Injera'],
    image: '🥗',
    popular: true,
  },
  {
    id: 'shiro',
    name: 'Shiro Tegabere',
    amharicName: 'ሽሮ ተጋቢኖ',
    category: 'Fasting / Veggie',
    price: 260,
    priceFormatted: '260 ETB',
    spiceLevel: 'Medium 🌶️🌶️',
    isFasting: true,
    rating: 4.75,
    prepTime: '15 min',
    description: 'Velvety, rich chickpea flour stew seasoned with berbere, garlic, and sacred spices, served bubbling hot in a clay vessel (ebet/denesh).',
    ingredients: ['Sun-dried Chickpea Flour', 'Berbere', 'Garlic & Shallots', 'Vegetable Oil', 'Fresh Jalapeño', 'Injera'],
    image: '🍲',
    popular: false,
  },
  {
    id: 'special-tibs',
    name: 'Special Beef Tibs',
    amharicName: 'ስፔሻል ጥብስ',
    category: 'Tibs',
    price: 420,
    priceFormatted: '420 ETB',
    spiceLevel: 'Medium 🌶️🌶️',
    isFasting: false,
    rating: 4.88,
    prepTime: '20 min',
    description: 'Tender tenderloin beef cubes flash-sautéed in a hot pan with sliced onions, fresh rosemary sprigs, green jalapeños, and aromatic kibbeh.',
    ingredients: ['Beef Tenderloin', 'Fresh Rosemary', 'Green Jalapeño', 'Onions', 'Niter Kibbeh', 'Garlic', 'Teff Injera'],
    image: '🥘',
    popular: true,
  },
  {
    id: 'gomen-besiga',
    name: 'Gomen Be Siga',
    amharicName: 'ጎመን በሥጋ',
    category: 'Signature',
    price: 380,
    priceFormatted: '380 ETB',
    spiceLevel: 'Mild 🌶️',
    isFasting: false,
    rating: 4.7,
    prepTime: '20 min',
    description: 'Finely chopped collard greens stewed with bone-in beef chunks, garlic, ginger, and spiced butter, creating a comforting savory dish.',
    ingredients: ['Fresh Collard Greens', 'Beef Chunks', 'Garlic & Ginger', 'Niter Kibbeh', 'Cardamom', 'Injera'],
    image: '🥬',
    popular: false,
  },
  {
    id: 'zilzil-tibs',
    name: 'Zilzil Tibs',
    amharicName: 'ዝልዝል ጥብስ',
    category: 'Tibs',
    price: 430,
    priceFormatted: '430 ETB',
    spiceLevel: 'Medium 🌶️🌶️',
    isFasting: false,
    rating: 4.8,
    prepTime: '18 min',
    description: 'Long strips of beef fried crisp at the edges, then tossed with awaze, onions and green chili and served sizzling.',
    ingredients: ['Beef Strips', 'Awaze', 'Onions', 'Green Chili', 'Niter Kibbeh', 'Injera'],
    image: '🍢',
    popular: false,
  },
  {
    id: 'atkilt-wat',
    name: 'Atkilt Wat',
    amharicName: 'አትክልት ወጥ',
    category: 'Fasting / Veggie',
    price: 230,
    priceFormatted: '230 ETB',
    spiceLevel: 'Mild 🌶️',
    isFasting: true,
    rating: 4.6,
    prepTime: '15 min',
    description: 'Cabbage, carrots and potatoes braised soft with turmeric, garlic and a little ginger. Gentle, golden and filling.',
    ingredients: ['Cabbage', 'Carrots', 'Potatoes', 'Turmeric', 'Garlic & Ginger', 'Injera'],
    image: '🥕',
    popular: false,
  },
  {
    id: 'chechebsa',
    name: 'Chechebsa',
    amharicName: 'ጨጨብሳ',
    category: 'Signature',
    price: 270,
    priceFormatted: '270 ETB',
    spiceLevel: 'Mild 🌶️',
    isFasting: false,
    rating: 4.7,
    prepTime: '12 min',
    description: 'Flaky flatbread torn into pieces and tossed with berbere and spiced butter, served with honey and yogurt for breakfast.',
    ingredients: ['Kita Flatbread', 'Berbere', 'Niter Kibbeh', 'Honey', 'Yogurt'],
    image: '🫓',
    popular: false,
  },
  {
    id: 'derek-tibs',
    name: 'Derek Tibs',
    amharicName: 'ደረቅ ጥብስ',
    category: 'Tibs',
    price: 410,
    priceFormatted: '410 ETB',
    spiceLevel: 'Mild to Medium 🌶️',
    isFasting: false,
    rating: 4.75,
    prepTime: '20 min',
    description: 'Dry-fried beef cubes cooked down until deeply browned, with rosemary, onion and a squeeze of fresh chili.',
    ingredients: ['Beef', 'Rosemary', 'Onions', 'Fresh Chili', 'Niter Kibbeh', 'Injera'],
    image: '🍽️',
    popular: false,
  }
];

export function getAllDishes() {
  return DISHES;
}

export function getDishById(id) {
  return DISHES.find((d) => d.id === id);
}

export function getCategories() {
  return ['All', 'Signature', 'Fasting / Veggie', 'Tibs'];
}

export const SEARCH_PAGE_SIZE = 3;

// Search by English name, Amharic name or category, returning one page of matches.
// The term is echoed back so the UI can label results with the query that produced them.
export function searchDishes(term, page = 1) {
  const query = term.trim();
  const needle = query.toLowerCase();
  const matches = DISHES.filter((dish) =>
    [dish.name, dish.amharicName, dish.category].some((field) => field.toLowerCase().includes(needle)),
  );

  const pageCount = Math.max(1, Math.ceil(matches.length / SEARCH_PAGE_SIZE));
  const current = Math.min(Math.max(1, page), pageCount);

  return {
    query,
    dishes: matches.slice((current - 1) * SEARCH_PAGE_SIZE, current * SEARCH_PAGE_SIZE),
    page: current,
    pageCount,
    matchCount: matches.length,
  };
}
