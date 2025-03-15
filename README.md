# GoGo_Life_Coach
 个人成长助手

![版本](https://img.shields.io/badge/版本-1.0.0-blue.svg)
![许可证](https://img.shields.io/badge/许可证-ISC-green.svg)

## 项目简介

GoGo Life Coach 是一个基于 LLM大模型 API 的网页应用，旨在创建一个个人生活教练助手，通过 AI 对话为用户提供生活建议和成长指导。应用支持情绪分析和历史对话管理，帮助用户追踪自己的情绪变化和成长历程。

![屏幕截图 2025-03-15 102431](https://github.com/user-attachments/assets/29cd9b48-bc92-4dd0-9a61-dde454981ce7)


## 功能特点

- **智能对话**：基于 LLM大模型 大语言模型的智能对话系统，提供个性化的生活建议和成长指导
- **情绪分析**：支持用户选择当前情绪，并通过图表可视化展示情绪变化趋势
- **历史对话**：保存历史对话记录，方便用户回顾和继续之前的对话
- **对话搜索**：支持在历史对话中搜索关键词，快速找到相关内容
- **响应式设计**：适配不同设备屏幕，提供良好的用户体验



## 技术栈

### 前端
- HTML5 + CSS3：构建响应式用户界面
- JavaScript (ES6+)：实现交互逻辑
- Chart.js：绘制情绪变化趋势图

### 后端
- Node.js：服务器环境
- Express：Web 服务器框架
- Axios：HTTP 客户端，用于调用 deepseek-r1 API

## 安装步骤

### 前提条件
- 安装 [Node.js](https://nodejs.org/) (v14.0.0 或更高版本)
- 获取 deepseek-r1 API 密钥

### 安装过程

1. 克隆仓库
```bash
git clone https://github.com/Goron01/GoGo_Life_Coach.git
cd GoGo_Life_Coach
```

2. 安装依赖
```bash
npm install
```

3. 配置 API 密钥
   - 打开 `.env` 文件
   - 将 `API_KEY=` 后面添加你的 API 密钥，如sk-*********
   - `API_URL=` 后面添加服务商API端口，如https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions（阿里云）

4. 启动应用
```bash
npm start
```
或者直接运行批处理文件：
```bash
run.bat
```

5. 在浏览器中访问应用
```
http://localhost:2046
```


### 感谢打赏
<img src="https://github.com/user-attachments/assets/9608aded-341b-427c-97e7-678d1e68c101" 
     alt="wechat" 
     width="300" 
     style="display: block; margin: 0 auto;">
