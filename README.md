# 豆豆的成长日记

> 当前 /demo/ 已更新为「帕恰的小世界」游戏试玩：小屋 → 地图 → 冒险探索 → 自由解释 → 陪伴者确认 → 领奖回家。公园与花园两章可玩，原声字幕视频保留。DeepSeek 尚未接入，本次进度刷新后重置；详见 [游戏试玩与接入计划](docs/pacha-game-demo.md)。下方保留早期原型介绍。

一个把学习藏进宠物养成里的 AI 学习伙伴 Demo。

孩子不是被要求“完成一道题”，而是先照顾豆豆，再通过讲解、喂食、玩耍和实验帮助豆豆成长。豆豆支持待机、倾听、跑动、撒娇和接球等互动反馈；当前 Demo 以“浮力”作为完整互动章节，并在解锁后提供“植物生长”章节的微型照顾任务。

## 在线体验

如果使用 GitHub Pages，打开仓库主页后点击 **进入 Demo**，或直接访问：

```text
https://<你的用户名>.github.io/<仓库名>/demo/
```

## 本地运行

### 互动房间

角色已按用户的宠物帕恰重新设计：奶白蓬松毛发、黑圆眼和下垂毛耳，使用透明图集播放表情与八帧小跑。点击地板可移动，点帕恰可摸头；支持自动散步、嗅闻、眨眼、闭眼撒娇、追球并带回、蜷卧睡觉和触摸唤醒。可暂停动作，系统“减少动态效果”设置下默认暂停。互动计数仅记录本次打开页面。完整造型及素材说明见 `docs/pacha-character-direction.md`。

检查互动逻辑：`node scripts/check_companion.cjs`。同步发布文件：`node scripts/build_static.cjs`。

这是一个无构建步骤的静态网页，不需要安装依赖。可以直接双击 `index.html`，也可以在仓库根目录运行一个本地静态服务器：

```bash
python3 -m http.server 4173
```

然后打开 <http://127.0.0.1:4173/>。

## Demo 体验流程

1. 点击“进入 Demo”。
2. 点击“教豆豆，获得小鱼饼”，用自己的话解释轮船为什么可以浮起来。
3. 点击“喂给豆豆”，回答它提出的反例问题。
4. 调整船体宽度和货物重量，运行虚拟实验。
5. 实验成功后，成长地图会解锁第 3 章“阳台园丁”。
6. 点击“阳台园丁”，完成阳光、适量浇水和通风三个照顾动作。

## 成长路线

1. 认识世界：观察与提问
2. 水上探险：浮力、排开水、平均密度
3. 阳台园丁：植物生长
4. 光影侦探：光与影
5. 天气管家：水循环
6. 小小发明家：结构与材料

详细设计见 [`docs/doudou-growth-path.md`](docs/doudou-growth-path.md)。

## 项目结构

```text
.
├── index.html                 # GitHub Pages 入口页
├── demo/                      # 可交互 Demo
│   ├── index.html
│   ├── app.js
│   └── styles.css
├── assets/pets/               # 豆豆宠物素材
├── docs/                      # 产品、角色和成长线说明
└── scripts/check_site.py      # 静态结构检查
```

## 发布到 GitHub Pages

1. 在 GitHub 新建一个空仓库。
2. 将本目录中的文件上传，或执行：

   ```bash
   git init
   git add .
   git commit -m "feat: add Doudou learning pet demo"
   git branch -M main
   git remote add origin https://github.com/<你的用户名>/<仓库名>.git
   git push -u origin main
   ```

3. 在仓库的 **Settings → Pages** 中选择 `Deploy from a branch`、`main` 分支和 `/ (root)` 目录。
4. 等待 GitHub Pages 发布后，访问仓库主页即可进入 Demo。

## 当前范围

这是一个前端概念验证版本：对话、语音识别、奖励和实验均为浏览器端 Demo 模拟，没有接入真实 AI API、账号系统或真实宠物喂食。后续接入模型时，应保留“孩子先解释、AI 再追问和提示”的学习设计。
