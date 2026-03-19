// scripts/fetch-itunes-previews.ts
// Run: npx tsx scripts/fetch-itunes-previews.ts
// Queries iTunes Search API and updates src/data/album-tracks.ts with preview URLs

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

interface iTunesResult {
  trackName: string;
  artistName: string;
  previewUrl: string;
  artworkUrl100: string;
}

interface iTunesResponse {
  resultCount: number;
  results: iTunesResult[];
}

const searches = [
  { id: "chicago-17", query: "Chicago Stay the Night", artist: "Chicago" },
  { id: "papa-roach-paramour", query: "Papa Roach Forever", artist: "Papa Roach" },
  { id: "linkin-park-hybrid-theory", query: "Linkin Park In the End", artist: "Linkin Park" },
  { id: "shinedown", query: "Shinedown Simple Man", artist: "Shinedown" },
  { id: "halestorm", query: "Halestorm It's Not You", artist: "Halestorm" },
  { id: "silversun-pickups", query: "Silversun Pickups Panic Switch", artist: "Silversun Pickups" },
  { id: "evanescence", query: "Evanescence Better Without You", artist: "Evanescence" },
  { id: "godsmack", query: "Godsmack Lighting Up the Sky", artist: "Godsmack" },
  { id: "fair-to-midland", query: "Fair to Midland Dance of the Manatee", artist: "Fair to Midland" },
  { id: "breaking-benjamin", query: "Breaking Benjamin Diary of Jane", artist: "Breaking Benjamin" },
];

async function fetchPreview(query: string, artist: string): Promise<{ previewUrl: string; artworkUrl: string } | null> {
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=10`;
  const res = await fetch(url);
  const data: iTunesResponse = await res.json();
  const match = data.results.find((r) =>
    r.artistName.toLowerCase().includes(artist.toLowerCase()) && r.previewUrl
  );
  if (match) {
    return { previewUrl: match.previewUrl, artworkUrl: match.artworkUrl100 };
  }
  return null;
}

async function main() {
  const dataPath = join(import.meta.dirname || __dirname, "../src/data/album-tracks.ts");
  let content = readFileSync(dataPath, "utf-8");

  for (const search of searches) {
    console.log(`Fetching: ${search.query}...`);
    const result = await fetchPreview(search.query, search.artist);

    if (result) {
      const blockRegex = new RegExp(
        `("${search.id}":\\s*\\{[^}]*artworkUrl:\\s*)"[^"]*"([^}]*previewUrl:\\s*)"[^"]*"`,
        "s"
      );
      content = content.replace(blockRegex, `$1"${result.artworkUrl}"$2"${result.previewUrl}"`);
      console.log(`  Found: ${result.previewUrl.substring(0, 60)}...`);
    } else {
      console.log(`  No match found`);
    }

    await new Promise((r) => setTimeout(r, 200));
  }

  writeFileSync(dataPath, content);
  console.log("\nDone! Updated src/data/album-tracks.ts");
}

main().catch(console.error);
