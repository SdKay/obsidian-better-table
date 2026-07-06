<div align="center">

<img src="./docs/banner.png" alt="Rich Table" />

<p>
  <b>🔀 合并单元格 &nbsp;·&nbsp; 🎨 样式设置 &nbsp;·&nbsp; 🏷️ 类型列 &nbsp;·&nbsp; 🔗 双链补全 &nbsp;·&nbsp; ↕️ 拖拽排序 &nbsp;·&nbsp; ↔️ 调整宽高</b>
</p>

<p>
  <a href="https://github.com/SdKay/obsidian-rich-table/releases/latest">
    <img src="https://img.shields.io/github/v/release/SdKay/obsidian-rich-table?style=flat-square&color=7c3aed" alt="最新版本" />
  </a>
  <a href="https://github.com/SdKay/obsidian-rich-table/releases">
    <img src="https://img.shields.io/github/downloads/SdKay/obsidian-rich-table/total?style=flat-square&color=brightgreen" alt="总下载量" />
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/github/license/SdKay/obsidian-rich-table?style=flat-square" alt="许可证" />
  </a>
  <a href="https://obsidian.md/plugins?id=rich-table">
    <img src="https://img.shields.io/badge/Obsidian-社区插件-7c3aed?style=flat-square&logo=obsidian&logoColor=white" alt="Obsidian 社区插件" />
  </a>
</p>

<p>
  <a href="#为什么选择-rich-table">为什么？</a> ·
  <a href="#功能演示">演示</a> ·
  <a href="#格式说明">格式</a> ·
  <a href="#功能介绍">功能</a> ·
  <a href="#安装">安装</a> ·
  <a href="README.md">English</a>
</p>

<p>
  <img src="docs/wechat-qrcode.jpg" alt="微信公众号二维码" width="120" />
  <br/><sub>扫码关注公众号，获取更多 Obsidian 插件与效率工具资讯</sub>
</p>

</div>

> **仅限 Obsidian 使用。** `rich-table` 围栏代码块由插件渲染，在标准 Markdown 编辑器或 GitHub 预览中无法显示。

为 Obsidian 打造的富交互表格插件——支持单元格合并、内联编辑、双链自动补全、类型列、拖拽排序等功能。

---

## 为什么选择 Rich Table？

| 功能 | 原生表格 | Rich Table |
| --- | --- | --- |
| 单元格合并 | ✗ | ✓ |
| 点击单元格内联编辑 | ✗ | ✓ |
| 单元格内 `[[双链]]` 自动补全 | ✗ | ✓ |
| 类型列（状态、优先级…） | ✗ | ✓ |
| 单元格样式（背景色/字号…） | ✗ | ✓ |
| 表格标题与底部备注 | ✗ | ✓ |
| 拖拽排序行 / 列 | ✗ | ✓ |
| 拖拽调整列宽 / 行高 | ✗ | ✓ |
| 插入 / 隐藏 / 删除行列 | ✗ | ✓ |

---

## 功能演示

**1 · 模板快速开始**

![快速开始演示](docs/demo-01-template.gif)

**2 · 合并单元格** — 拖选 → 弹窗点 Merge

![合并单元格演示](docs/demo-02-merge.gif)

**3 · 类型列 & 样式设置** — 单击切换值，双击设置样式

![类型列与样式演示](docs/demo-03-style.gif)

**4 · 拖拽排序 & 行列操作** — ⠿ 手柄拖排 + 双击弹出操作菜单

![排序与操作演示](docs/demo-05-reorder.gif)

**5 · 拖拽调整宽高** — 拖拽列标题右边缘调整列宽 · 拖拽行底边缘调整行高

![调整宽高演示](docs/demo-06-resize.gif)

**6 · 标题与底部备注** — 单击内联编辑，Shift+Enter 换行

![标题与备注演示](docs/demo-07-title-footer.gif)

---

## 格式说明

````markdown
```rich-table
---
title: 项目看板
columns:
  - { name: 任务,   width: 200 }
  - { name: 状态,   type: task-status }
  - { name: 负责人 }
merges:
  - A3:A4
styles:
  - { target: "1:1", bold: true, bg: "#e8f0fe" }
footer: "每周更新 · 点击任意单元格即可编辑"
---
| 任务     | 状态    | 负责人    |
| -------- | ------- | --------- |
| 设计架构 | done    | [[Alice]] |
| 编码实现 | pending | [[Bob]]   |
| 测试     | todo    |           |
| 部署上线 | todo    |           |
```
````

代码块以可选的 YAML 头部（title、columns、merges、styles、footer）开头，后跟标准 Markdown 表格。

**坐标记法**（用于 `merges` 和 `styles` 的 target 字段）：

| 写法 | 含义 |
| ---- | ---- |
| `A1` | 单元格 — A 列第 1 行（表头） |
| `A2:B4` | 范围 |
| `B*` | B 列整列（包括将来新增的行） |
| `A:C` | A 到 C 整列 |
| `*3` | 第 3 行整行 |
| `1:1` | 整个表头行 |
| `2:4` | 行范围 |

---

## 功能与计划

| 功能 | |
|------|:-:|
| **编辑** | |
| 单击任意单元格内联编辑——纯文本、`[[双链]]`、加粗、斜体 | ✅ |
| 输入 `[[` 触发 Obsidian 原生文件与标题自动补全 | ✅ |
| 双击 / 右键菜单——插入、删除、隐藏行列；合并单元格；设置样式；切换列类型 | ✅ |
| 键盘导航——方向键在格间移动，Tab 跳到下一格 | 🔜 |
| 从 Excel / CSV 粘贴表格 | 🔜 |
| **类型列** | |
| 彩色标签徽章，单击下拉选值 | ✅ |
| 内置类型：`task-status` · `priority` · `boolean` · `rating` · `effort` · `approval` | ✅ |
| 自定义类型（设置 → Rich Table） | ✅ |
| 行筛选——按条件过滤行 | ✅ |
| 状态栏——"显示 X / Y 行 · 清除"，与排序/聚合统一设计 | 🔜 |
| 行排序——点击列标题对行排序 | 🔜 |
| **样式** | |
| 双击面板或 YAML 对任意单元格/行/列/范围设置背景色、文字颜色、字号 | ✅ |
| 行列选择条——悬停显示，点击或拖拽选整行/列，写入语义坐标（`1:1`、`B*`、`A:C`） | ✅ |
| 条件格式——根据单元格值规则自动设置样式 | 🔜 |
| 进度条类型列 · 聚合行（SUM / COUNT） | 🔜 |
| **合并与复制粘贴** | |
| 单元格合并——拖选后点 Merge，或在 YAML 中声明 | ✅ |
| 在 rich-table 之间或与 Excel 之间复制粘贴（保留合并状态） | 🔜 |
| **表格结构** | |
| 拖拽 ⠿ 手柄排序行 / 列 | ✅ |
| 拖拽列右边缘 / 行底边缘调整宽高 | ✅ |
| 悬停底边 / 右边 → **+** 条带快速追加行 / 列 | ✅ |
| 隐藏与显示行 / 列 | ✅ |
| 冻结表头行 / 前 N 列 | 🔜 |
| 行分组——可折叠的行组 | 🔜 |
| **标题与批注** | |
| 表格标题和底部备注——单击内联编辑 | ✅ |
| 单元格备注——浮动备注，悬停展开 | 🔜 |

---

## 安装

**推荐 — 社区插件浏览器：**

1. 打开 **设置 → 第三方插件 → 浏览**
2. 搜索 **Rich Table** 并安装
3. 启用插件

或直接跳转：[在 Obsidian 中打开](https://obsidian.md/plugins?id=rich-table)

**手动安装：** 将 `main.js`、`manifest.json`、`styles.css` 复制到 `<vault>/.obsidian/plugins/rich-table/`

最低 Obsidian 版本：**1.8.7**

---

## Claude Code Skill

仓库中附带了 [`SKILL.md`](SKILL.md)，可与 [Claude Code](https://claude.ai/code) 配合使用。安装后，Claude agent 可以直接在 vault 中创建和修改 `rich-table` 块——添加行、设置样式、定义合并——无需记忆语法。

```bash
cp SKILL.md ~/.claude/skills/rich-table/SKILL.md
```

之后告诉 Claude："在我的笔记里用 rich-table 创建一个项目看板"，它会自动生成对应的代码块。

---

## 许可证

[AGPL-3.0](LICENSE)——衍生作品须以相同协议开源。

**商业授权**请联系：sdkxyx@gmail.com

## 支持与反馈

问题反馈与功能建议：[GitHub Issues](https://github.com/SdKay/obsidian-rich-table/issues)

---

[![Star History Chart](https://api.star-history.com/svg?repos=SdKay/obsidian-rich-table&type=Date)](https://star-history.com/#SdKay/obsidian-rich-table&Date)
