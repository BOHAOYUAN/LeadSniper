# LeadSniper 用户手册

**作者：** Bohao Yuan（HY Digital Studio）  
**官网：** [bohaoyuan.github.io/LeadSniper](https://bohaoyuan.github.io/LeadSniper/)

---

## 0. 先聊两句

嘿，我是 Bohao，LeadSniper 的开发者。

我做这个插件的原因很简单：**我烦透了每天在 Twitter 和 LinkedIn 上手动翻帖子找客户**。手都快废了，效率还低。

所以我就想，能不能让 AI 帮我干这活？于是 LeadSniper 就诞生了。

它不是什么大公司的产品，就是我一个人写出来的工具。**代码透明，数据存你本地，我碰不到。** 你信得过我，就用；信不过，随便审计。

下面就是怎么装、怎么用。我尽量说人话。

---

## 1. 你买了之后会拿到什么

付款成功后，你会收到一个压缩包：`LeadSniper_Secure.zip`

解压后里面有：

- `LeadSniper/` 文件夹 —— 插件的全部源代码（manifest、后台脚本、3D 面板、样式）
- `How-to-Install.html` —— 一个离线安装指南，中英双语，长得还挺好看

没有隐藏的 exe 文件，没有后台安装器，没有远程追踪。**纯浏览器插件。**

---

## 2. 安装步骤（手把手）

### Chrome 浏览器

1. 解压 `LeadSniper_Secure.zip` 到一个你找得到的地方，比如 `文档/LeadSniper`
2. 在地址栏输入 `chrome://extensions/` 并回车
3. 打开右上角的 **“开发者模式”**
4. 点击左上角的 **“加载已解压的扩展程序”**
5. 选择你刚才解压出来的 `LeadSniper/` 文件夹（就是包含 `manifest.json` 的那个）
6. 安装完成后，点击浏览器右上角的拼图图标，把 LeadSniper 固定在工具栏上

### Edge 浏览器

步骤几乎一样：

1. 解压到本地
2. 地址栏输入 `edge://extensions/`
3. 左侧边栏打开“开发人员模式”
4. 点击“加载解压缩的扩展”
5. 选择 `LeadSniper/` 文件夹
6. 点击地址栏旁边的眼睛图标，把插件固定

---

## 3. 隐私和安全（这是你最关心的）

**一句话：你的数据永远是你的，我碰不到。**

- 你的账号、API Key、抓到的客户信息、历史记录……全部存在你浏览器的本地存储里（`chrome.storage.local`），不上传任何服务器
- AI 扫描时，你的数据直接从你的浏览器发给 DeepSeek 或 OpenAI，不经过我任何中间服务器
- 你自己带的 API Key，你付多少钱给 DeepSeek 就是多少钱，我不加价

**没有隐藏收费，没有数据偷跑，没有中间人。**

---

## 4. 第一次使用：激活 + 配置

点击浏览器工具栏里的 LeadSniper 图标，打开控制中心。

### A. 激活 License Key

你从 Dodo Payments 付款后会收到一封邮件，里面有一个 License Key。

- 在“授权与模型”卡片里粘贴你的 License Key
- 点击“激活”按钮
- 控制中心会自动显示你的套餐：LTD Basic（$199）或 LTD Pro（$588）

### B. 配置 API Key（DeepSeek 或 OpenAI）

LeadSniper 默认优化的是 **DeepSeek-V3**，但也兼容任何 OpenAI 格式 of API。

- 在 API Key 输入框里粘贴你的 Key（从 DeepSeek 或 OpenAI 官网拿）
- 点击“测试”按钮，跑一次诊断
- 看到“测试通过”就说明好了

**高级选项（一般不折腾）：**
- Base URL：默认 `https://api.deepseek.com/chat/completions`
- Model：默认 `deepseek-chat`，你也可以改成 `gpt-4o` 或 `gpt-4o-mini`

---

## 5. 设置你的目标客户画像

想让 AI 知道该抓谁、该怎么回复你？填好下面这几项：

**目标客户 & 痛点**  
> 示例：正在为客户流失发愁的 B2B SaaS 创始人，想找增长工具……

**你的价值主张**  
> 示例：LeadSniper——一个浏览器本地的 B2B 社交意图追踪工具，自动抓潜客、生成回复……

**AI 回复风格**（三选一）：
- 💻 极客风：技术细节多，硬核
- 🤝 温暖风：咨询式，好说话
- 👔 高管风：直击 ROI，专业

---

## 6. 两种运行模式

### 1. AUTO-HUNTER 模式（普通模式）

**怎么用：** 正常刷你的社交媒体信息流就行。LeadSniper 在后台自动扫描你划过的每一条帖子，判断这个人有没有购买意向。

**适合场景：** 你自己在刷手机/电脑，让 AI 帮你当“副驾驶”，看到高潜客户就给你标出来。

### 2. AUTO-PILOT 模式（仅 Pro 版）

**怎么用：** 半自动模式。AI 自动判断意向、显示分析结果、帮你写好回复草稿。

**第一次开启时会弹出一个免责声明**：AI 写的只是草稿，你必须在发送前自己看一眼、手动修改。**绝不会自动点击“发送”按钮**。

**安全机制：**
- 模拟人类打字的速度和随机延迟，减少被反爬的风险
- 只负责复制草稿或模拟打字，**发送键必须你亲自点**
- 如果出问题，点红色的 🛑 紧急停止按钮，AUTO-PILOT 会立刻停掉，并且强制冷却 30 分钟

---

## 7. 过滤规则和安全限制

在“过滤与限制”卡片里调整：

**Auto-Fill 分数阈值（70–95）**  
> 只有分数高于这个值的帖子才会被标记为“高意向客户”。  
> **建议设为 85**。如果低于 80，会把很多不相关的帖子也扫进来，增加被封号的风险。

**本地关键词黑名单**  
> 输入你想屏蔽的关键词，用英文逗号隔开。例如：`crypto, airdrop, giveaway`  
> 包含这些词的帖子会被直接跳过。

**每日草稿上限**：
- Basic 版（$199）：每天最多 15 条草稿，到了会弹红条提示升级
- Pro 版（$588）：无限草稿

> ⚠️ 如果你每天发超过 50 条私信/回复，LinkedIn 和 X 很容易把你标记为机器人。建议悠着点，分散时间发。

---

## 8. 3D 雷达侧边栏（核心工作区）

点击控制中心里的“OPEN 3D RADAR”按钮，会打开一个酷炫的侧边栏。

### 界面里有什么：

- **3D 雷达图**：每个检测到的意向客户会变成一个漂浮的粒子，分数越高粒子越大、脉动越明显。点击粒子可以选中。
- **伪装仪表盘**：显示实时伪装数据（画布噪点、指纹轮换、住宅 IP 状态等）
- **实时日志**：滚动显示扫描过程、DOM 解析、webhook 状态
- **命令行输入**：你可以直接打自然语言指令，比如“提取个人资料”“生成一条回复”，然后点 EXECUTE

### 点击某个客户后，右侧会滑出详情面板：

- **意向分数**（0–100）
- **分析理由**：为什么这个人值得跟（比如“明确表达了流失客户的痛点”）
- **公司信息、职位、简介**
- **3 条 AI 生成的回复草稿**（专业版、幽默版、高管版）
- **按钮**：
  - 点击草稿 → 复制到剪贴板
  - ⚡ DIRECT SNIPE → 复制专业版草稿并自动填入回复框
  - SYNC TO CRM → 把客户信息推送到你的 CRM

---

## 9. CRM 同步（Webhook）

支持把客户信息一键推送到你的 CRM 管道（Airtable、HubSpot、Notion，或者用 Make、Zapier、n8n 搭建的 webhook）。

**设置方法：**

- 在“Cloud CRM 同步”输入框里粘贴你的 webhook 地址
- 示例：`https://api.yourcrm.com/webhook` 或 `https://hook.us1.make.com/xxxx`
- 打开“自动推送”开关，AI 扫到合格客户就会自动推送；关掉的话，需要你手动点“SYNC TO CRM”

**推送的 JSON 格式：**

```json
{
  "source": "LeadSniper_V3_Radar",
  "timestamp": "2026-06-09T18:27:14.000Z",
  "target_name": "John Doe",
  "intent_score": 92,
  "category": "COMMERCIAL_LEAD",
  "analysis_reason": "决策者抱怨客户流失率高、手动流程繁琐，正在找自动化工具",
  "profile_data": {
    "company": "Acme SaaS Inc.",
    "bio": "Acme SaaS 创始人，前 YC 背景，做 B2B 软件"
  },
  "outreach_drafts": {
    "Professional": "Hey John，流失率上升确实头疼。如果你想在不搞复杂仪表盘的情况下自动化客户成功流程，LeadSniper 正好合适。",
    "Humor": "John，价格调整加 15% 流失率——手动救场的一天开始了。想快速抄近路？聊聊。",
    "Director": "看到你关于 Acme SaaS 和定价摩擦的帖子。我帮过不少 B2B 创始人在一周内解决这个问题。"
  }
}
```

---

## 10. 防封号小贴士（血的教训）

虽然 LeadSniper 模拟了人类打字速度，但平台的规则始终是严格的。**以下是我踩过的坑，分享给你：**

1. **不要用任何自动点击“发送”的脚本**  
   LeadSniper 只负责写草稿 and 模拟打字，发送必须你自己点。这是最大的保护。

2. **控制每天发送量**  
   - X（Twitter）：每天不超过 50 条私信/回复  
   - LinkedIn：每天不超过 30 条

3. **如果批量操作，用指纹浏览器**  
   比如 AdsPower、Multilogin，配合高质量住宅代理。

4. **定期自查是否被影子封禁**  
   打开浏览器的无痕窗口，登出账号，看看你发的回复是否还可见。  
   如果看不见了，说明你发太猛了。降量、多休息几天。

---

## 📬 联系 & 支持

- **商户主体（收款方）：** Dodo Payments → support@dodopayments.com
- **技术支持（我本人）：** Bohao Yuan / HY Digital Studio → hy@hydigital.studio
- **官网：** [bohaoyuan.github.io/LeadSniper](https://bohaoyuan.github.io/LeadSniper/)

有任何问题直接邮件找我，我会回。

---

好了，手册就这么多。去抓客户吧，别把自己号搞封了就行。

—— Bohao
