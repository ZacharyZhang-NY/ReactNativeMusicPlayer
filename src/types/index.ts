export interface Artist {
  id: string;
  name: string;
  albumCount: number;
  avatar?: string;
}

export interface Album {
  id: string;
  artistId: string;
  artistName: string;
  title: string;
  cover?: string;
  year?: string;
  trackCount: number;
}

export interface Track {
  id: string;
  albumId: string;
  artistId: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  path: string;
  cover?: string;
}

export type RootStackParamList = {
  Artists: undefined;
  Albums: { artist: Artist };
  Tracks: { album: Album };
  Player: { track: Track; playlist: Track[] };
};