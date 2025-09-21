interface PlaylistResponse {
  version: string;
  name: string;
  description: string;
  originalLink: string;
  originalPlatform: Platform;
  transformTo: Platform;
  imageUrl: string;
  commited: boolean;
  tracks: Track[];
  _id: string;
  createdAt: string;
  expiresAt: string;
  __v: number;
}

interface Track {
  name: string;
  tokens: string[];
  variants: string[];
  ignoredPhrases: string[];
  artists: string[];
  durationMs: number;
  imageUrl: string;
  links: Link[];
  _id: string;
}

interface Link {
  platform: Platform;
  needsReview: boolean;
  candidates: Candidate[];
  _id: string;
}

interface Candidate {
  isMain: boolean;
  name: string;
  tokens: string[];
  variants: string[];
  ignoredPhrases: string[];
  artists: string[];
  url: string;
  uri: string;
  durationMs: number;
  imageUrl: string;
  accuracy: number;
  _id: string;
}

type Platform = "YOUTUBE" | "SPOTIFY";

export type { PlaylistResponse, Track, Link, Candidate, Platform };
