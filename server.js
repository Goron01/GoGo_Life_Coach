// 导入所需模块
require('dotenv').config(); // 加载环境变量
const express = require('express');
const cors = require('cors');
const path = require('path');
const { chatAPI } = require('./api');
const app = express();
const PORT = process.env.PORT || 2046; // 从环境变量中读取端口号

// 配置中间件
app.use(cors()); // 解决跨域问题
app.use(express.json()); // 解析JSON请求体

// 提供静态文件服务
app.use(express.static(path.join(__dirname, '/')));

// 处理聊天请求的路由
app.post('/chat', async (req, res) => {
    try {
        // 从请求中获取消息历史
        const { messages } = req.body;
        
        // 调用API模块处理聊天请求
        const result = await chatAPI(messages);
        
        // 返回AI回复给前端
        res.json(result);
    } catch (error) {
        console.error('API调用错误:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: '服务器错误，请稍后再试' });
    }
});

// 添加根路由
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
    console.log('使用Ctrl+C停止服务器');
});