const SUPPLY_DATABASE = {
  schultz: {
    name:"Schultz 10-15-10 Liquid Plant Food",
    short:"Schultz 10-15-10",
    npk:[10,15,10],
    form:"liquid",
    tags:["balanced","bloom","fruiting","container","quick-feed"],
    bestFor:["Tomatoes", "Peppers", "Cucumbers", "flowering containers", "fruiting vegetables"],
    avoidFor:["Seedlings", "dry soil"],
    ownedDefault:true,
    role:"Fast liquid feed for tomatoes, peppers, cucumbers, herbs, and other heavy feeders."
  },
  miracle_gro_24_8_16: {
    name:"Miracle-Gro Water Soluble All Purpose Plant Food 24-8-16",
    short:"Miracle-Gro 24-8-16",
    npk:[24,8,16],
    form:"water soluble",
    tags:["high-nitrogen","balanced","leafy","general","container","quick-feed"],
    bestFor:["Herbs", "leafy growth", "early tomatoes/peppers", "general container plants"],
    avoidFor:["Root crops after roots start forming", "overfed fruiting crops", "dry soil"],
    ownedDefault:true,
    role:"Strong general-purpose water-soluble feed. Great for leafy growth and early plant push; use carefully on beets/root crops."
  },
  shakefeed: {
    name:"Miracle-Gro Shake 'n Feed Ultra Bloom 10-18-9",
    short:"Shake n Feed Ultra Bloom",
    npk:[10,18,9],
    form:"slow release",
    tags:["bloom","fruiting","slow-release","container"],
    bestFor:["Tomatoes", "peppers", "cucumbers", "flowering containers"],
    avoidFor:["Seedlings", "plants already heavily fertilized"],
    ownedDefault:true,
    role:"Optional slow-release bloom support at planting for fruiting crops."
  },
  gaia: {
    name:"Gaia Green Power Bloom 2-8-4",
    short:"Gaia Green 2-8-4",
    npk:[2,8,4],
    form:"granular organic",
    tags:["low-nitrogen","bloom","root","organic","slow-release"],
    bestFor:["Beets", "root crops", "bulbs", "flowering support"],
    avoidFor:["Plants needing a fast nitrogen rescue"],
    ownedDefault:true,
    role:"Organic bloom/root support for beets and root crops after thinning."
  },
  compost: {
    name:"Compost / Finished Organic Matter",
    short:"Compost",
    npk:null,
    form:"soil amendment",
    tags:["soil","organic","gentle","general","legume"],
    bestFor:["Peas", "beans", "garlic", "perennials", "garden beds"],
    avoidFor:["None, unless unfinished/hot compost"],
    ownedDefault:true,
    role:"General soil booster, especially for peas, beans, garlic, perennials, and beds."
  },
  houseplant: {
    name:"On My Garden Organic Houseplant Food 0-0-2",
    short:"Houseplant 0-0-2",
    npk:[0,0,2],
    form:"liquid",
    tags:["potassium","gentle","houseplant"],
    bestFor:["Indoor plants", "light potassium support"],
    avoidFor:["Primary vegetable feeding"],
    ownedDefault:true,
    role:"Keep mainly for indoor plants. Not a primary vegetable-garden fertilizer."
  },

  tomato_veg_4_6_8: {
    name:"Tomato & Vegetable Fertilizer around 4-6-8",
    short:"Tomato/Veg 4-6-8",
    npk:[4,6,8],
    form:"granular or liquid",
    tags:["tomato","fruiting","low-nitrogen","balanced","container"],
    bestFor:["Tomatoes", "peppers", "cucumbers", "fruiting vegetables"],
    avoidFor:["Seedlings unless diluted"],
    ownedDefault:false,
    role:"Ideal missing-match style fertilizer for fruiting crops once flowers/fruit show."
  },
  root_veg_5_10_10: {
    name:"Vegetable / Root Crop Fertilizer 5-10-10",
    short:"Root/Veg 5-10-10",
    npk:[5,10,10],
    form:"granular",
    tags:["root","low-nitrogen","bloom","bulb","tuber"],
    bestFor:["Beets", "carrots", "onions", "garlic", "potatoes"],
    avoidFor:["Leafy crops needing nitrogen"],
    ownedDefault:false,
    role:"Best missing-match style fertilizer for root crops and bulbs."
  },
  fish_emulsion_5_1_1: {
    name:"Fish Emulsion 5-1-1",
    short:"Fish Emulsion 5-1-1",
    npk:[5,1,1],
    form:"liquid organic",
    tags:["nitrogen","leafy","organic","quick-feed"],
    bestFor:["Leafy greens", "herbs", "early vegetative growth"],
    avoidFor:["Root crops after roots form", "overly lush tomatoes"],
    ownedDefault:false,
    role:"Good missing-match nitrogen boost for leafy greens and herbs."
  },
  kelp_0_0_1: {
    name:"Liquid Kelp / Seaweed 0-0-1",
    short:"Kelp 0-0-1",
    npk:[0,0,1],
    form:"liquid",
    tags:["kelp","gentle","stress","transplant","potassium"],
    bestFor:["Transplants", "heat-stressed crops", "general gentle support"],
    avoidFor:["Replacing a real fertilizer for heavy feeders"],
    ownedDefault:false,
    role:"Gentle support product for transplant or weather stress."
  },
  bone_meal_4_10_0: {
    name:"Bone Meal around 4-10-0",
    short:"Bone Meal 4-10-0",
    npk:[4,10,0],
    form:"granular organic",
    tags:["phosphorus","root","bulb","slow-release"],
    bestFor:["Bulbs", "root establishment", "perennials"],
    avoidFor:["Containers where soil phosphorus is already high"],
    ownedDefault:false,
    role:"Slow phosphorus support for roots, bulbs, and perennials."
  },
  blood_meal_12_0_0: {
    name:"Blood Meal around 12-0-0",
    short:"Blood Meal 12-0-0",
    npk:[12,0,0],
    form:"granular organic",
    tags:["high-nitrogen","leafy","organic"],
    bestFor:["Leafy greens", "nitrogen-hungry brassicas"],
    avoidFor:["Beets", "carrots", "overfed fruiting crops"],
    ownedDefault:false,
    role:"Strong nitrogen product. Useful, but easy to overdo."
  },
  acid_loving_30_10_10: {
    name:"Acid-Loving Plant Food around 30-10-10",
    short:"Acid-Loving 30-10-10",
    npk:[30,10,10],
    form:"water soluble",
    tags:["acid-loving","high-nitrogen","berry"],
    bestFor:["Blueberries", "acid-loving shrubs"],
    avoidFor:["Most vegetable crops"],
    ownedDefault:false,
    role:"Specialty missing-match product for blueberries and acid-loving plants."
  },
  berry_4_3_4: {
    name:"Berry Fertilizer around 4-3-4",
    short:"Berry 4-3-4",
    npk:[4,3,4],
    form:"granular organic",
    tags:["berry","organic","slow-release","balanced"],
    bestFor:["Strawberries", "raspberries", "currants", "gooseberries"],
    avoidFor:["Heavy vegetable feeding"],
    ownedDefault:false,
    role:"Good missing-match style fertilizer for berries and small fruit."
  }
};
