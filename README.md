# 🔨 爆锤小肥鱼（dsh-whale-whack）

> 什么！大肥鱼又在偷吃 token 了，快用爱的锤子感化她吧~

一款给 DSH（DeepSeek Harness）的桌宠式小游戏插件：Q 版鲸鱼娘会在界面里冒头，挥舞锤子敲她 / 放任她偷吃 token。全自包含，无外部依赖。

![散发鲸鱼娘](./assets/images/loose-idle.png) ![双马尾鲸鱼娘](./assets/images/ponytail.png)

> 💡 以后想放真机截图，可把截图放进 `docs/` 并把上面两行换成 `![截图](./docs/xxx.png)`。

## ✨ 功能

- 🐳 **双形象混出**：散发 / 双马尾鲸鱼娘随机冒头（各 50%）
- 🎬 **黑底视频动画**：打中 / 没打中各按形象播放随机视频（13 条），canvas 前端抠黑
- 🔨 **真实锤子**：hover 锤子跟手（DOM 跟随层），敲击有斜挥砸落动画
- 💬 **丰富吐槽文本**：打中 / 没打中各 ~30 条台词，部分带真人语音（用户坏 / 哼 / 嗷呜 / 嘤嘤嘤 / 嘿嘿 / 笨蛋 / 啦啦啦）
- 🎁 **战绩彩蛋**：累计锤中 / 放跑数（localStorage 持久化），1% 概率弹出蓝色艺术字彩蛋（数字金色）
- ⚙️ **可调设置**：启用 / 冒头速度（1~66/分钟）/ 同屏上限（1~66）/ 音效 / 音量（0~66%，66%=满）

## 📦 安装

### 方式一：已装 DSH + 从 GitHub 安装
```bash
# 在你的 DSH 环境执行（profile 名按实际）
dshpm install github:leiguang233/dsh-whale-whack --profile <name>
```

### 方式二：下载 zip 手动安装
1. 下载本仓库 zip 并解压，得到 `dsh-whale-whack` 目录
2. 在 DSH 中执行：
   ```
   plugin_install F:\绝对\路径\dsh-whale-whack
   ```
3. **重启 DSH web** 后生效

> 旧版本曾依赖 `dsh-dafeiyu` 提供散发静态图；**v0.2.0 起已完全自包含**，无需再装任何依赖。

## 🎮 玩法

- 鲸鱼娘会不定时从界面各处冒头，**趁她冒头用锤子敲她**（左键点击）
- 没来得及敲 → 她偷吃完 token 得意洋洋地溜走（算「放跑」）
- 敲中 / 放跑都会累计到战绩里，攒够运气会触发彩蛋

## 🛠 开发

- 编辑源模板：`lib/client-v8.js`（改这里）
- 构建产物：`lib/client.js`（勿手改）
- 构建命令：
  ```bash
  node F:/ds/dsh/whale-whack/audio/build-user-audio.js
  ```
  （v8 起构建 = 模板复制 + 自检，不再注入 base64）
- 素材在 `assets/`：视频 360×480 vp9 webm（黑底抠像）、音频 mp3、锤子 128px PNG、形象静态图

## 📄 许可

MIT © leiguang233
