/**
 * Commercial Enablement entities (Version 2.0-A foundation).
 * Additive only — no existing type changes. Nothing consumes these yet.
 */

export type EntityStatus = "active" | "inactive";

export interface CustomerSegment {
  id: string;
  name: string;
  description?: string;
  status: EntityStatus;
  displayOrder: number;
  parentSegmentId?: string;
  /** Reserved for the deterministic classifier (V2.0-C). Empty in 2.0-A. */
  classificationRules?: unknown[];
}

export type MarketRegion = "Americas" | "EMEA" | "APAC";

export interface Market {
  id: string;
  name: string;
  region: MarketRegion;
  regulatoryBody: string;
  countryCode?: string;
  status: EntityStatus;
  displayOrder: number;
  /** Reserved for deterministic market-relevance inference (V2.0-C). Empty in 2.0-A. */
  relevanceRules?: unknown[];
}

export type SalesAssetType = "deck" | "one-pager" | "case-study" | "datasheet" | "whitepaper" | "other";
export type AssetStatus = "published" | "draft" | "archived";

export interface SalesAsset {
  id: string;
  title: string;
  assetType: SalesAssetType;
  /** External/internal URL reference. No file hosting in 2.0-A. */
  url: string;
  description?: string;
  owner?: string;
  version?: string;
  status: AssetStatus;
  tags: string[];
  lastReviewedAt?: string;
}

export type Applicability = "recommended" | "applicable" | "not-applicable";

/** Wildcarded rule: segmentId/marketId may be "*". Absence of any rule ⇒ applies everywhere. */
export interface ServiceApplicabilityRule {
  id: string;
  serviceId: string;
  segmentId: string;
  marketId: string;
  applicability: Applicability;
  positioningNote?: string;
  priority?: number;
}

/** Links a service to a sales asset, optionally scoped to a segment/market/persona. */
export interface ServiceAssetLink {
  id: string;
  serviceId: string;
  assetId: string;
  segmentId?: string;
  marketId?: string;
  personaId?: string;
}
