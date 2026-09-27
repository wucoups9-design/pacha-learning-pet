# 帕恰画面与动画更新

## 实现
- 小屋扩展为整行主场景，桌面最大620px高，手机410px高；冒险入口移到小屋下方。
- 对话、找答案、装船、小屋纪念使用现有帕恰姿态图实现眨眼、歪头、轻微呼吸与悬停撒娇。
- 地图和冒险卡使用现有故事视频作静音循环预览，离屏或页面隐藏时暂停；没有生成新视频。
- 顶部全局暂停与小屋暂停同步，并尊重系统减少动态效果设置。
- 追球采用追近、低头拾取、转身、嘴部逐帧跟随、返回、放下六阶段。嘴部坐标按角色尺寸计算，不再按房间宽度偏移。
- 装船使用新生成的透明玩具船、四种可点选玩具、轻微摇摆和超载下沉。15克/件的原模型和奖励条件不变。

## 生成素材
使用内置图像生成工具，保存于 `assets/pets/park-toy-boat-v1.png`，1536×1024 RGBA；原素材不覆盖。

生成提示词：
Use case: stylized-concept. Create a single premium children's game asset: a charming blue and warm ivory enamel toy rowboat, open empty interior, honey-colored wooden bench and warm coral trim, a tiny yellow star insignia, soft tactile storybook 3D materials. True transparent background, no water, no shadow plane, no environment, no letters, no people, no animals, no cargo. Mostly side-on view with slight elevated view so the open interior is visible; bow points right. Entire boat fits, centered, wide horizontal hull in middle 65 percent of a landscape 1536x1024 image. Clean rounded silhouette suitable for compositing and animating load and buoyancy in a children's learning game. Actual transparent alpha, not checkerboard.

## 动画工具调研
- Rive：适合状态驱动交互角色，需要制作对应.riv资产。https://github.com/rive-app/help-center/blob/master/runtimes/state-machines.md
- dotLottie：可播放Lottie与.lottie动画，适合已有导出素材。https://docs.lottiefiles.com/en/runtimes/distributions/web-component
- 本轮复用现有动作图与原生网页动画，不新增软件安装、账号或付费服务。

## 验证
- 浏览器定格检查return阶段：球贴合嘴部；fetch返回完整结束为happy，并更新互动次数。
- 全局暂停同步小屋暂停，预览视频muted与loop均为true。
- 装入不同种类玩具、3件浮起、7件超载、6件恢复、后续追问解锁通过。
- 手机375px内容宽与视口一致，无水平溢出；检查后进一步把玩具托盘与加减按钮固定为紧凑网格。
- JavaScript语法、静态资源检查通过。无LLM接入或儿童数据持久化变更。
