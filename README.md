# 🌟 Lumina - 智能语言学习应用

> 一个现代化的语言学习应用，集成了智能词典、词形变化分析和间隔重复系统

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.2.0-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-3178c6.svg)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933.svg)

## 🎯 项目概述

Lumina 是一个专为语言学习者设计的现代化语言学习应用。它集成了智能词典系统、AI驱动的语法分析和科学的间隔重复系统(SRS)，帮助用户高效阅读、学习。

### ✨ 核心特性

#### 📚 **智能词典系统**
- **多词条智能显示**：词形变化、不同词性显示为独立编号条目
- **词形变化检测**：自动识别词形变化并切换到词根形式（如"nahm" → "nehmen"）
- **条目分类系统**：`variant`（变体）/`root`（词根）/`normal`（普通）三种类型
- **词条关系可视化**：变体与词根之间的清晰连接指示
- **词性过滤功能**：按动词、名词、形容词等快速筛选条目

#### 🤖 **AI增强学习**
- **语法分析**：AI驱动的详细语法分析
- **智能翻译**：上下文感知的翻译和建议
- **例句生成**：基于上下文的实用例句

#### 🔄 **间隔重复系统(SRS)**
- **科学记忆算法**：基于SM-2算法的智能复习计划
- **学习进度跟踪**：5个学习等级 + 忽略选项
- **词汇库管理**：分类、搜索和统计功能

#### 🌐 **离线支持**
- **本地词典数据库**：从kaikki下载词典到本地即可查询
- **离线词形分析**：无需网络即可分析词形变化
- **数据持久化**：浏览器本地存储所有学习数据

#### 🎨 **主题化界面**
- **多主题支持**：Light、Dark、Night、Sepia、Paper、High Contrast、Auto
- **字体自定义**：字体大小、字重、行高、字体族全面可调
- **实时预览**：所有外观设置即时预览效果
- **跨组件一致**：所有界面组件统一应用主题设置

## 🏗️ 系统架构

### 前端 (React + TypeScript)
- **React 18**：现代化的组件化UI
- **TypeScript**：类型安全的开发体验
- **Tailwind CSS**：原子化CSS框架
- **Vite**：快速的构建工具

### 后端 (Node.js + Express)
- **词典服务器**：运行在端口3006的REST API
- **SQLite数据库**：词典数据存储
- **智能查询引擎**：支持词形变化检测和多条目返回

### 服务层
- `wiktionaryService.ts`：词典API服务接口
- `dictionaryService.js`：核心词典查询逻辑
- `llmService.ts`：AI分析服务
- `srsService.ts`：间隔重复系统

## 🚀 快速开始

### 前提条件

- **Node.js 18+**: [下载安装](https://nodejs.org/)
- **npm** (随 Node.js 一起安装)
- **Git**: [下载安装](https://git-scm.com/)

---

## 🪟 Windows 安装指南

### 1. 安装 Node.js

访问 [Node.js 官网](https://nodejs.org/) 下载 LTS 版本（推荐 20.x）。

安装时确保勾选：
- ✅ `Add to PATH`
- ✅ `Node.js runtime`

安装完成后，打开 **PowerShell** 或 **命令提示符** 验证：

```powershell
node -v
npm -v
```

### 2. 克隆项目

```powershell
git clone https://github.com/HashBrowns-fries/Lumina.git
cd Lumina
```

### 3. 安装依赖

```powershell
# 安装前端依赖
npm install

# 安装词典服务器依赖
cd server
npm install
cd ..
```

### 4. 配置环境变量（可选）

在项目根目录创建 `.env.local` 文件：

```env
GEMINI_API_KEY=your_api_key_here
```

### 5. 启动应用

**方式一：同时启动前端和服务器**
```powershell
# 需要打开两个终端窗口

# 终端 1: 启动前端 (http://localhost:3000)
npm run dev

# 终端 2: 启动词典服务器 (端口 3006)
cd server
node index.js
```

**方式二：一键启动（推荐）**
```powershell
npm run dev:both
```

### 6. 访问应用

打开浏览器访问：http://localhost:3000

---

## 🍎 macOS 安装指南

### 1. 安装 Node.js

**方式一：通过 Homebrew（推荐）**
```bash
brew install node@20
```

**方式二：通过安装包**
访问 [Node.js 官网](https://nodejs.org/) 下载 LTS 版本。

验证安装：
```bash
node -v
npm -v
```

### 2. 克隆项目

```bash
git clone https://github.com/HashBrowns-fries/Lumina.git
cd Lumina
```

### 3. 安装依赖

```bash
# 安装前端依赖
npm install

# 安装词典服务器依赖
cd server
npm install
cd ..
```

### 4. 配置环境变量（可选）

```bash
# 创建环境变量文件
touch .env.local
```

编辑 `.env.local`：
```env
GEMINI_API_KEY=your_api_key_here
```

### 5. 启动应用

**方式一：分终端启动**

```bash
# 终端 1: 启动前端
npm run dev

# 终端 2: 启动词典服务器
cd server
node index.js
```

**方式二：一键启动（推荐）**
```bash
npm run dev:both
```

### 6. 访问应用

打开浏览器访问：http://localhost:3000

---

## 📦 词典数据准备

本应用需要词典数据库文件才能正常工作。请按照以下步骤准备：

### 1. 下载词典数据

从 [kaikki.org](https://kaikki.org/) 下载 Wiktionary 导出文件：
（例子）
| 语言 | 下载链接 | 解释语言 |
|------|----------|----------|
| 德语 | https://kaikki.org/dictionary/German/ | 英语 |
| 德语 | [https://kaikki.org/zhwiktionary/ ](https://kaikki.org/zhwiktionary/%E5%BE%B7%E8%AF%AD/index.html)| 中文 |

点击页面中的 "Download" 获取 JSONL 格式数据文件。

### 2. 转换数据为 SQLite 数据库

运行项目中的转换脚本：

```bash
# 进入脚本目录
cd scripts

# 安装 Python 依赖
pip install -r requirements.txt

# 运行转换脚本（将 JSONL 转换为 SQLite 数据库）
# 格式: python convert_jsonl_to_sqlite.py <jsonl文件> <语言名称>
python convert_jsonl_to_sqlite.py kaikki.org-dictionary-German.jsonl German

# 提取测试数据（可选，用于开发测试）
python extract-test-data.py
```

### 3. 验证数据库文件

转换脚本会自动在 `dict/{语言名称}/` 目录下生成数据库文件。例如德语数据库路径为：

```
dict/German/german_dict.db
```

确保该文件存在且可读。

### 4. 验证安装

启动应用后，词典服务器会自动连接数据库。可以在浏览器控制台查看连接状态。

---

## 📖 使用指南


### 基本工作流程

1. **阅读文本**
   - 粘贴或输入文本到阅读器
   - 点击任意单词查看详细分析

2. **词典功能**
   - 侧边栏显示单词的**所有相关形式**（编号显示）
   - **变体形式**（如"bequem"作为"bequemen"的命令式）
   - **词根形式**（如"bequemen"）

3. **保存词汇**
   - 设置学习等级（1-5或忽略）
   - 自动检测词根并保存
   - 变体形式自动链接到词根

4. **复习系统**
   - 根据SRS算法定时复习
   - 跟踪记忆强度和进度
   - 可视化学习统计

### 词典功能详解

#### 🎯 智能词条显示
```
示例："bequem" 显示为：
1. bequem (verb · imperative)
   → Root form: bequemen
   
2. bequem (adjective)
   comfortable, convenient; relaxed, easy
   
3. bequemen (verb · root)
   ↳ Variant: bequem
   to decide to something, with displeasure
```

#### 🔍 词形变化检测
- **自动检测**："nahm" → 自动识别为"nehmen"的过去式
- **智能切换**：文本字段自动设为词根形式，带"Auto-detected"标签
- **用户覆盖**：可手动编辑检测到的词根形式

#### 🎚️ 过滤功能
- **按词性过滤**：All / Verbs / Nouns / Adjectives / Adverbs / Other
- **实时统计**："Showing X of Y entries"
- **颜色编码**：不同词性使用不同颜色

## 🛠️ 开发指南

### 项目结构
```
lumina/
├── components/          # React组件
│   ├── TermSidebar.tsx  # 词典侧边栏（核心）
│   ├── Reader.tsx       # 阅读器组件
│   └── ...             # 其他组件
├── server/             # 词典服务器
│   ├── dictionaryService.js  # 词典查询引擎
│   └── index.js        # Express API服务器
├── services/           # 前端服务层
│   ├── wiktionaryService.ts   # 词典API接口
│   ├── llmService.ts  # AI服务
│   └── ...            # 其他服务
├── dict/              # 词典数据库
│   └── German/german_dict.db  # SQLite词典
└── ...               # 配置文件
```

### 核心组件说明

#### `TermSidebar.tsx`
词典侧边栏的主要组件，负责：
- 显示多词条词典数据
- 处理词形变化检测
- 管理过滤和排序
- 用户交互和保存逻辑

#### `dictionaryService.js`
后端词典服务的核心，提供：
- 多词条查询和去重
- 词形变化分析和分类
- 智能排序（变体→词根→普通）
- 缓存和性能优化

#### `wiktionaryService.ts`
前端词典服务接口，提供：
- 统一的后端API调用
- 响应格式标准化
- 错误处理和降级

### API接口

#### 词典查询
```
GET /api/dictionary/query/:languageCode/:word
示例：GET /api/dictionary/query/de/bequem

响应格式：
{
  "success": true,
  "entries": [
    {
      "word": "bequem",
      "partOfSpeech": "verb",
      "entryType": "variant",
      "rootWord": "bequemen",
      "definitions": [...]
    },
    // 更多条目...
  ]
}
```

## 📊 技术特色

### 词条分类系统
1. **`variant`（变体）**：词形变化形式
   - `isInflection: true`
   - `rootWord` 指向原形
   - 示例："bequem"（命令式）

2. **`root`（词根）**：词典原形，有关联变体
   - `hasInflections: true`
   - `variantOf` 指向查询的变体
   - 示例："bequemen"

3. **`normal`（普通）**：标准词典条目
   - 可能有 `selfInflectionAnalysis`
   - 示例："gut"（形容词）

### 排序算法
```typescript
// 排序优先级：变体 → 词根 → 普通
const typeOrder = { 'variant': 1, 'root': 2, 'normal': 3 };
entries.sort((a, b) => typeOrder[a.entryType] - typeOrder[b.entryType]);
```

## 🔧 故障排除

### Windows

1. **端口被占用**
   ```powershell
   # 查看端口 3006 是否被占用
    netstat -ano | findstr ":3006"
   
   # 结束占用进程
   taskkill /PID <进程ID> /F
   ```

2. **Node.js 版本问题**
   ```powershell
   # 使用 nvm-windows 管理 Node.js 版本
   # 下载: https://github.com/coreybutler/nvm-windows
   nvm install 20
   nvm use 20
   ```

3. **权限错误**
   - 以管理员身份运行 PowerShell
   - 或使用 `Set-ExecutionPolicy RemoteSigned`

### macOS

1. **端口被占用**
   ```bash
   # 查看端口 3006 是否被占用
    lsof -i :3006
   
   # 结束占用进程
   kill -9 <进程ID>
   ```

2. **Node.js 版本问题**
   ```bash
   # 使用 nvm 管理 Node.js 版本
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   nvm install 20
   nvm use 20
   ```

3. **权限错误**
   ```bash
   # 如果遇到 EACCES 错误
   sudo chown -R $(whoami) ~/.npm
   ```

### 通用问题

1. **AI 功能不可用**
   - 检查 `.env.local` 中的 `GEMINI_API_KEY`
   - 确认网络连接
   - 查看浏览器控制台错误

2. **词典服务器无法启动**
    - 检查端口 3006 是否被占用
   - 确认 SQLite 数据库文件存在
   - 查看服务器日志

3. **构建失败**
   ```bash
   # 清理缓存后重试
   rm -rf node_modules
   npm install
   ```

## 📈 性能优化

### 已完成优化
- ✅ **查询缓存**：高频单词的本地缓存
- ✅ **去重算法**：防止重复条目显示
- ✅ **懒加载**：按需加载词典数据
- ✅ **智能排序**：优先显示最相关条目

## 🤝 贡献指南

欢迎贡献！请遵循以下步骤：

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 开发规范
- 使用 TypeScript 严格模式
- 遵循现有代码风格
- 添加适当的注释
- 更新相关文档

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- **词典数据**：基于开源词典项目https://kaikki.org/ by https://ylonen.org/
- **AI提供商**：Google Gemini, DeepSeek
- **开源社区**：React, TypeScript, Vite 等

## 📞 支持与反馈

如有问题或建议，请：
1. 查看 [Issues](https://github.com/your-repo/issues)
2. 提交详细的问题描述
3. 附上相关截图或日志

---

**Lumina** - 让语言学习更智能、更高效 ✨

## 🖥️ 桌面应用 (Tauri)

Lumina 可以使用 Tauri 构建为跨平台桌面应用，支持 Windows、macOS 和 Linux。

### ✨ 桌面应用优势

- **独立运行**：无需浏览器，直接启动应用
- **离线使用**：词典数据本地存储，支持离线查询
- **系统集成**：支持系统托盘、快捷键、通知
- **性能更好**：原生渲染，更流畅的体验
- **后台运行**：词典服务器内置，无需额外启动

### 🛠️ 环境要求

#### 1. 安装 Rust
Tauri 基于 Rust 构建，需要先安装 Rust 工具链：

**Windows:**
```powershell
# 下载并运行 rustup-init.exe
# 访问: https://www.rust-lang.org/tools/install
# 或使用 winget:
winget install Rustlang.Rustup
```

**macOS:**
```bash
# 方式一：通过 Homebrew（推荐）
brew install rust

# 方式二：官方安装脚本
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

**Linux:**
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

安装完成后重启终端，验证安装：
```bash
rustc --version
cargo --version
```

#### 2. 系统依赖
- **Windows**: 需要 Visual Studio Build Tools 或 Microsoft C++ Build Tools
- **macOS**: 需要 Xcode Command Line Tools (`xcode-select --install`)
- **Linux**: 需要基础开发工具 (gcc, pkg-config, libgtk-3-dev, libwebkit2gtk-4.1-dev 等)

#### 3. 安装 Node.js 和项目依赖
确保 Node.js 18+ 已安装，然后：
```bash
npm install
```

### 📦 安装与使用

#### Windows 安装

**方式一：使用安装包（推荐）**
1. 下载最新的安装包：
   - MSI: `src-tauri/target/release/bundle/msi/Lumina_1.x.x_x64_en-US.msi`
   - NSIS: `src-tauri/target/release/bundle/nssi/Lumina_1.x.x_x64-setup.exe`
2. 双击安装包，按提示完成安装
3. 从开始菜单或桌面快捷方式启动

**方式二：直接运行 EXE**
1. 下载 `lumina.exe` 文件
2. 双击运行（首次运行可能需要几秒钟初始化）
3. 应用会自动启动词典服务器

**方式三：手动构建**
```bash
npm run build:tauri
# 生成的 EXE 位于: src-tauri/target/release/lumina.exe
```

#### macOS 安装

**前提条件**
1. 安装 Rust: `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
2. 安装 Xcode Command Line Tools: `xcode-select --install`
3. 安装 Homebrew（如果没有）: `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`

**构建步骤**
```bash
# 1. 安装依赖
npm install

# 2. 构建桌面应用
npm run build:tauri

# 3. 查找生成的.app文件
ls -la src-tauri/target/release/bundle/
```

**运行应用**
```bash
# 方式一：直接运行构建的.app
open src-tauri/target/release/bundle/macos/Lumina.app

# 方式二：复制到Applications
cp -r src-tauri/target/release/bundle/macos/Lumina.app /Applications/

# 方式三：运行可执行文件
./src-tauri/target/release/lumina
```

**注意**: macOS 构建需要在 macOS 环境下进行。Windows/Linux 用户如需 macOS 版本，可以：
1. 在 macOS 机器上构建
2. 使用 GitHub Actions 进行跨平台构建

#### Linux 安装

```bash
# 安装系统依赖（Debian/Ubuntu）
sudo apt install libgtk-3-dev libwebkit2gtk-4.1-dev build-essential curl wget file

# 构建应用
npm run build:tauri

# 运行
./src-tauri/target/release/lumina
```

### 🚀 开发运行

```bash
npm run dev:tauri
```

此命令会启动：
- **Tauri 桌面应用**: 独立窗口
- **前端开发服务器**: http://localhost:3000
- **词典服务器**: http://localhost:3006

### 📁 文件结构

```
src-tauri/
├── src/
│   └── main.rs          # Rust 入口点
├── Cargo.toml           # Rust 依赖配置
├── tauri.conf.json      # Tauri 应用配置
├── icons/               # 应用图标
│   └── icon.ico        # Windows 图标
└── target/              # 构建输出
    ├── debug/          # 调试版本
    └── release/        # 发布版本
        ├── lumina.exe           # Windows 可执行文件
        └── bundle/
            ├── msi/            # MSI 安装包
            ├── nsis/           # NSIS 安装包
            └── macos/          # macOS 应用包
```

### ⚙️ 配置说明

#### 端口配置
- **前端**: 3000 端口 (Vite)
- **词典服务器**: 3006 端口 (Express)
- **Tauri**: 自动检测可用端口

#### 数据目录
桌面应用的数据存储位置：
- **Windows**: `%APPDATA%\com.lumina.app\`
- **macOS**: `~/Library/Application Support/com.lumina.app/`
- **Linux**: `~/.config/com.lumina.app/`

### 🔧 故障排除

#### Windows

1. **缺少 WebView2**
   - Windows 需要 WebView2 Runtime
   - 下载：https://developer.microsoft.com/en-us/microsoft-edge/webview2/
   - 大多数 Windows 11 用户已预装

2. **Rust 安装失败**
   ```bash
   rustup self uninstall
   # 重新安装
   ```

3. **构建错误**
   ```powershell
   # 确保 Visual Studio Build Tools 已安装
   # 或安装 Microsoft C++ Build Tools
   ```

#### macOS

1. **权限问题**
   ```bash
   # 首次运行可能需要授权
   sudo xattr -rd com.apple.quarantine /Applications/Lumina.app
   ```

2. **无法打开应用**
   - 前往 "系统设置" > "隐私与安全性" > 允许应用运行

3. **构建失败**
   ```bash
   # 确保 Xcode Command Line Tools 已安装
   xcode-select --install
   
   # 确保 Rust 已正确安装
   source ~/.cargo/env
   ```

#### Linux

1. **缺少依赖**
   ```bash
   # Debian/Ubuntu
   sudo apt install libgtk-3-dev libwebkit2gtk-4.1-dev build-essential
   
   # Fedora
   sudo dnf install gtk3-devel webkit2gtk4.1-devel cargo
   
   # Arch
   sudo pacman -S gtk3 webkit2gtk-4.1 base-devel
   ```

### 🔄 更新应用

```bash
# 更新前端依赖
npm update

# 更新 Tauri
npm update @tauri-apps/cli @tauri-apps/api

# 重新构建
npm run build:tauri
```

### 📝 开发提示

1. **热重载**: 前端代码修改会自动热重载，Rust 代码修改需要重启应用
2. **开发者工具**: 桌面应用中按 `F12`（Windows）或 `Cmd+Option+I`（macOS）打开开发者工具
3. **日志查看**: 控制台输出显示在终端中
4. **环境变量**: 桌面应用可以读取系统环境变量

---

**💡 提示**: 桌面应用版本提供更好的性能、离线支持和系统集成，推荐用于日常使用。
