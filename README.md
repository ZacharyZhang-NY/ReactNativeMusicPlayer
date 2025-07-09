# React Native Offline Music Player

一个使用 React Native 和 Unistyles v3 构建的离线音乐播放器应用。

## 功能特性

- 🎵 **完全离线播放** - 扫描并播放设备上的本地音乐文件
- 🎨 **现代化UI设计** - 使用 Unistyles v3 构建的深色主题界面
- 📱 **流畅导航** - 艺术家 → 专辑 → 歌曲的层级浏览
- 🎧 **后台播放** - 支持应用最小化后继续播放
- 🎮 **完整播放控制** - 播放/暂停、上一首/下一首、进度拖动
- 📂 **自动音乐扫描** - 自动扫描设备上的音乐文件并建立索引

## 技术栈

- **React Native** 0.80.1
- **TypeScript** - 类型安全的开发体验
- **Unistyles v3** - 高性能的样式管理方案
- **React Navigation v6** - 导航管理
- **react-native-track-player** - 音频播放引擎
- **react-native-fs** - 文件系统访问
- **react-native-get-music-files** - 音乐文件扫描

## 项目结构

```
src/
├── components/          # 可复用组件
├── screens/            # 应用页面
│   ├── ArtistsScreen.tsx
│   ├── AlbumsScreen.tsx
│   ├── TracksScreen.tsx
│   └── PlayerScreen.tsx
├── navigation/         # 导航配置
│   └── AppNavigator.tsx
├── services/           # 业务逻辑
│   ├── MusicService.ts
│   ├── PlayerService.ts
│   └── MockMusicService.ts
├── styles/             # Unistyles配置
│   ├── unistyles.ts
│   └── styles.ts
├── types/              # TypeScript类型定义
│   └── index.ts
└── utils/              # 工具函数
```

## 开始使用

### 前置要求

- Node.js >= 18
- React Native 开发环境配置完成
- Android Studio / Xcode（取决于目标平台）

### 安装依赖

```bash
cd MusicPlayer
npm install
```

### iOS 设置

```bash
cd ios
pod install
cd ..
```

### 运行应用

#### Android
```bash
npm run android
```

#### iOS
```bash
npm run ios
```

## 使用说明

1. **首次启动**
   - 应用会使用模拟数据展示界面
   - 在艺术家列表页面下拉刷新会触发音乐扫描

2. **音乐扫描**
   - Android 需要授予存储权限
   - 应用会自动扫描设备上的音频文件（mp3、m4a、flac等）
   - 扫描结果会自动保存，下次启动无需重新扫描

3. **播放控制**
   - 点击任意歌曲开始播放
   - 支持播放/暂停、上一首/下一首
   - 可拖动进度条调整播放位置
   - 支持后台播放

## 权限说明

### Android
需要以下权限：
- `READ_EXTERNAL_STORAGE` - 读取音乐文件
- `WRITE_EXTERNAL_STORAGE` - 保存音乐库索引

### iOS
需要配置 Info.plist：
- `NSAppleMusicUsageDescription` - 访问音乐库

## 开发说明

### 添加新功能
1. 在 `src/types/index.ts` 中定义类型
2. 在对应的 service 中实现业务逻辑
3. 创建或修改相应的 screen 组件
4. 使用 Unistyles v3 进行样式管理

### 样式主题
- 支持明暗主题切换（默认暗色主题）
- 主题配置在 `src/styles/unistyles.ts`
- 使用 `useStyles` hook 访问样式

## 故障排除

### Android 构建失败
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### iOS 构建失败
```bash
cd ios
rm -rf Pods
pod install
cd ..
npm run ios
```

### Metro 缓存问题
```bash
npx react-native start --reset-cache
```

## 待优化项

- [ ] 添加搜索功能
- [ ] 支持播放列表创建和管理
- [ ] 添加歌词显示
- [ ] 支持更多音频格式
- [ ] 添加均衡器功能
- [ ] 优化大型音乐库的性能

## 贡献指南

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License