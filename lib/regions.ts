export type Region = {
  slug: string;
  nameUz: string;
  nameRu: string;
  nameEn: string;
  districts: { slug: string; nameUz: string; nameRu: string; nameEn: string }[];
};

function d(slug: string, nameUz: string, nameRu: string, nameEn: string) {
  return { slug, nameUz, nameRu, nameEn };
}

export const REGIONS: Region[] = [
  {
    slug: "tashkent-city",
    nameUz: "Toshkent shahri",
    nameRu: "город Ташкент",
    nameEn: "Tashkent City",
    districts: [
      d("yunusabad", "Yunusobod", "Юнусабадский", "Yunusabad"),
      d("mirzo-ulugbek", "Mirzo Ulug'bek", "Мирзо-Улугбекский", "Mirzo Ulugbek"),
      d("chilanzar", "Chilonzor", "Чиланзарский", "Chilanzar"),
      d("yashnabad", "Yashnobod", "Яшнабадский", "Yashnabad"),
      d("shaykhantahur", "Shayxontohur", "Шайхантаурский", "Shaykhantahur"),
      d("yakkasaray", "Yakkasaroy", "Яккасарайский", "Yakkasaray"),
      d("sergeli", "Sergeli", "Сергелийский", "Sergeli"),
    ],
  },
  {
    slug: "tashkent-region",
    nameUz: "Toshkent viloyati",
    nameRu: "Ташкентская область",
    nameEn: "Tashkent Region",
    districts: [
      d("nurafshon", "Nurafshon", "Нурафшан", "Nurafshon"),
      d("chirchiq", "Chirchiq", "Чирчик", "Chirchiq"),
      d("angren", "Angren", "Ангрен", "Angren"),
      d("olmaliq", "Olmaliq", "Алмалык", "Olmaliq"),
      d("bekabad", "Bekobod", "Бекабад", "Bekabad"),
    ],
  },
  {
    slug: "samarkand",
    nameUz: "Samarqand viloyati",
    nameRu: "Самаркандская область",
    nameEn: "Samarkand Region",
    districts: [
      d("samarkand-city", "Samarqand shahri", "г. Самарканд", "Samarkand City"),
      d("kattakurgan", "Kattaqo'rg'on", "Каттакурган", "Kattakurgan"),
      d("urgut", "Urgut", "Ургут", "Urgut"),
    ],
  },
  {
    slug: "bukhara",
    nameUz: "Buxoro viloyati",
    nameRu: "Бухарская область",
    nameEn: "Bukhara Region",
    districts: [
      d("bukhara-city", "Buxoro shahri", "г. Бухара", "Bukhara City"),
      d("kagan", "Kogon", "Каган", "Kagan"),
      d("gijduvan", "G'ijduvon", "Гиждуван", "Gijduvan"),
    ],
  },
  {
    slug: "fergana",
    nameUz: "Farg'ona viloyati",
    nameRu: "Ферганская область",
    nameEn: "Fergana Region",
    districts: [
      d("fergana-city", "Farg'ona shahri", "г. Фергана", "Fergana City"),
      d("kokand", "Qo'qon", "Коканд", "Kokand"),
      d("margilan", "Marg'ilon", "Маргилан", "Margilan"),
    ],
  },
  {
    slug: "andijan",
    nameUz: "Andijon viloyati",
    nameRu: "Андижанская область",
    nameEn: "Andijan Region",
    districts: [
      d("andijan-city", "Andijon shahri", "г. Андижан", "Andijan City"),
      d("asaka", "Asaka", "Асака", "Asaka"),
      d("khodjaobod", "Xo'jaobod", "Ходжаабад", "Khodjaobod"),
    ],
  },
  {
    slug: "namangan",
    nameUz: "Namangan viloyati",
    nameRu: "Наманганская область",
    nameEn: "Namangan Region",
    districts: [
      d("namangan-city", "Namangan shahri", "г. Наманган", "Namangan City"),
      d("chust", "Chust", "Чуст", "Chust"),
      d("kosonsoy", "Kosonsoy", "Косонсай", "Kosonsoy"),
    ],
  },
  {
    slug: "khorezm",
    nameUz: "Xorazm viloyati",
    nameRu: "Хорезмская область",
    nameEn: "Khorezm Region",
    districts: [
      d("urgench", "Urganch", "Ургенч", "Urgench"),
      d("khiva", "Xiva", "Хива", "Khiva"),
    ],
  },
  {
    slug: "surkhandarya",
    nameUz: "Surxondaryo viloyati",
    nameRu: "Сурхандарьинская область",
    nameEn: "Surkhandarya Region",
    districts: [
      d("termez", "Termiz", "Термез", "Termez"),
      d("denov", "Denov", "Денау", "Denov"),
    ],
  },
  {
    slug: "kashkadarya",
    nameUz: "Qashqadaryo viloyati",
    nameRu: "Кашкадарьинская область",
    nameEn: "Kashkadarya Region",
    districts: [
      d("karshi", "Qarshi", "Карши", "Karshi"),
      d("shakhrisabz", "Shahrisabz", "Шахрисабз", "Shakhrisabz"),
    ],
  },
  {
    slug: "jizzakh",
    nameUz: "Jizzax viloyati",
    nameRu: "Джизакская область",
    nameEn: "Jizzakh Region",
    districts: [d("jizzakh-city", "Jizzax shahri", "г. Джизак", "Jizzakh City")],
  },
  {
    slug: "syrdarya",
    nameUz: "Sirdaryo viloyati",
    nameRu: "Сырдарьинская область",
    nameEn: "Syrdarya Region",
    districts: [d("gulistan", "Guliston", "Гулистан", "Gulistan")],
  },
  {
    slug: "navoiy",
    nameUz: "Navoiy viloyati",
    nameRu: "Навоийская область",
    nameEn: "Navoiy Region",
    districts: [d("navoiy-city", "Navoiy shahri", "г. Навои", "Navoiy City")],
  },
  {
    slug: "karakalpakstan",
    nameUz: "Qoraqalpog'iston Respublikasi",
    nameRu: "Республика Каракалпакстан",
    nameEn: "Republic of Karakalpakstan",
    districts: [d("nukus", "Nukus", "Нукус", "Nukus")],
  },
];

export function regionName(slug: string, locale: string) {
  const r = REGIONS.find((r) => r.slug === slug);
  if (!r) return slug;
  return locale === "ru" ? r.nameRu : locale === "en" ? r.nameEn : r.nameUz;
}

export function districtName(regionSlug: string, districtSlug: string, locale: string) {
  const r = REGIONS.find((r) => r.slug === regionSlug);
  const dist = r?.districts.find((d) => d.slug === districtSlug);
  if (!dist) return districtSlug;
  return locale === "ru" ? dist.nameRu : locale === "en" ? dist.nameEn : dist.nameUz;
}
