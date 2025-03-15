// API调用封装模块

// 服务器基础URL - 自动适应当前环境
const API_BASE_URL = window.location.origin;

/**
 * 发送聊天消息到服务器
 * @param {Array} messages - 对话历史消息数组
 * @returns {Promise} - 返回服务器响应
 */
async function sendChatMessage(messages) {
    try {
        const response = await fetch(`${API_BASE_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ messages: messages })
        });
        
        if (!response.ok) {
            throw new Error(`服务器响应错误: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API调用错误:', error);
        throw error;
    }
}

/**
 * 检查API服务器连接状态
 * @returns {Promise<boolean>} - 返回连接状态
 */
async function checkApiConnection() {
    try {
        const response = await fetch(`${API_BASE_URL}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        return response.ok;
    } catch (error) {
        console.error('API连接检查失败:', error);
        return false;
    }
}

// 导出API函数
export { sendChatMessage, checkApiConnection };