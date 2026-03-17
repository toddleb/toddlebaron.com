export interface Album {
  artist: string;
  album: string;
  tracks: string[];
}

export const playlist: Album[] = [
  {
    artist: "Tool",
    album: "Lateralus",
    tracks: ["The Grudge", "Eon Blue Apocalypse", "The Patient", "Lateralus", "Schism"],
  },
  {
    artist: "Mastodon",
    album: "Crack the Skye",
    tracks: ["Oblivion", "Divinations", "Quintessence", "The Czar", "The Last Baron"],
  },
  {
    artist: "Rush",
    album: "Moving Pictures",
    tracks: ["Tom Sawyer", "Red Barchetta", "YYZ", "Limelight", "The Camera Eye"],
  },
  {
    artist: "Iron Maiden",
    album: "Powerslave",
    tracks: ["Aces High", "2 Minutes to Midnight", "Flash of the Blade", "Rime of the Ancient Mariner"],
  },
];
