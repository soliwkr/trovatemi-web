import type { PlaceRecord } from "./types.ts";

const FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.primaryTypeDisplayName",
  "places.rating",
  "places.userRatingCount",
  "places.websiteUri",
  "places.nationalPhoneNumber",
  "places.googleMapsUri"
].join(",");

type GooglePlace = {
  id?: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  primaryTypeDisplayName?: { text?: string };
  rating?: number;
  userRatingCount?: number;
  websiteUri?: string;
  nationalPhoneNumber?: string;
  googleMapsUri?: string;
};

export function normalizeQueryPart(value: unknown, max = 80): string {
  return String(value ?? "").trim().replace(/\s+/g, " ").slice(0, max);
}

export function validateRadarInput(category: unknown, city: unknown, limit: unknown) {
  const cleanCategory = normalizeQueryPart(category);
  const cleanCity = normalizeQueryPart(city);
  const parsedLimit = Math.max(3, Math.min(12, Number(limit) || 10));

  if (cleanCategory.length < 2) throw new Error("invalid_category");
  if (cleanCity.length < 2) throw new Error("invalid_city");

  return { category: cleanCategory, city: cleanCity, limit: parsedLimit };
}

export async function searchPlaces(
  apiKey: string,
  category: string,
  city: string,
  limit: number,
): Promise<PlaceRecord[]> {
  const query = `${category} ${city}`;
  const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": FIELD_MASK,
    },
    body: JSON.stringify({
      textQuery: query,
      languageCode: "it",
      regionCode: "IT",
      pageSize: limit,
    }),
  });

  if (!response.ok) {
    throw new Error(`places_upstream_${response.status}`);
  }

  const payload = await response.json() as { places?: GooglePlace[] };
  const places = Array.isArray(payload.places) ? payload.places : [];

  return places
    .map((place, index): PlaceRecord => ({
      id: place.id ?? "",
      name: place.displayName?.text ?? "",
      address: place.formattedAddress ?? "",
      category: place.primaryTypeDisplayName?.text ?? category,
      rating: Number.isFinite(place.rating) ? Number(place.rating) : null,
      reviews: Number.isInteger(place.userRatingCount) ? Number(place.userRatingCount) : null,
      website: place.websiteUri ?? null,
      phone: place.nationalPhoneNumber ?? null,
      googleMapsUri: place.googleMapsUri ?? null,
      positionSignal: index + 1,
    }))
    .filter((place) => place.id && place.name);
}
