const SUPPLY_DATABASE = {
  compost: {
    brand:"Garden Basics",
    name:"Compost / Finished Organic Matter",
    short:"Compost",
    npk:null,
    form:"soil amendment",
    tags:["soil","organic","gentle","general","legume","compost"],
    bestFor:["Peas", "beans", "garlic", "perennials", "garden beds"],
    avoidFor:["None, unless unfinished/hot compost"],
    ownedDefault:true,
    role:"General soil booster, especially for peas, beans, garlic, perennials, and beds."
  },

  // kWen owned / likely owned products
  miracle_gro_24_8_16: {
    brand:"Miracle-Gro",
    name:"Miracle-Gro Water Soluble All Purpose Plant Food 24-8-16",
    short:"Miracle-Gro 24-8-16",
    npk:[24,8,16],
    form:"water soluble",
    tags:["high-nitrogen","balanced","leafy","general","container","quick-feed","vegetable"],
    bestFor:["Herbs", "leafy growth", "early tomatoes/peppers", "general container plants"],
    avoidFor:["Root crops after roots start forming", "overfed fruiting crops", "dry soil"],
    ownedDefault:true,
    role:"Strong general-purpose water-soluble feed. Best for leafy growth and early plant push; use carefully on beets/root crops."
  },
  gaia_power_bloom_2_8_4: {
    brand:"Gaia Green",
    name:"Gaia Green Power Bloom 2-8-4",
    short:"Gaia Power Bloom 2-8-4",
    npk:[2,8,4],
    form:"granular organic",
    tags:["low-nitrogen","bloom","fruiting","root","organic","slow-release","tomato","container"],
    bestFor:["Peppers in flower/fruit", "tomatoes in flower/fruit", "beets", "root crops", "flowering support"],
    avoidFor:["Plants needing a fast nitrogen rescue"],
    ownedDefault:true,
    role:"Organic bloom/root support. Best once peppers/tomatoes are flowering or fruiting, and useful for root crops."
  },


  // Schultz liquid feeds
  schultz_all_purpose_liquid_10_15_10: {
    brand:"Schultz",
    name:"Schultz All Purpose Liquid Plant Food 10-15-10",
    short:"Schultz Liquid 10-15-10",
    npk:[10,15,10],
    form:"concentrated liquid",
    frequencyDays:7,
    frequencyNote:"Default calendar reminder is weekly. The Canadian label also permits 7 drops per litre with each watering, according to the plant's needs.",
    tags:["balanced","liquid","quick-feed","container","vegetable","flowering","general"],
    bestFor:["Tomatoes", "Peppers", "Cucumbers", "herbs", "container vegetables", "general garden plants"],
    avoidFor:["Dry soil", "overfed plants", "combining at full strength with another fertilizer"],
    ownedDefault:false,
    role:"Fast liquid feed for indoor or outdoor plants. The app uses a conservative weekly reminder; always follow the bottle rate."
  },
  liquid_tomato_vegetable_feed: {
    brand:"Generic / Other",
    name:"Liquid Tomato & Vegetable Fertilizer",
    short:"Liquid Tomato & Veg Feed",
    npk:null,
    form:"liquid",
    frequencyDays:14,
    tags:["tomato","fruiting","vegetable","liquid","quick-feed","container"],
    bestFor:["Tomatoes", "Peppers", "Cucumbers", "fruiting container vegetables"],
    avoidFor:["Dry soil", "using together with another full-strength fertilizer"],
    ownedDefault:false,
    role:"Catch-all option when your exact liquid tomato/vegetable product is not listed. Default reminder: every 14 days."
  },
  liquid_all_purpose_feed: {
    brand:"Generic / Other",
    name:"Liquid All-Purpose Fertilizer",
    short:"Liquid All-Purpose Feed",
    npk:null,
    form:"liquid",
    frequencyDays:14,
    tags:["balanced","liquid","general","quick-feed","container"],
    bestFor:["General vegetables", "herbs", "containers"],
    avoidFor:["Dry soil", "unknown-strength concentrates without checking the label"],
    ownedDefault:false,
    role:"Catch-all liquid fertilizer option. Default reminder: every 14 days; the product label takes priority."
  },
  liquid_fish_emulsion: {
    brand:"Generic / Other",
    name:"Liquid Fish Emulsion",
    short:"Liquid Fish Emulsion",
    npk:null,
    form:"liquid organic",
    frequencyDays:14,
    tags:["nitrogen","leafy","organic","liquid","quick-feed","gentle"],
    bestFor:["Leafy greens", "herbs", "young vegetative plants"],
    avoidFor:["Root crops after roots form", "already lush tomatoes and peppers"],
    ownedDefault:false,
    role:"Organic liquid nitrogen support. Default reminder: every 14 days."
  },
  liquid_seaweed_kelp: {
    brand:"Generic / Other",
    name:"Liquid Seaweed / Kelp Fertilizer",
    short:"Liquid Seaweed / Kelp",
    npk:null,
    form:"liquid organic",
    frequencyDays:14,
    tags:["kelp","stress","transplant","fruiting","gentle","liquid"],
    bestFor:["Transplants", "heat stress", "fruiting crops", "containers"],
    avoidFor:["Using as the only complete fertilizer when plants need nitrogen or phosphorus"],
    ownedDefault:false,
    role:"Gentle seaweed/kelp support. Default reminder: every 14 days."
  },
  compost_tea: {
    brand:"Generic / Other",
    name:"Compost Tea",
    short:"Compost Tea",
    npk:null,
    form:"liquid organic",
    frequencyDays:14,
    tags:["compost","soil","organic","gentle","liquid"],
    bestFor:["Garden beds", "containers", "general soil support"],
    avoidFor:["Treating it as a guaranteed complete fertilizer"],
    ownedDefault:false,
    role:"Gentle soil-support option. Default reminder: every 14 days."
  },

  // Gaia Green core line
  gaia_all_purpose_4_4_4: {
    brand:"Gaia Green",
    name:"Gaia Green All Purpose 4-4-4",
    short:"Gaia All Purpose 4-4-4",
    npk:[4,4,4],
    form:"granular organic",
    tags:["balanced","general","organic","slow-release","vegetable","container","gentle"],
    bestFor:["Vegetables", "herbs", "early fruiting crops", "container soil"],
    avoidFor:["Fast deficiency correction"],
    ownedDefault:false,
    role:"Excellent balanced organic base feed for most garden crops before flowering/fruiting needs get specific."
  },
  gaia_worm_castings: {
    brand:"Gaia Green",
    name:"Gaia Green Worm Castings",
    short:"Gaia Worm Castings",
    npk:null,
    form:"soil amendment",
    tags:["soil","organic","gentle","compost","microbial","seedling","transplant"],
    bestFor:["Seedlings", "transplants", "containers", "soil refresh"],
    avoidFor:["Replacing complete fertilizer for heavy feeders"],
    ownedDefault:false,
    role:"Gentle soil builder and transplant support. Great add-on, not a complete heavy-feeder fertilizer by itself."
  },
  gaia_soluble_seaweed: {
    brand:"Gaia Green",
    name:"Gaia Green Soluble Seaweed Extract 0-0-17",
    short:"Gaia Seaweed 0-0-17",
    npk:[0,0,17],
    form:"water soluble organic",
    tags:["kelp","potassium","stress","transplant","fruiting","gentle"],
    bestFor:["Transplant stress", "heat stress", "fruiting support"],
    avoidFor:["Replacing nitrogen/phosphorus feeding"],
    ownedDefault:false,
    role:"Potassium/kelp stress support. Nice companion product for containers during heat or fruiting."
  },
  gaia_glacial_rock_dust: {
    brand:"Gaia Green",
    name:"Gaia Green Glacial Rock Dust",
    short:"Gaia Glacial Rock Dust",
    npk:null,
    form:"mineral amendment",
    tags:["mineral","soil","trace-minerals","organic","slow-release"],
    bestFor:["Soil mineral refresh", "raised beds", "containers between seasons"],
    avoidFor:["Immediate feeding needs"],
    ownedDefault:false,
    role:"Trace mineral amendment. Useful for soil building, not a direct fertilizer recommendation for weekly feeding."
  },
  gaia_mineralized_phosphate: {
    brand:"Gaia Green",
    name:"Gaia Green Mineralized Phosphate",
    short:"Gaia Mineralized Phosphate",
    npk:null,
    form:"mineral amendment",
    tags:["phosphorus","root","bloom","slow-release","organic","mineral"],
    bestFor:["Root crops", "bulbs", "flowering support", "soil building"],
    avoidFor:["Soils already high in phosphorus"],
    ownedDefault:false,
    role:"Slow phosphorus/mineral support for roots and flowers. More amendment than quick feed."
  },
  gaia_basalt_rock_dust: {
    brand:"Gaia Green",
    name:"Gaia Green Basalt Rock Dust",
    short:"Gaia Basalt Rock Dust",
    npk:null,
    form:"mineral amendment",
    tags:["mineral","soil","trace-minerals","organic","slow-release"],
    bestFor:["Soil mineral refresh", "raised beds", "long-term soil health"],
    avoidFor:["Immediate feeding needs"],
    ownedDefault:false,
    role:"Long-term mineral amendment. Helps the soil, but should not be picked as a main fertilizer."
  },
  gaia_greensand: {
    brand:"Gaia Green",
    name:"Gaia Green Greensand",
    short:"Gaia Greensand",
    npk:null,
    form:"mineral amendment",
    tags:["potassium","mineral","soil","slow-release","organic"],
    bestFor:["Long-term potassium support", "soil building"],
    avoidFor:["Immediate potassium deficiency correction"],
    ownedDefault:false,
    role:"Slow mineral potassium support. Better for soil building than fast container feeding."
  },
  gaia_gypsum: {
    brand:"Gaia Green",
    name:"Gaia Green Gypsum",
    short:"Gaia Gypsum",
    npk:null,
    form:"mineral amendment",
    tags:["calcium","sulfur","soil","mineral"],
    bestFor:["Calcium support", "soil structure", "tomatoes/peppers as add-on"],
    avoidFor:["Using as main fertilizer"],
    ownedDefault:false,
    role:"Calcium/sulfur amendment. Useful add-on, not a main NPK fertilizer."
  },
  gaia_bone_meal_2_16_0: {
    brand:"Gaia Green",
    name:"Gaia Green Bone Meal 2-16-0",
    short:"Gaia Bone Meal 2-16-0",
    npk:[2,16,0],
    form:"granular organic",
    tags:["phosphorus","root","bulb","bloom","slow-release","organic"],
    bestFor:["Bulbs", "root establishment", "root crops", "perennials"],
    avoidFor:["Soils already high in phosphorus"],
    ownedDefault:false,
    role:"Slow phosphorus support for roots, bulbs, and perennials."
  },
  gaia_blood_meal_13_0_0: {
    brand:"Gaia Green",
    name:"Gaia Green Blood Meal 13-0-0",
    short:"Gaia Blood Meal 13-0-0",
    npk:[13,0,0],
    form:"granular organic",
    tags:["high-nitrogen","leafy","organic","quick-feed"],
    bestFor:["Leafy greens", "nitrogen-hungry crops"],
    avoidFor:["Beets", "carrots", "overfed tomatoes/peppers"],
    ownedDefault:false,
    role:"Strong nitrogen product. Useful, but easy to overdo in containers."
  },
  gaia_fishbone_meal_4_20_0: {
    brand:"Gaia Green",
    name:"Gaia Green Fishbone Meal 4-20-0",
    short:"Gaia Fishbone Meal 4-20-0",
    npk:[4,20,0],
    form:"granular organic",
    tags:["phosphorus","root","bloom","organic","slow-release"],
    bestFor:["Flowering support", "root crops", "bulbs"],
    avoidFor:["Soils already high in phosphorus"],
    ownedDefault:false,
    role:"High phosphorus organic amendment for roots and blooms."
  },
  gaia_alfalfa_meal_3_0_3: {
    brand:"Gaia Green",
    name:"Gaia Green Alfalfa Meal 3-0-3",
    short:"Gaia Alfalfa Meal 3-0-3",
    npk:[3,0,3],
    form:"granular organic",
    tags:["balanced","organic","soil","gentle","vegetative"],
    bestFor:["Soil building", "gentle vegetative support"],
    avoidFor:["Primary bloom feeding"],
    ownedDefault:false,
    role:"Gentle organic amendment for soil life and light growth support."
  },
  gaia_oyster_shell_flour: {
    brand:"Gaia Green",
    name:"Gaia Green Oyster Shell Flour",
    short:"Gaia Oyster Shell Flour",
    npk:null,
    form:"calcium amendment",
    tags:["calcium","soil","mineral","slow-release"],
    bestFor:["Calcium support", "soil pH buffering", "tomatoes/peppers as add-on"],
    avoidFor:["Acid-loving plants", "using as main fertilizer"],
    ownedDefault:false,
    role:"Calcium amendment. Helpful add-on if calcium/pH support is needed."
  },

  // Miracle-Gro Canada / commonly available garden line
  miracle_gro_tomato_fruit_veg_18_18_21: {
    brand:"Miracle-Gro",
    name:"Miracle-Gro Water Soluble Tomato, Fruit & Vegetable Plant Food 18-18-21",
    short:"MG Tomato/Fruit/Veg 18-18-21",
    npk:[18,18,21],
    form:"water soluble",
    tags:["tomato","fruiting","vegetable","quick-feed","container","balanced"],
    bestFor:["Tomatoes", "peppers", "cucumbers", "strawberries", "container vegetables"],
    avoidFor:["Dry soil", "very young seedlings unless diluted"],
    ownedDefault:false,
    role:"Fast fruit/vegetable feed for tomatoes, peppers, cucumbers, and container crops."
  },
  miracle_gro_shake_feed_tomato_10_5_15: {
    brand:"Miracle-Gro",
    name:"Miracle-Gro Shake 'n Feed Tomato, Fruit & Vegetable Plant Food 10-5-15",
    short:"MG Shake n Feed 10-5-15",
    npk:[10,5,15],
    form:"slow release",
    tags:["tomato","fruiting","vegetable","slow-release","container","calcium"],
    bestFor:["Tomatoes", "peppers", "cucumbers", "container vegetables"],
    avoidFor:["Seedlings", "plants already heavily fertilized"],
    ownedDefault:false,
    role:"Slow-release tomato/veg feed with calcium; useful in containers and beds for long season feeding."
  },
  miracle_gro_rose_18_24_16: {
    brand:"Miracle-Gro",
    name:"Miracle-Gro Water Soluble Rose Plant Food 18-24-16",
    short:"MG Rose 18-24-16",
    npk:[18,24,16],
    form:"water soluble",
    tags:["bloom","quick-feed","flower","balanced"],
    bestFor:["Roses", "flowering ornamentals"],
    avoidFor:["Root crops", "routine vegetable feeding"],
    ownedDefault:false,
    role:"Flowering ornamental feed. Not the first pick for vegetables, but has bloom support."
  },
  miracle_gro_bloom_booster_15_30_15: {
    brand:"Miracle-Gro",
    name:"Miracle-Gro Water Soluble Bloom Booster Flower Food 15-30-15",
    short:"MG Bloom Booster 15-30-15",
    npk:[15,30,15],
    form:"water soluble",
    tags:["bloom","flower","quick-feed","phosphorus"],
    bestFor:["Flowering annuals", "ornamental containers"],
    avoidFor:["Root crops", "overfed vegetables"],
    ownedDefault:false,
    role:"Strong bloom feed for flowers. Use cautiously around vegetables because nitrogen is still fairly high."
  },
  miracle_gro_azalea_30_10_10: {
    brand:"Miracle-Gro",
    name:"Miracle-Gro Water Soluble Azalea, Camellia, Rhododendron Plant Food 30-10-10",
    short:"MG Acid-Loving 30-10-10",
    npk:[30,10,10],
    form:"water soluble",
    tags:["acid-loving","high-nitrogen","berry","quick-feed"],
    bestFor:["Blueberries", "azaleas", "rhododendrons", "acid-loving shrubs"],
    avoidFor:["Most vegetable crops"],
    ownedDefault:false,
    role:"Specialty high-nitrogen acid-loving feed. Keep away from most veggie recommendations."
  },
  miracle_gro_orchid_30_10_10: {
    brand:"Miracle-Gro",
    name:"Miracle-Gro Water Soluble Orchid Food 30-10-10",
    short:"MG Orchid 30-10-10",
    npk:[30,10,10],
    form:"water soluble",
    tags:["houseplant","orchid","high-nitrogen","quick-feed"],
    bestFor:["Orchids", "houseplants as directed"],
    avoidFor:["Vegetable garden feeding"],
    ownedDefault:false,
    role:"Specialty orchid/houseplant feed. Not a garden vegetable recommendation."
  },

  // Other Canadian companies to include in dropdown/database
  rubicon_tomato_veg_organic: {
    brand:"Rubicon Organic",
    name:"Rubicon Organic Tomato & Vegetable Fertilizer",
    short:"Rubicon Tomato/Veg Organic",
    npk:null,
    form:"organic granular",
    tags:["tomato","fruiting","vegetable","organic","slow-release","container"],
    bestFor:["Tomatoes", "peppers", "cucumbers", "vegetable beds"],
    avoidFor:["Fast deficiency correction"],
    ownedDefault:false,
    role:"Canadian organic tomato/vegetable style fertilizer. Good database option for fruiting crops."
  },
  rubicon_bone_meal: {
    brand:"Rubicon Organic",
    name:"Rubicon Organic Bone Meal",
    short:"Rubicon Bone Meal",
    npk:null,
    form:"organic granular",
    tags:["phosphorus","root","bulb","bloom","organic","slow-release"],
    bestFor:["Root crops", "bulbs", "flowering support"],
    avoidFor:["Soils already high in phosphorus"],
    ownedDefault:false,
    role:"Canadian organic bone meal option for root/bloom support."
  },
  rubicon_blood_meal: {
    brand:"Rubicon Organic",
    name:"Rubicon Organic Blood Meal",
    short:"Rubicon Blood Meal",
    npk:null,
    form:"organic granular",
    tags:["high-nitrogen","leafy","organic"],
    bestFor:["Leafy greens", "nitrogen-hungry crops"],
    avoidFor:["Root crops", "late fruiting peppers/tomatoes"],
    ownedDefault:false,
    role:"Canadian organic nitrogen option. Useful but should not dominate fruiting/root crop recommendations."
  },
  nurture_growth_bio_fertilizer: {
    brand:"Nurture Growth Bio Fertilizer",
    name:"Nurture Growth Bio Fertilizer",
    short:"Nurture Growth Bio",
    npk:null,
    form:"liquid/concentrate organic",
    tags:["organic","liquid","general","vegetable","fruiting","herb","gentle"],
    bestFor:["Vegetables", "fruits", "herbs", "general garden feeding"],
    avoidFor:["Crop-specific high precision feeding if NPK is needed"],
    ownedDefault:false,
    role:"Canadian bio-fertilizer option for general vegetables, herbs, and fruits. Good broad organic dropdown choice."
  },

  // Generic fallback products for matching when exact product is not in inventory
  tomato_veg_4_6_8: {
    brand:"Generic Match",
    name:"Tomato & Vegetable Fertilizer around 4-6-8",
    short:"Tomato/Veg 4-6-8",
    npk:[4,6,8],
    form:"granular or liquid",
    tags:["tomato","fruiting","low-nitrogen","balanced","container","vegetable"],
    bestFor:["Tomatoes", "peppers", "cucumbers", "fruiting vegetables"],
    avoidFor:["Seedlings unless diluted"],
    ownedDefault:false,
    role:"Ideal missing-match style fertilizer for fruiting crops once flowers/fruit show."
  },
  root_veg_5_10_10: {
    brand:"Generic Match",
    name:"Vegetable / Root Crop Fertilizer 5-10-10",
    short:"Root/Veg 5-10-10",
    npk:[5,10,10],
    form:"granular",
    tags:["root","low-nitrogen","bloom","bulb","tuber","vegetable"],
    bestFor:["Beets", "carrots", "onions", "garlic", "potatoes"],
    avoidFor:["Leafy crops needing nitrogen"],
    ownedDefault:false,
    role:"Best missing-match style fertilizer for root crops and bulbs."
  },
  fish_emulsion_5_1_1: {
    brand:"Generic Match",
    name:"Fish Emulsion 5-1-1",
    short:"Fish Emulsion 5-1-1",
    npk:[5,1,1],
    form:"liquid organic",
    tags:["nitrogen","leafy","organic","quick-feed","gentle"],
    bestFor:["Leafy greens", "herbs", "early vegetative growth"],
    avoidFor:["Root crops after roots form", "overly lush tomatoes"],
    ownedDefault:false,
    role:"Good missing-match nitrogen boost for leafy greens and herbs."
  }
};

// Backward-compatible aliases for older crop data / saved inventories.
SUPPLY_DATABASE.schultz = {
  aliasOf:"schultz_all_purpose_liquid_10_15_10",
  brand:"Schultz",
  name:"Schultz 10-15-10 Liquid Plant Food",
  short:"Schultz 10-15-10",
  npk:[10,15,10],
  form:"liquid",
  tags:["balanced","bloom","fruiting","container","quick-feed","vegetable"],
  bestFor:["Tomatoes", "Peppers", "Cucumbers", "flowering containers", "fruiting vegetables"],
  avoidFor:["Seedlings", "dry soil"],
  ownedDefault:false,
  role:"Legacy inventory item from earlier versions. Balanced liquid feed for fruiting crops."
};
SUPPLY_DATABASE.shakefeed = {
  ...SUPPLY_DATABASE.miracle_gro_shake_feed_tomato_10_5_15,
  aliasOf:"miracle_gro_shake_feed_tomato_10_5_15"
};
SUPPLY_DATABASE.gaia = {
  ...SUPPLY_DATABASE.gaia_power_bloom_2_8_4,
  aliasOf:"gaia_power_bloom_2_8_4"
};
SUPPLY_DATABASE.houseplant = {
  aliasOf:"houseplant_0_0_2",
  brand:"On My Garden",
  name:"On My Garden Organic Houseplant Food 0-0-2",
  short:"Houseplant 0-0-2",
  npk:[0,0,2],
  form:"liquid",
  tags:["potassium","gentle","houseplant"],
  bestFor:["Indoor plants", "light potassium support"],
  avoidFor:["Primary vegetable feeding"],
  ownedDefault:false,
  role:"Legacy houseplant item. Keep mainly for indoor plants, not primary vegetable feeding."
};
