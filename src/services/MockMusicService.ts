import { Artist, Album, Track } from '../types';

// 模拟音乐数据用于开发测试
export const mockArtists: Artist[] = [
  { id: 'artist-1', name: '周杰伦', albumCount: 3, avatar: undefined },
  { id: 'artist-2', name: '林俊杰', albumCount: 2, avatar: undefined },
  { id: 'artist-3', name: '陈奕迅', albumCount: 2, avatar: undefined },
  { id: 'artist-4', name: '邓紫棋', albumCount: 1, avatar: undefined },
];

export const mockAlbums: Album[] = [
  // 周杰伦的专辑
  { id: 'album-1', artistId: 'artist-1', artistName: '周杰伦', title: '范特西', year: '2001', trackCount: 4, cover: undefined },
  { id: 'album-2', artistId: 'artist-1', artistName: '周杰伦', title: '七里香', year: '2004', trackCount: 3, cover: undefined },
  { id: 'album-3', artistId: 'artist-1', artistName: '周杰伦', title: '十一月的萧邦', year: '2005', trackCount: 3, cover: undefined },
  
  // 林俊杰的专辑
  { id: 'album-4', artistId: 'artist-2', artistName: '林俊杰', title: '第二天堂', year: '2004', trackCount: 3, cover: undefined },
  { id: 'album-5', artistId: 'artist-2', artistName: '林俊杰', title: '曹操', year: '2006', trackCount: 3, cover: undefined },
  
  // 陈奕迅的专辑
  { id: 'album-6', artistId: 'artist-3', artistName: '陈奕迅', title: '十年', year: '2003', trackCount: 3, cover: undefined },
  { id: 'album-7', artistId: 'artist-3', artistName: '陈奕迅', title: 'U87', year: '2005', trackCount: 3, cover: undefined },
  
  // 邓紫棋的专辑
  { id: 'album-8', artistId: 'artist-4', artistName: '邓紫棋', title: '新的心跳', year: '2015', trackCount: 4, cover: undefined },
];

export const mockTracks: Track[] = [
  // 周杰伦 - 范特西
  { id: 'track-1', albumId: 'album-1', artistId: 'artist-1', title: '爱在西元前', artist: '周杰伦', album: '范特西', duration: 231, path: '/mock/track1.mp3', cover: undefined },
  { id: 'track-2', albumId: 'album-1', artistId: 'artist-1', title: '爸我回来了', artist: '周杰伦', album: '范特西', duration: 240, path: '/mock/track2.mp3', cover: undefined },
  { id: 'track-3', albumId: 'album-1', artistId: 'artist-1', title: '简单爱', artist: '周杰伦', album: '范特西', duration: 270, path: '/mock/track3.mp3', cover: undefined },
  { id: 'track-4', albumId: 'album-1', artistId: 'artist-1', title: '忍者', artist: '周杰伦', album: '范特西', duration: 160, path: '/mock/track4.mp3', cover: undefined },
  
  // 周杰伦 - 七里香
  { id: 'track-5', albumId: 'album-2', artistId: 'artist-1', title: '七里香', artist: '周杰伦', album: '七里香', duration: 298, path: '/mock/track5.mp3', cover: undefined },
  { id: 'track-6', albumId: 'album-2', artistId: 'artist-1', title: '借口', artist: '周杰伦', album: '七里香', duration: 254, path: '/mock/track6.mp3', cover: undefined },
  { id: 'track-7', albumId: 'album-2', artistId: 'artist-1', title: '断了的弦', artist: '周杰伦', album: '七里香', duration: 233, path: '/mock/track7.mp3', cover: undefined },
  
  // 周杰伦 - 十一月的萧邦
  { id: 'track-8', albumId: 'album-3', artistId: 'artist-1', title: '夜曲', artist: '周杰伦', album: '十一月的萧邦', duration: 226, path: '/mock/track8.mp3', cover: undefined },
  { id: 'track-9', albumId: 'album-3', artistId: 'artist-1', title: '发如雪', artist: '周杰伦', album: '十一月的萧邦', duration: 299, path: '/mock/track9.mp3', cover: undefined },
  { id: 'track-10', albumId: 'album-3', artistId: 'artist-1', title: '黑色毛衣', artist: '周杰伦', album: '十一月的萧邦', duration: 245, path: '/mock/track10.mp3', cover: undefined },
  
  // 林俊杰 - 第二天堂
  { id: 'track-11', albumId: 'album-4', artistId: 'artist-2', title: '江南', artist: '林俊杰', album: '第二天堂', duration: 266, path: '/mock/track11.mp3', cover: undefined },
  { id: 'track-12', albumId: 'album-4', artistId: 'artist-2', title: '第二天堂', artist: '林俊杰', album: '第二天堂', duration: 288, path: '/mock/track12.mp3', cover: undefined },
  { id: 'track-13', albumId: 'album-4', artistId: 'artist-2', title: '子弹列车', artist: '林俊杰', album: '第二天堂', duration: 243, path: '/mock/track13.mp3', cover: undefined },
  
  // 林俊杰 - 曹操
  { id: 'track-14', albumId: 'album-5', artistId: 'artist-2', title: '曹操', artist: '林俊杰', album: '曹操', duration: 244, path: '/mock/track14.mp3', cover: undefined },
  { id: 'track-15', albumId: 'album-5', artistId: 'artist-2', title: '原来', artist: '林俊杰', album: '曹操', duration: 267, path: '/mock/track15.mp3', cover: undefined },
  { id: 'track-16', albumId: 'album-5', artistId: 'artist-2', title: '不流泪的机场', artist: '林俊杰', album: '曹操', duration: 281, path: '/mock/track16.mp3', cover: undefined },
  
  // 陈奕迅 - 十年
  { id: 'track-17', albumId: 'album-6', artistId: 'artist-3', title: '十年', artist: '陈奕迅', album: '十年', duration: 205, path: '/mock/track17.mp3', cover: undefined },
  { id: 'track-18', albumId: 'album-6', artistId: 'artist-3', title: '明年今日', artist: '陈奕迅', album: '十年', duration: 232, path: '/mock/track18.mp3', cover: undefined },
  { id: 'track-19', albumId: 'album-6', artistId: 'artist-3', title: 'K歌之王', artist: '陈奕迅', album: '十年', duration: 221, path: '/mock/track19.mp3', cover: undefined },
  
  // 陈奕迅 - U87
  { id: 'track-20', albumId: 'album-7', artistId: 'artist-3', title: '浮夸', artist: '陈奕迅', album: 'U87', duration: 284, path: '/mock/track20.mp3', cover: undefined },
  { id: 'track-21', albumId: 'album-7', artistId: 'artist-3', title: '夕阳无限好', artist: '陈奕迅', album: 'U87', duration: 238, path: '/mock/track21.mp3', cover: undefined },
  { id: 'track-22', albumId: 'album-7', artistId: 'artist-3', title: '葡萄成熟时', artist: '陈奕迅', album: 'U87', duration: 242, path: '/mock/track22.mp3', cover: undefined },
  
  // 邓紫棋 - 新的心跳
  { id: 'track-23', albumId: 'album-8', artistId: 'artist-4', title: '新的心跳', artist: '邓紫棋', album: '新的心跳', duration: 247, path: '/mock/track23.mp3', cover: undefined },
  { id: 'track-24', albumId: 'album-8', artistId: 'artist-4', title: '再见', artist: '邓紫棋', album: '新的心跳', duration: 233, path: '/mock/track24.mp3', cover: undefined },
  { id: 'track-25', albumId: 'album-8', artistId: 'artist-4', title: '单行的轨道', artist: '邓紫棋', album: '新的心跳', duration: 254, path: '/mock/track25.mp3', cover: undefined },
  { id: 'track-26', albumId: 'album-8', artistId: 'artist-4', title: '瞬间', artist: '邓紫棋', album: '新的心跳', duration: 215, path: '/mock/track26.mp3', cover: undefined },
];