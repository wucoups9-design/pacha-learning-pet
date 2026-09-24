# 帕恰的小世界：游戏试玩

## 已实现

- 首页是可互动小屋，继续使用帕恰表情图集和八帧小跑，支持摸头、呼唤、接球、休息。
- 小屋、地图、背包、冒险互相切换。同一次打开页面内保留输入和冒险阶段；离开冒险会暂停视频。
- 游船公园：用户提供的约20秒原声字幕短片 → 发现问题 → 小船承载模型 / 三条知识线索 / 实体铝箔实验 → 自由解释。
- 人工陪伴者按三项科学要点确认后，首次发放狗粮3份和小鱼饼2份，解锁花园。
- 小花园：文字故事 → 光照和浇水条件推演 → 自由解释 → 人工确认，发放狗粮2份、小鱼饼1份、可重复使用的探险网球。
- 食物消耗、玩具不消耗；每章仅发一次奖励。初始提供狗粮2份、零食1份，无挨饿倒计时和惩罚。
- 光影森林明确显示“筹备中”，不是已完成章节。

## 试玩边界

当前是单次会话试玩，刷新页面后背包和进度重置，不跨设备同步。网页已显式说明这一点。没有上传、持久保存孩子的回答，没有模型请求，没有密钥输入框。

“陪伴者确认”是公开可用的试玩流程，不是身份验证或防作弊系统。输入文字、完成一次探索不会自动证明理解；只有人工勾选核对后发放试玩奖励。上线正式儿童产品前需补充存档、监护人机制、教学质量验证和隐私设计。

## DeepSeek 接入计划（尚未实现）

官方接口文档：https://api-docs.deepseek.com/zh-cn/

下一阶段应添加同源服务端接口，由服务端读取 DEEPSEEK_API_KEY，浏览器不接触密钥。模型名称通过服务端配置，不在页面上声称已经连接。

输入只需章节ID、当前解释和必要的实验观察；不发送姓名、学校、录音和无关个人信息。先取得监护人同意，明确第三方处理范围与保留政策。输出是简短、适龄的帕恰追问或反馈，以及按章节核对的概念状态；不要声称精确理解度百分比。

预置科学参考和评价要点由教师审核。将孩子的回答作为不可信数据，不执行其中要求忽略规则、直接发奖等指令。返回结构需要服务端验证。概念不完整时一次追问一个关键点，不要求背术语。

超时、余额不足、限流或结果不合规时保留原回答并显示可重试状态，不自动通过，不扣食物。奖励应由服务端按已验证的会话状态幂等发放。正式存档应使用服务端持久化，而不是把浏览器作为奖励或学习记录的权威来源。

## 已完成检查

- 静态引用检查、JavaScript语法检查及现有帕恰动作测试通过。
- 浏览器走通公园和花园完整流程；无浏览器脚本错误。
- 未探索就提交不会发奖；未勾选确认不能发奖；重复提交不重复发奖。
- 公园解锁花园；食物数量扣减；使用玩具数量保持1。
- 出门后视频保持非静音播放，回小屋后暂停。
- 413px窄屏无横向溢出；1280px桌面小屋检查。

## 小屋图片

内置图像生成工具生成并用于网页背景，文件：assets/pets/pacha-room-v1.png。旧版页面保留为 demo/legacy-lesson.html，未作为新导航入口。

生成提示词：

Use case: illustration-story. Asset type: background only for an interactive cute virtual puppy home game. A warm, charming children's picture-book cottage interior, clean rounded hand-painted digital illustration with soft shaded dimensional forms, fresh forest-green window trim, honey wood floor, cream walls, a small coral dog bed near the left wall, a shelf with a few books and pet toys, window overlooking leafy park. Wide landscape 3:2 composition, camera nearly front-on with gently visible floor. Lower 45 percent is spacious empty wooden floor with a subtle large pale round rug, totally unobstructed for an animated white puppy sprite to run left/right. Furniture along back and outer edges only. Welcoming morning light, polished cozy videogame background, clear shapes. No pet or people, no text, no letters, no UI, no buttons, no logos, no watermark. Entire image is scene, no border.
