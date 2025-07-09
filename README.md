# 音乐播放器 - React Native Offline Music Player

一个使用 React Native 和 Unistyles v3 构建的离线音乐播放器应用。

## 功能特性

- 🎵 **完整的音频播放功能** - 使用原生 Android MediaPlayer 实现真实音频播放
- 📱 **离线使用** - 无需网络连接，播放本地音乐文件
- 🎨 **Unistyles v3 样式系统** - 高性能的样式解决方案
- 📂 **音乐库扫描** - 自动扫描设备上的音乐文件
- 🎯 **导航流程** - 艺术家 → 专辑 → 歌曲 → 播放器
- 🎮 **完整播放控制** - 播放/暂停、上一首/下一首、进度拖动

## 技术栈

- **React Native** 0.80.1
- **TypeScript** - 类型安全的开发体验
- **React Navigation v6** - 导航管理
- **Unistyles v3** - 高性能样式系统
- **React Native New Architecture** - Fabric & TurboModules
- **原生 Android 音频模块** - 自定义 MediaPlayer 集成

## 项目结构

```
MusicPlayer/
├── src/
│   ├── screens/              # 应用界面
│   │   ├── ArtistsScreen.tsx # 艺术家列表
│   │   ├── AlbumsScreen.tsx  # 专辑列表
│   │   ├── TracksScreen.tsx  # 歌曲列表
│   │   └── PlayerScreen.tsx  # 播放器界面
│   ├── services/             # 业务服务
│   │   ├── MusicService.ts   # 音乐扫描服务
│   │   ├── SimplePlayerService.ts # 播放控制服务
│   │   └── MockMusicService.ts    # 模拟数据服务
│   ├── modules/              # 原生模块接口
│   │   └── AudioPlayer.ts    # 音频播放器模块
│   ├── navigation/           # 导航配置
│   │   └── AppNavigator.tsx
│   ├── styles/               # Unistyles 配置
│   │   ├── unistyles.ts
│   │   └── styles.ts
│   └── types/                # TypeScript 类型定义
│       └── index.ts
└── android/
    └── app/src/main/java/com/musicplayer/
        ├── AudioPlayerModule.java    # 原生音频播放模块
        └── AudioPlayerPackage.java    # 模块注册
```

## 安装和运行

### 前置要求

- Node.js >= 18
- JDK 17
- Android Studio
- Android SDK

### 安装步骤

1. 克隆项目并安装依赖：
```bash
cd MusicPlayer
npm install
```

2. 构建 Android APK：
```bash
cd android
./gradlew assembleDebug --parallel --max-workers=$(nproc) -Dorg.gradle.jvmargs="-Xmx4g -XX:MaxMetaspaceSize=512m"
```

3. APK 文件位置：
```bash
android/app/build/outputs/apk/debug/app-debug.apk
```

### 运行开发版本

```bash
# 启动 Metro 服务器
npm start

# 在另一个终端运行 Android 应用
npm run android
```

## 权限说明

应用需要以下权限（已在 AndroidManifest.xml 中配置）：
- `READ_EXTERNAL_STORAGE` - 读取音乐文件
- `WRITE_EXTERNAL_STORAGE` - 保存应用数据
- `READ_MEDIA_AUDIO` - Android 13+ 音频文件访问
- `MODIFY_AUDIO_SETTINGS` - 音频控制
- `WAKE_LOCK` - 防止播放时休眠
- `FOREGROUND_SERVICE` - 前台服务支持

## 核心功能实现

### 音频播放

使用原生 Android MediaPlayer API 实现：
- 播放/暂停/停止控制
- 进度跟踪和跳转
- 自动播放下一首
- 播放完成和错误事件处理

### 音乐扫描

使用 react-native-fs 递归扫描设备存储：
- 支持格式：mp3, m4a, wav, flac, aac, ogg
- 自动提取音频元数据
- 按艺术家和专辑整理
- 扫描结果本地缓存

### UI 实现

使用 Unistyles v3 实现高性能样式：
- 响应式设计
- 深色主题
- 流畅的过渡动画
- 触摸反馈优化

## 使用说明

1. **首次启动**
   - 应用会显示模拟数据
   - 在艺术家列表页面下拉刷新触发音乐扫描

2. **音乐扫描**
   - 首次使用需要授予存储权限
   - 扫描 Music、Download 等目录
   - 扫描结果自动保存

3. **播放控制**
   - 点击歌曲开始播放
   - 播放器界面显示进度和控制按钮
   - 支持拖动进度条快进/快退

## 开发说明

### 代码规范

- 使用 TypeScript 严格模式
- 遵循 React Native 最佳实践
- 使用 ESLint 进行代码检查

### 调试

```bash
# 查看 Metro 日志
npm start

# 查看 Android 日志
adb logcat | grep -E "(ReactNative|AudioPlayerModule)"
```

### 构建优化版本

```bash
cd android
./gradlew bundleRelease
```

## 故障排除

### 构建失败

1. 清理构建缓存：
```bash
cd android && ./gradlew clean
cd .. && npm start --reset-cache
```

2. 检查 Java 版本：
```bash
java -version  # 应该是 JDK 17
```

### 音乐无法播放

1. 检查存储权限是否已授予
2. 确认音乐文件格式受支持
3. 查看 adb logcat 中的错误信息

### 应用崩溃

1. 检查是否启用了 New Architecture：
   - `android/gradle.properties` 中 `newArchEnabled=true`
2. 重新构建应用

## 待实现功能

- [ ] iOS 平台支持
- [ ] 音量控制滑块
- [ ] 后台播放通知栏控制
- [ ] 播放队列管理
- [ ] 随机/循环播放模式
- [ ] 音乐搜索功能
- [ ] 专辑封面显示
- [ ] 歌词显示
- [ ] 均衡器
- [ ] 睡眠定时器

## 性能优化

- 使用 React Native New Architecture 提升性能
- Unistyles v3 减少样式计算开销
- 音乐列表使用 FlatList 虚拟化
- 图片和封面延迟加载

## 贡献指南

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License