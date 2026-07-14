export const ROLES = ["CUSTOMER", "OWNER", "ADMIN"] as const;
export type RoleValue = (typeof ROLES)[number];

export const VENUE_STATUSES = ["PENDING", "APPROVED", "REJECTED"] as const;
export type VenueStatus = (typeof VENUE_STATUSES)[number];

export const REVIEW_STATUSES = ["PENDING", "APPROVED"] as const;
export type ReviewStatus = (typeof REVIEW_STATUSES)[number];

export const PHOTO_KINDS = ["INTERIOR", "EXTERIOR"] as const;
export type PhotoKind = (typeof PHOTO_KINDS)[number];

export const AD_PLACEMENTS = ["HOME_TOP", "SEARCH_SIDEBAR", "HOME_BANNER"] as const;
export type AdPlacement = (typeof AD_PLACEMENTS)[number];

export const CURRENCY = "UZS";

export const DEFAULT_PAGE_SIZE = 12;
