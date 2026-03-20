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
    artworkUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/53/06/fc/5306fc44-f884-7d1a-3d9a-6fcb5dd33fc0/mzi.ahzanusn.jpg/100x100bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/69/f0/73/69f07378-5b05-53e3-f2d8-4e378e0ca945/mzaf_17934802157133446698.plus.aac.p.m4a",
  },
  "papa-roach-paramour": {
    artist: "Papa Roach",
    track: "Forever",
    album: "The Paramour Sessions",
    artworkUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music128/v4/e7/93/e2/e793e2b8-d12b-4762-2dfa-54da8338d5ca/00602517081864.rgb.jpg/100x100bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/a9/8d/34/a98d3433-23e2-d71c-b5de-7716a6fcf2d8/mzaf_13448504511873384368.plus.aac.p.m4a",
  },
  "linkin-park-hybrid-theory": {
    artist: "Linkin Park",
    track: "In the End",
    album: "Hybrid Theory",
    artworkUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/53/a7/7f/53a77fab-c54c-a57b-8130-248fc12d0c80/093624948995.jpg/100x100bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/3f/cb/c7/3fcbc7cc-0606-7f6e-7fc3-793318cfd1ed/mzaf_16081918663584534594.plus.aac.p.m4a",
  },
  "shinedown": {
    artist: "Shinedown",
    track: "Simple Man",
    album: "The Sound of Madness",
    artworkUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/9a/a7/fb/9aa7fb92-2fa3-dcac-3fa5-5841104821d9/mzi.vcbwmgud.jpg/100x100bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/0f/d8/20/0fd820f9-b3e9-111b-5d48-2098823d355e/mzaf_12999965779402868422.plus.aac.p.m4a",
  },
  "halestorm": {
    artist: "Halestorm",
    track: "It's Not You",
    album: "Halestorm",
    artworkUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/16/79/f1/1679f199-d5ae-d4b4-66f5-7425f4bfa22a/mzi.qqkfxhab.jpg/100x100bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/ff/24/a1/ff24a182-3696-f3da-0f69-667feed7d102/mzaf_4285869540893768331.plus.aac.p.m4a",
  },
  "silversun-pickups": {
    artist: "Silversun Pickups",
    track: "Panic Switch",
    album: "Swoon",
    artworkUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/b8/63/27/b8632723-ca02-7fac-9327-f22b1ea214a7/121477.jpg/100x100bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/24/0a/67/240a67f6-8e83-3478-d00a-c18f3ab9815f/mzaf_4817506931546365563.plus.aac.p.m4a",
  },
  "evanescence": {
    artist: "Evanescence",
    track: "Better Without You",
    album: "The Bitter Truth",
    artworkUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/69/68/b7/6968b7c7-3635-6cf0-6db9-c7a0cca6c15d/4050538637090.jpg/100x100bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/b4/d0/1f/b4d01f0b-5601-bc5d-6bc1-2b2500c7d704/mzaf_1396186298968785572.plus.aac.p.m4a",
  },
  "godsmack": {
    artist: "Godsmack",
    track: "Lighting Up the Sky",
    album: "Lighting Up the Sky",
    artworkUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/4e/0b/b1/4e0bb166-e6f6-9645-60d8-b7b19649e462/4050538858839.jpg/100x100bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/60/62/8c/60628c10-0f84-af9c-741d-8919b76d9c3a/mzaf_10248732955974552610.plus.aac.p.m4a",
  },
  "fair-to-midland": {
    artist: "Fair to Midland",
    track: "Dance of the Manatee",
    album: "Fables from a Mayfly: The Diary of Poe",
    artworkUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music123/v4/a6/85/ef/a685efc2-abdd-8882-073a-29b380a1944b/07UMGIM06136.rgb.jpg/100x100bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/86/83/af/8683afab-8334-e20f-d7a6-c5ec3e10cb06/mzaf_1253594459571962518.plus.aac.p.m4a",
  },
  "breaking-benjamin": {
    artist: "Breaking Benjamin",
    track: "The Diary of Jane",
    album: "Phobia",
    artworkUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/3e/17/f0/3e17f07a-3234-dfdb-03ad-341c162ead92/00720616264763.rgb.jpg/100x100bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/46/5c/b1/465cb148-e0e8-f12e-b871-ef4b4494d262/mzaf_13136985139407366665.plus.aac.p.m4a",
  },
};
