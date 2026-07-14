import { z } from "zod";
import { ROLES } from "./constants";

export const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(6).max(72),
  phone: z.string().min(7).max(20).optional().or(z.literal("")),
  role: z.enum(["CUSTOMER", "OWNER"]),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().min(3).max(1000),
  guestName: z.string().min(2).max(60).optional().or(z.literal("")),
  photos: z.array(z.string().url()).max(6).optional(),
});
export type ReviewInput = z.infer<typeof reviewSchema>;

export const venueSchema = z.object({
  businessName: z.string().min(2).max(120),
  hallName: z.string().min(2).max(120),
  ownerName: z.string().min(2).max(120),
  phones: z.array(z.string().min(7).max(20)).min(1),
  telegram: z.string().max(60).optional().or(z.literal("")),
  email: z.string().email().optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal("")),
  instagram: z.string().max(60).optional().or(z.literal("")),

  region: z.string().min(2),
  district: z.string().min(2),
  address: z.string().min(4).max(200),
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),

  capacityMin: z.coerce.number().int().min(10).max(5000),
  capacityMax: z.coerce.number().int().min(10).max(5000),
  priceMin: z.coerce.number().int().min(0),
  priceMax: z.coerce.number().int().min(0),

  descriptionUz: z.string().min(20).max(4000),
  descriptionRu: z.string().min(20).max(4000),
  descriptionEn: z.string().min(20).max(4000),

  parking: z.boolean().default(false),
  outdoorArea: z.boolean().default(false),
  vipRoom: z.boolean().default(false),
  halal: z.boolean().default(true),
  luxury: z.boolean().default(false),
  budget: z.boolean().default(false),
  hasKitchen: z.boolean().default(true),
  kitchenType: z.string().max(60).optional().or(z.literal("")),

  virtualTourUrl: z.string().url().optional().or(z.literal("")),

  serviceSlugs: z.array(z.string()).default([]),
  categorySlugs: z.array(z.string()).default([]),

  photosInterior: z.array(z.string().url()).default([]),
  photosExterior: z.array(z.string().url()).default([]),
  videos: z.array(z.string().url()).default([]),
});
export type VenueInput = z.infer<typeof venueSchema>;

export const adSchema = z.object({
  title: z.string().min(2).max(120),
  imageUrl: z.string().url(),
  linkUrl: z.string().url(),
  placement: z.enum(["HOME_TOP", "SEARCH_SIDEBAR", "HOME_BANNER"]),
  active: z.boolean().default(true),
});
export type AdInput = z.infer<typeof adSchema>;

export function assertRole(role: string): role is (typeof ROLES)[number] {
  return (ROLES as readonly string[]).includes(role);
}
