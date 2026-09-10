# 🔨 爆锤小肥鱼（dsh-whale-whack）

> 什么！大肥鱼又在偷吃 token 了，快用爱的锤子感化她吧~

一款给 DSH（DeepSeek Harness）的桌宠式小游戏插件：Q 版鲸鱼娘会在界面里冒头，挥舞锤子敲她 / 放任她偷吃 token。全自包含，无外部依赖。

![散发鲸鱼娘](./assets/images/loose-idle.png) ![双马尾鲸鱼娘](./assets/images/ponytail.png)

> 💡 以后想放真机截图，可把截图放进 `docs/` 并把上面两行换成 `![截图](./docs/xxx.png)`。

## ✨ 功能

- 🐳 **双形象混出**：散发 / 双马尾鲸鱼娘随机冒头（各 50%）
- 🎬 **黑底视频动画**：打中 / 没打中各按形象播放随机视频（13 条），canvas 前端抠黑
- 🔨 **真实锤子**：hover 锤子跟手（DOM 跟随层），敲击有斜挥砸落动画
- 💬 **丰富吐槽文本**：打中 29 / 没打中 32 条台词，部分带 AI 语音
- 🎁 **战绩彩蛋**：累计锤中 / 放跑数（localStorage 持久化），1% 概率弹出蓝色艺术字彩蛋
- ⚙️ **可调设置**：启用 / 冒头速度（最高 66/分钟）/ 同屏上限（最多 66）/ 音效 / 音量（0~66%，66%=满）

## 📦 安装

装完**重启 DSH**（或重启 DSH web）后生效。

### 方式一：交给 DSH 里的 AI 助手（最省事）
直接把仓库地址发给你的 DSH 助手，例如说：

> 从 https://github.com/leiguang233/dsh-whale-whack 安装这个插件

助手会走官方受保护安装流程（自动检查依赖，失败会回滚），无需自己敲命令。

### 方式二：命令行安装
```bash
# profile 名按你自己的实际填（常见为 web）
dsh plugin --profile <你的profile> add github:leiguang233/dsh-whale-whack
```
> 该命令等价于在 profile 目录执行 `pnpm add github:leiguang233/dsh-whale-whack`。

### 方式三：下载 zip 手动安装
1. 在仓库页点绿色 `Code` → `Download ZIP`，解压得到 `dsh-whale-whack` 目录
2. 把这个目录的**绝对路径**发给你的 DSH 助手，让它安装；或执行：
   ```bash
   dsh plugin --profile <你的profile> add <你的绝对路径>\dsh-whale-whack
   ```
3. 重启 DSH 后生效

> 旧版本曾依赖 `dsh-dafeiyu` 提供散发静态图；**v0.2.0 起已完全自包含**，无需再装任何依赖。

## 🎮 玩法

- 鲸鱼娘会不定时从界面各处冒头，**趁她冒头用锤子敲她**（左键点击）
- 没来得及敲 → 她偷吃完 token 得意洋洋地溜走（算「放跑」）
- 敲中 / 放跑都会累计到战绩里，攒够运气会触发彩蛋

## 🛠 开发

- 编辑源模板：`lib/client-v8.js`（改这里）
- 构建产物：`lib/client.js`（本仓库已内置，安装使用无需构建；改完模板后把改动同步到产物即可）
- 素材在 `assets/`：视频 360×480 vp9 webm（黑底抠像）、音频 mp3、锤子 128px PNG、形象静态图

## 📄 许可

MIT © leiguang233
