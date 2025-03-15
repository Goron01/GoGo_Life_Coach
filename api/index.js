// 导入所需模块
require('dotenv').config(); // 加载环境变量
const axios = require('axios');

// 从环境变量中读取API密钥和API URL
const API_KEY = process.env.API_KEY;
const API_URL = process.env.API_URL;

// 处理聊天请求的函数
async function chatAPI(messages) {
    try {
        // 调用deepseek-r1 API
        const response = await axios.post(
            API_URL,
            {
                model: 'deepseek-r1',
                messages: messages
            },
            {
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        // 提取AI回复
        const aiMessage = response.data.choices[0].message.content;
        return { message: aiMessage };
    } catch (error) {
        console.error('API调用错误:', error.response ? error.response.data : error.message);
        throw error;
    }
}

module.exports = {
    chatAPI
};