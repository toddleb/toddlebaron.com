// src/data/album-tracks.ts
// Static album data — preview URLs populated by scripts/fetch-itunes-previews.ts

export interface AlbumTrack {
  artist: string;
  track: string;
  album: string;
  artworkUrl: string;
  previewUrl: string;
}

export const albumTracks: Record<string, AlbumTrack> = {
  "chicago-17": {
    artist: "Chicago",
    track: "Stay the Night",
    album: "Chicago 17",
    artworkUrl: "",
    previewUrl: "",
  },
  "papa-roach-paramour": {
    artist: "Papa Roach",
    track: "Forever",
    album: "The Paramour Sessions",
    artworkUrl: "",
    previewUrl: "",
  },
  "linkin-park-hybrid-theory": {
    artist: "Linkin Park",
    track: "In the End",
    album: "Hybrid Theory",
    artworkUrl: "",
    previewUrl: "",
  },
  "shinedown": {
    artist: "Shinedown",
    track: "Simple Man",
    album: "The Sound of Madness",
    artworkUrl: "",
    previewUrl: "",
  },
  "halestorm": {
    artist: "Halestorm",
    track: "It's Not You",
    album: "Halestorm",
    artworkUrl: "",
    previewUrl: "",
  },
  "silversun-pickups": {
    artist: "Silversun Pickups",
    track: "Panic Switch",
    album: "Swoon",
    artworkUrl: "",
    previewUrl: "",
  },
  "evanescence": {
    artist: "Evanescence",
    track: "Better Without You",
    album: "The Bitter Truth",
    artworkUrl: "",
    previewUrl: "",
  },
  "godsmack": {
    artist: "Godsmack",
    track: "Lighting Up the Sky",
    album: "Lighting Up the Sky",
    artworkUrl: "",
    previewUrl: "",
  },
  "fair-to-midland": {
    artist: "Fair to Midland",
    track: "Dance of the Manatee",
    album: "Fables from a Mayfly: The Diary of Poe",
    artworkUrl: "",
    previewUrl: "",
  },
  "breaking-benjamin": {
    artist: "Breaking Benjamin",
    track: "The Diary of Jane",
    album: "Phobia",
    artworkUrl: "",
    previewUrl: "",
  },
};
