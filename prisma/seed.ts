import { PrismaClient } from "../generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";
import { toJsonList } from "../lib/serialize";
import { placeholderImageUrl } from "../lib/placeholder";
import { regionName, districtName } from "../lib/regions";
import { SERVICES, CATEGORIES } from "./reference-data";

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL ?? "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[''']/g, "")
    .replace(/[^a-z0-9Ѐ-ӿ]+/gi, "-")
    .replace(/(^-|-$)/g, "");
}

async function hash(pw: string) {
  return bcrypt.hash(pw, 10);
}

type Tier = "luxury" | "vip" | "garden" | "budget" | "restaurant";

const DESC: Record<Tier, { uz: string[]; ru: string[]; en: string[] }> = {
  luxury: {
    uz: [
      "hashamatli interyeri, baland shift va kristall qandillari bilan mehmonlarni hayratda qoldiradi",
      "premium darajadagi xizmat va nafis dizayn bilan eng talabchan mijozlar uchun mo'ljallangan",
    ],
    ru: [
      "поражает роскошным интерьером, высокими потолками и хрустальными люстрами",
      "создан для самых взыскательных гостей — премиальный сервис и изысканный дизайн",
    ],
    en: [
      "dazzles guests with a lavish interior, soaring ceilings and crystal chandeliers",
      "is built for the most discerning guests, pairing premium service with refined design",
    ],
  },
  vip: {
    uz: [
      "alohida VIP zali va shaxsiy xizmat ko'rsatish bilan yuqori darajadagi tadbirlar uchun qulay",
      "zamonaviy uslubda jihozlangan bo'lib, VIP mehmonlar uchun alohida xona taklif etadi",
    ],
    ru: [
      "предлагает отдельный VIP-зал и персональное обслуживание для мероприятий высокого уровня",
      "оформлен в современном стиле и располагает отдельной комнатой для VIP-гостей",
    ],
    en: [
      "offers a dedicated VIP hall and personal service for high-profile celebrations",
      "is fitted out in a contemporary style with a separate room for VIP guests",
    ],
  },
  garden: {
    uz: [
      "ochiq havodagi yashil bog'i va tabiiy manzarasi bilan romantik marosimlar uchun ideal",
      "keng hovlisi va gulzorlari bilan tashqi to'y marosimlari uchun mos tushadi",
    ],
    ru: [
      "с зелёным садом на открытом воздухе — идеальное место для романтичной церемонии",
      "с просторным двором и цветниками отлично подходит для выездной церемонии",
    ],
    en: [
      "features a lush open-air garden and natural scenery, perfect for a romantic ceremony",
      "has a spacious courtyard and flower beds, ideal for an outdoor celebration",
    ],
  },
  budget: {
    uz: [
      "arzon narxlarda sifatli xizmat ko'rsatib, oilaviy byudjetga mos keladi",
      "narx va sifat muvozanatini saqlagan holda qulay to'y tashkil etish imkonini beradi",
    ],
    ru: [
      "предлагает качественный сервис по доступной цене — отлично впишется в семейный бюджет",
      "позволяет организовать свадьбу без лишних затрат, сохраняя баланс цены и качества",
    ],
    en: [
      "delivers solid service at an affordable price, easy on the family budget",
      "keeps the price-to-quality ratio friendly for a well-organized, budget-conscious wedding",
    ],
  },
  restaurant: {
    uz: [
      "restoran uslubidagi ichki tarhi va milliy taomlar menyusi bilan mehmonlarni kutib oladi",
      "qulay stol joylashuvi va professional oshxona jamoasi bilan ajralib turadi",
    ],
    ru: [
      "встречает гостей интерьером в ресторанном стиле и меню национальной кухни",
      "выделяется удобной рассадкой столов и профессиональной командой кухни",
    ],
    en: [
      "welcomes guests with a restaurant-style layout and a menu of national dishes",
      "stands out for its comfortable table layout and professional kitchen team",
    ],
  },
};

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length];
}

function buildDescriptions(
  hallName: string,
  districtSlug: string,
  regionSlug: string,
  capacityMax: number,
  tier: Tier,
  seedIdx: number,
) {
  const uzBody = pick(DESC[tier].uz, seedIdx);
  const ruBody = pick(DESC[tier].ru, seedIdx);
  const enBody = pick(DESC[tier].en, seedIdx);

  const districtUz = districtName(regionSlug, districtSlug, "uz");
  const districtRu = districtName(regionSlug, districtSlug, "ru");
  const districtEn = districtName(regionSlug, districtSlug, "en");
  const regionEn = regionName(regionSlug, "en");

  return {
    descriptionUz: `${hallName} — ${districtUz} tumanida joylashgan bo'lib, ${uzBody}. To'yxona bir vaqtning o'zida ${capacityMax} nafargacha mehmonni qabul qila oladi va nikoh to'ylari, marosimlar hamda korporativ tadbirlar uchun mos keladi.`,
    descriptionRu: `${hallName} расположен в ${districtRu} и ${ruBody}. Зал одновременно вмещает до ${capacityMax} гостей и подходит для свадеб, торжеств и корпоративных мероприятий.`,
    descriptionEn: `${hallName} is located in ${districtEn}, ${regionEn}, and ${enBody}. The venue accommodates up to ${capacityMax} guests at a time and suits weddings, celebrations, and corporate events alike.`,
  };
}

type VenueSeed = {
  businessName: string;
  hallName: string;
  region: string;
  district: string;
  address: string;
  lat: number;
  lng: number;
  capacityMin: number;
  capacityMax: number;
  priceMin: number;
  priceMax: number;
  tier: Tier;
  categories: string[];
  services: string[];
  parking: boolean;
  outdoorArea: boolean;
  vipRoom: boolean;
  luxury: boolean;
  budget: boolean;
  kitchenType: string;
  featured: boolean;
  status: "APPROVED" | "PENDING";
};

const VENUES: VenueSeed[] = [
  { businessName: "Bahor Group MChJ", hallName: "Bahor Palace", region: "tashkent-city", district: "yunusabad", address: "Yunusobod tumani, Amir Temur ko'chasi 45", lat: 41.3421, lng: 69.2879, capacityMin: 200, capacityMax: 600, priceMin: 180000, priceMax: 320000, tier: "luxury", categories: ["wedding-hall", "luxury"], services: ["catering", "decor", "photography", "live-music", "valet", "led-screen"], parking: true, outdoorArea: false, vipRoom: true, luxury: true, budget: false, kitchenType: "Milliy va Yevropa", featured: true, status: "APPROVED" },
  { businessName: "Oltin Vodiy Servis", hallName: "Oltin Vodiy To'yxonasi", region: "tashkent-city", district: "mirzo-ulugbek", address: "Mirzo Ulug'bek tumani, Buyuk Ipak Yo'li 12", lat: 41.3275, lng: 69.3306, capacityMin: 150, capacityMax: 400, priceMin: 150000, priceMax: 260000, tier: "vip", categories: ["wedding-hall", "vip"], services: ["catering", "decor", "photography", "photo-zone"], parking: true, outdoorArea: false, vipRoom: true, luxury: false, budget: false, kitchenType: "Milliy", featured: false, status: "APPROVED" },
  { businessName: "Malika Saroy MChJ", hallName: "Malika Saroyi", region: "tashkent-city", district: "chilanzar", address: "Chilonzor tumani, Bunyodkor shoh ko'chasi 78", lat: 41.2795, lng: 69.2034, capacityMin: 300, capacityMax: 800, priceMin: 220000, priceMax: 380000, tier: "luxury", categories: ["wedding-hall", "luxury", "vip"], services: ["catering", "decor", "photography", "live-music", "wedding-planner", "fireworks"], parking: true, outdoorArea: true, vipRoom: true, luxury: true, budget: false, kitchenType: "Yevropa va Turk", featured: true, status: "APPROVED" },
  { businessName: "Navruz Bog' Xizmatlari", hallName: "Navruz Bog'i", region: "tashkent-city", district: "yashnabad", address: "Yashnobod tumani, Bog'ishamol ko'chasi 5", lat: 41.2953, lng: 69.3412, capacityMin: 100, capacityMax: 300, priceMin: 90000, priceMax: 160000, tier: "garden", categories: ["garden", "budget"], services: ["catering", "decor", "kids-room", "photo-zone"], parking: true, outdoorArea: true, vipRoom: false, luxury: false, budget: true, kitchenType: "Milliy", featured: false, status: "APPROVED" },
  { businessName: "Shohsaroy Holding", hallName: "Shohsaroy", region: "tashkent-city", district: "shaykhantahur", address: "Shayxontohur tumani, Navoiy ko'chasi 101", lat: 41.3111, lng: 69.2401, capacityMin: 250, capacityMax: 700, priceMin: 200000, priceMax: 350000, tier: "luxury", categories: ["wedding-hall", "luxury", "vip"], services: ["catering", "decor", "photography", "live-music", "valet", "fireworks"], parking: true, outdoorArea: false, vipRoom: true, luxury: true, budget: false, kitchenType: "Milliy va Yevropa", featured: true, status: "APPROVED" },
  { businessName: "Gulshan Xizmat", hallName: "Gulshan To'yxonasi", region: "tashkent-city", district: "yakkasaray", address: "Yakkasaroy tumani, Shota Rustaveli ko'chasi 22", lat: 41.2891, lng: 69.2678, capacityMin: 120, capacityMax: 350, priceMin: 120000, priceMax: 210000, tier: "restaurant", categories: ["restaurant", "wedding-hall"], services: ["catering", "decor", "photography"], parking: true, outdoorArea: false, vipRoom: false, luxury: false, budget: false, kitchenType: "Milliy", featured: false, status: "APPROVED" },
  { businessName: "Zarafshon Servis", hallName: "Zarafshon Saroyi", region: "tashkent-city", district: "sergeli", address: "Sergeli tumani, Qo'yliq ko'chasi 9", lat: 41.2189, lng: 69.2456, capacityMin: 100, capacityMax: 250, priceMin: 80000, priceMax: 140000, tier: "budget", categories: ["budget", "wedding-hall"], services: ["catering", "decor"], parking: true, outdoorArea: false, vipRoom: false, luxury: false, budget: true, kitchenType: "Milliy", featured: false, status: "APPROVED" },
  { businessName: "Diyor Palace Group", hallName: "Diyor Palace", region: "tashkent-city", district: "yunusabad", address: "Yunusobod tumani, Farg'ona yo'li 200", lat: 41.3567, lng: 69.2987, capacityMin: 400, capacityMax: 1000, priceMin: 250000, priceMax: 420000, tier: "luxury", categories: ["luxury", "vip", "wedding-hall"], services: ["catering", "decor", "photography", "live-music", "wedding-planner", "valet", "fireworks", "led-screen"], parking: true, outdoorArea: true, vipRoom: true, luxury: true, budget: false, kitchenType: "Yevropa", featured: true, status: "APPROVED" },
  { businessName: "Chinor Bog' MChJ", hallName: "Chinor Bog'i", region: "tashkent-region", district: "chirchiq", address: "Chirchiq shahri, Registon ko'chasi 3", lat: 41.4689, lng: 69.5822, capacityMin: 150, capacityMax: 400, priceMin: 100000, priceMax: 180000, tier: "garden", categories: ["garden", "restaurant"], services: ["catering", "decor", "kids-room"], parking: true, outdoorArea: true, vipRoom: false, luxury: false, budget: false, kitchenType: "Milliy", featured: false, status: "APPROVED" },
  { businessName: "Vodiy Saroy Xizmat", hallName: "Vodiy Saroyi", region: "tashkent-region", district: "angren", address: "Angren shahri, Shahriston ko'chasi 15", lat: 41.0186, lng: 70.1436, capacityMin: 100, capacityMax: 280, priceMin: 85000, priceMax: 150000, tier: "budget", categories: ["budget"], services: ["catering", "decor"], parking: true, outdoorArea: false, vipRoom: false, luxury: false, budget: true, kitchenType: "Milliy", featured: false, status: "PENDING" },
  { businessName: "Registon Saroy MChJ", hallName: "Registon Saroyi", region: "samarkand", district: "samarkand-city", address: "Samarqand shahri, Registon ko'chasi 1", lat: 39.6542, lng: 66.9597, capacityMin: 300, capacityMax: 900, priceMin: 200000, priceMax: 360000, tier: "luxury", categories: ["luxury", "vip", "wedding-hall"], services: ["catering", "decor", "photography", "live-music", "wedding-planner", "fireworks"], parking: true, outdoorArea: true, vipRoom: true, luxury: true, budget: false, kitchenType: "Milliy va Yevropa", featured: true, status: "APPROVED" },
  { businessName: "Afrosiyob Servis", hallName: "Afrosiyob To'yxonasi", region: "samarkand", district: "samarkand-city", address: "Samarqand shahri, Islom Karimov ko'chasi 34", lat: 39.6473, lng: 66.9749, capacityMin: 150, capacityMax: 400, priceMin: 130000, priceMax: 230000, tier: "restaurant", categories: ["restaurant", "wedding-hall"], services: ["catering", "decor", "photography"], parking: true, outdoorArea: false, vipRoom: false, luxury: false, budget: false, kitchenType: "Milliy", featured: false, status: "APPROVED" },
  { businessName: "Ipak Yo'li Bog' Xizmatlari", hallName: "Ipak Yo'li Bog'i", region: "samarkand", district: "urgut", address: "Urgut tumani, Bog'i Shamol ko'chasi 7", lat: 39.4067, lng: 67.2256, capacityMin: 100, capacityMax: 300, priceMin: 90000, priceMax: 160000, tier: "garden", categories: ["garden", "budget"], services: ["catering", "decor", "kids-room"], parking: true, outdoorArea: true, vipRoom: false, luxury: false, budget: true, kitchenType: "Milliy", featured: false, status: "APPROVED" },
  { businessName: "Buxoro Saroy MChJ", hallName: "Buxoro Saroyi", region: "bukhara", district: "bukhara-city", address: "Buxoro shahri, Bahouddin Naqshband ko'chasi 18", lat: 39.7681, lng: 64.4556, capacityMin: 250, capacityMax: 600, priceMin: 180000, priceMax: 310000, tier: "luxury", categories: ["luxury", "wedding-hall"], services: ["catering", "decor", "photography", "live-music", "valet"], parking: true, outdoorArea: true, vipRoom: true, luxury: true, budget: false, kitchenType: "Milliy va Turk", featured: true, status: "APPROVED" },
  { businessName: "Minorai Kalon Group", hallName: "Minorai Kalon Palace", region: "bukhara", district: "kagan", address: "Kogon shahri, Mustaqillik ko'chasi 9", lat: 39.7239, lng: 64.5514, capacityMin: 200, capacityMax: 500, priceMin: 150000, priceMax: 260000, tier: "vip", categories: ["vip", "wedding-hall"], services: ["catering", "decor", "photography", "photo-zone"], parking: true, outdoorArea: false, vipRoom: true, luxury: false, budget: false, kitchenType: "Milliy", featured: false, status: "APPROVED" },
  { businessName: "Farg'ona Vodiysi Servis", hallName: "Farg'ona Vodiysi Saroyi", region: "fergana", district: "fergana-city", address: "Farg'ona shahri, Al-Farg'oniy ko'chasi 22", lat: 40.3894, lng: 71.7826, capacityMin: 200, capacityMax: 550, priceMin: 160000, priceMax: 280000, tier: "luxury", categories: ["luxury", "wedding-hall"], services: ["catering", "decor", "photography", "live-music"], parking: true, outdoorArea: false, vipRoom: true, luxury: true, budget: false, kitchenType: "Milliy va Yevropa", featured: false, status: "APPROVED" },
  { businessName: "Marg'ilon Ipagi MChJ", hallName: "Marg'ilon Ipagi", region: "fergana", district: "margilan", address: "Marg'ilon shahri, Atlas ko'chasi 11", lat: 40.4716, lng: 71.7244, capacityMin: 150, capacityMax: 350, priceMin: 110000, priceMax: 190000, tier: "restaurant", categories: ["restaurant"], services: ["catering", "decor", "photography"], parking: true, outdoorArea: false, vipRoom: false, luxury: false, budget: false, kitchenType: "Milliy", featured: false, status: "APPROVED" },
  { businessName: "Qo'qon Xon Saroy", hallName: "Qo'qon Xon Saroyi", region: "fergana", district: "kokand", address: "Qo'qon shahri, Muqimiy ko'chasi 40", lat: 40.5283, lng: 70.9428, capacityMin: 250, capacityMax: 600, priceMin: 170000, priceMax: 300000, tier: "vip", categories: ["vip", "luxury"], services: ["catering", "decor", "photography", "live-music", "fireworks"], parking: true, outdoorArea: true, vipRoom: true, luxury: true, budget: false, kitchenType: "Milliy", featured: true, status: "APPROVED" },
  { businessName: "Andijon Bahori Xizmat", hallName: "Andijon Bahori", region: "andijan", district: "andijan-city", address: "Andijon shahri, Bobur ko'chasi 6", lat: 40.7789, lng: 72.3446, capacityMin: 100, capacityMax: 300, priceMin: 85000, priceMax: 150000, tier: "budget", categories: ["budget", "wedding-hall"], services: ["catering", "decor"], parking: true, outdoorArea: false, vipRoom: false, luxury: false, budget: true, kitchenType: "Milliy", featured: false, status: "APPROVED" },
  { businessName: "Asaka Palace Servis", hallName: "Asaka Palace", region: "andijan", district: "asaka", address: "Asaka shahri, Mustaqillik ko'chasi 14", lat: 40.6408, lng: 72.2331, capacityMin: 150, capacityMax: 400, priceMin: 120000, priceMax: 210000, tier: "restaurant", categories: ["restaurant"], services: ["catering", "decor", "photography"], parking: true, outdoorArea: false, vipRoom: false, luxury: false, budget: false, kitchenType: "Milliy", featured: false, status: "APPROVED" },
  { businessName: "Namangan Saroy MChJ", hallName: "Namangan Saroyi", region: "namangan", district: "namangan-city", address: "Namangan shahri, Uychi ko'chasi 27", lat: 40.9983, lng: 71.6634, capacityMin: 200, capacityMax: 500, priceMin: 150000, priceMax: 260000, tier: "luxury", categories: ["luxury", "wedding-hall"], services: ["catering", "decor", "photography", "live-music"], parking: true, outdoorArea: false, vipRoom: true, luxury: true, budget: false, kitchenType: "Milliy va Yevropa", featured: false, status: "APPROVED" },
  { businessName: "Xiva Xon Saroy Servis", hallName: "Xiva Xon Saroyi", region: "khorezm", district: "khiva", address: "Xiva shahri, Ichan Qal'a ko'chasi 3", lat: 41.3789, lng: 60.3639, capacityMin: 200, capacityMax: 500, priceMin: 160000, priceMax: 280000, tier: "vip", categories: ["vip", "luxury"], services: ["catering", "decor", "photography", "live-music", "photo-zone"], parking: true, outdoorArea: true, vipRoom: true, luxury: true, budget: false, kitchenType: "Milliy", featured: true, status: "APPROVED" },
  { businessName: "Termiz Bog' Xizmatlari", hallName: "Termiz Bog'i", region: "surkhandarya", district: "termez", address: "Termiz shahri, Alpomish ko'chasi 8", lat: 37.2231, lng: 67.2789, capacityMin: 120, capacityMax: 350, priceMin: 95000, priceMax: 170000, tier: "garden", categories: ["garden"], services: ["catering", "decor", "kids-room"], parking: true, outdoorArea: true, vipRoom: false, luxury: false, budget: false, kitchenType: "Milliy", featured: false, status: "APPROVED" },
  { businessName: "Qarshi Saroy MChJ", hallName: "Qarshi Saroyi", region: "kashkadarya", district: "karshi", address: "Qarshi shahri, Nasaf ko'chasi 19", lat: 38.8608, lng: 65.7894, capacityMin: 150, capacityMax: 400, priceMin: 100000, priceMax: 180000, tier: "restaurant", categories: ["restaurant", "budget"], services: ["catering", "decor"], parking: true, outdoorArea: false, vipRoom: false, luxury: false, budget: true, kitchenType: "Milliy", featured: false, status: "APPROVED" },
];

const TESTIMONIAL_NAMES = [
  "Dilnoza & Bekzod", "Madina & Jasur", "Nilufar & Sardor", "Zarina & Aziz",
  "Gulnora & Otabek", "Shahnoza & Farrux", "Kamola & Sanjar", "Malika & Umid",
];

async function main() {
  console.log("Seeding database...");

  const passwordHash = await hash(process.env.ADMIN_PASSWORD ?? "Admin123!");
  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL ?? "admin@toyxonatop.uz" },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL ?? "admin@toyxonatop.uz",
      name: "Admin",
      passwordHash,
      role: "ADMIN",
      phone: "+998901234567",
    },
  });

  const ownerPassword = await hash("Owner123!");
  const owners = [];
  for (let i = 0; i < 10; i++) {
    const email = `owner${i + 1}@toyxonatop.uz`;
    const owner = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        name: `Egasi ${i + 1}`,
        passwordHash: ownerPassword,
        role: "OWNER",
        phone: `+99890${1000000 + i * 37}`,
        telegram: `@toyxona_owner${i + 1}`,
      },
    });
    owners.push(owner);
  }

  const customerPassword = await hash("Customer123!");
  const customers = [];
  for (let i = 0; i < 6; i++) {
    const email = `customer${i + 1}@toyxonatop.uz`;
    const customer = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        name: TESTIMONIAL_NAMES[i].replace(" & ", " va "),
        passwordHash: customerPassword,
        role: "CUSTOMER",
      },
    });
    customers.push(customer);
  }

  for (const s of SERVICES) {
    await prisma.service.upsert({ where: { slug: s.slug }, update: {}, create: s });
  }
  for (const c of CATEGORIES) {
    await prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: c });
  }

  for (let i = 0; i < VENUES.length; i++) {
    const v = VENUES[i];
    const owner = owners[i % owners.length];
    const slugBase = slugify(v.hallName);
    const slug = `${slugBase}-${i + 1}`;
    const { descriptionUz, descriptionRu, descriptionEn } = buildDescriptions(
      v.hallName,
      v.district,
      v.region,
      v.capacityMax,
      v.tier,
      i,
    );

    const existing = await prisma.venue.findUnique({ where: { slug } });
    if (existing) continue;

    const venue = await prisma.venue.create({
      data: {
        slug,
        ownerId: owner.id,
        businessName: v.businessName,
        hallName: v.hallName,
        ownerName: owner.name,
        phones: toJsonList([
          `+998 9${(i % 9) + 1} ${100 + i} ${10 + i} ${20 + i}`,
          `+998 7${(i % 9) + 1} 200 ${10 + i} ${20 + i}`,
        ]),
        telegram: `@${slugBase}_toy`,
        email: `info@${slugBase.replace(/-/g, "")}.uz`,
        website: `https://${slugBase.replace(/-/g, "")}.uz`,
        instagram: `@${slugBase.replace(/-/g, "_")}`,
        region: v.region,
        district: v.district,
        address: v.address,
        lat: v.lat,
        lng: v.lng,
        capacityMin: v.capacityMin,
        capacityMax: v.capacityMax,
        priceMin: v.priceMin,
        priceMax: v.priceMax,
        currency: "UZS",
        descriptionUz,
        descriptionRu,
        descriptionEn,
        parking: v.parking,
        outdoorArea: v.outdoorArea,
        vipRoom: v.vipRoom,
        halal: true,
        luxury: v.luxury,
        budget: v.budget,
        hasKitchen: true,
        kitchenType: v.kitchenType,
        virtualTourUrl: i % 5 === 0 ? `https://kuula.co/share/collection/${slugBase}` : null,
        status: v.status,
        featured: v.featured,
        rating: 0,
        reviewCount: 0,
        viewCount: Math.floor(Math.random() * 4000) + 50,
        services: { connect: v.services.map((s) => ({ slug: s })) },
        categories: { connect: v.categories.map((c) => ({ slug: c })) },
        photos: {
          create: [
            ...Array.from({ length: 5 }).map((_, p) => ({
              url: placeholderImageUrl(`${slug}-interior-${p}`, 1200, 800),
              kind: "INTERIOR",
              order: p,
            })),
            ...Array.from({ length: 4 }).map((_, p) => ({
              url: placeholderImageUrl(`${slug}-exterior-${p}`, 1200, 800),
              kind: "EXTERIOR",
              order: p,
            })),
          ],
        },
        videos:
          i % 3 === 0
            ? { create: [{ url: "https://www.youtube.com/embed/dQw4w9WgXcQ", title: `${v.hallName} — video tour` }] }
            : undefined,
      },
    });

    if (v.status === "APPROVED") {
      const reviewCount = 2 + (i % 4);
      let ratingSum = 0;
      for (let r = 0; r < reviewCount; r++) {
        const rating = 4 + (r % 2);
        ratingSum += rating;
        await prisma.review.create({
          data: {
            venueId: venue.id,
            userId: customers[(i + r) % customers.length].id,
            rating,
            comment:
              rating === 5
                ? "Ajoyib to'yxona, xizmat a'lo darajada! Barcha mehmonlar mamnun bo'lishdi."
                : "Yaxshi to'yxona, narxi ham mos. Faqat parkovka biroz tor edi.",
            status: "APPROVED",
            createdAt: new Date(Date.now() - r * 1000 * 60 * 60 * 24 * (i + 1)),
          },
        });
      }
      await prisma.venue.update({
        where: { id: venue.id },
        data: {
          reviewCount,
          rating: Math.round((ratingSum / reviewCount) * 10) / 10,
        },
      });

      for (let f = 0; f < (i % 3); f++) {
        await prisma.favorite.upsert({
          where: { userId_venueId: { userId: customers[f].id, venueId: venue.id } },
          update: {},
          create: { userId: customers[f].id, venueId: venue.id },
        });
      }
    }
  }

  await prisma.advertisement.deleteMany();
  await prisma.advertisement.create({
    data: {
      title: "Bahorgi chegirmalar — 20% gacha",
      imageUrl: placeholderImageUrl("ad-banner-1", 1600, 500),
      linkUrl: "/search",
      placement: "HOME_BANNER",
      active: true,
    },
  });

  console.log(`Seeded: ${VENUES.length} venues, ${owners.length} owners, ${customers.length} customers, admin=${admin.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
