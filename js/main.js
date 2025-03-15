// 获取DOM元素
const messagesContainer = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-btn');
const clearButton = document.getElementById('clear-btn');
const loadingIndicator = document.getElementById('loading');
const historyList = document.getElementById('history-list');
const historySearch = document.getElementById('history-search');
const emotionIcons = document.querySelectorAll('.emotion-icon');
const startAnalysisBtn = document.getElementById('start-analysis-btn');
const emotionChart = document.getElementById('emotion-chart');
const emotionAnalysis = document.getElementById('emotion-analysis');
const aiInsight = document.getElementById('ai-insight');
const newBtn = document.getElementById('new-btn');
const exitBtn = document.getElementById('exit-btn');

// 初始化变量
let conversationHistory = [
    {
        role: "assistant",
        content: "你好！我是你的Life Coach助手。我可以帮助你解决生活中的问题，提供建议，促进你的个人成长。请告诉我你想聊些什么？"
    }
];

// 导入API模块
import { sendChatMessage, checkApiConnection } from './api.js';
// 导入情绪趋势图模块
import { createEmotionChart } from './emotion-chart.js';

// 发送消息函数
async function sendMessage() {
    const userMessage = messageInput.value.trim();
    
    // 检查消息是否为空
    if (userMessage === '') return;
    
    // 清空输入框
    messageInput.value = '';
    
    // 添加用户消息到聊天窗口
    addMessageToChat('user', userMessage);
    
    // 更新对话历史
    conversationHistory.push({
        role: "user",
        content: userMessage
    });
    
    // 显示加载指示器
    loadingIndicator.style.display = 'block';
    
    try {
        // 使用API模块发送请求
        const data = await sendChatMessage(conversationHistory);
        
        // 隐藏加载指示器
        loadingIndicator.style.display = 'none';
        
        if (data.message) {
            // 添加AI回复到聊天窗口
            addMessageToChat('ai', data.message);
            
            // 更新对话历史
            conversationHistory.push({
                role: "assistant",
                content: data.message
            });
        } else {
            // 处理错误
            addMessageToChat('ai', '抱歉，我遇到了一些问题。请稍后再试。');
        }
    } catch (error) {
        console.error('API调用错误:', error);
        // 隐藏加载指示器
        loadingIndicator.style.display = 'none';
        // 显示错误消息
        addMessageToChat('ai', '抱歉，连接服务器时出现问题。请检查网络连接或稍后再试。');
    }
    
    // 滚动到最新消息
    scrollToBottom();
}

// 添加消息到聊天窗口
function addMessageToChat(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.classList.add(sender === 'user' ? 'user-message' : 'ai-message');
    
    // 处理消息中的情绪标记
    if (sender === 'user' && message.includes('[当前心情:')) {
        const parts = message.split('\n[当前心情:');
        messageElement.textContent = parts[0];
    } else {
        messageElement.textContent = message;
    }
    
    messagesContainer.appendChild(messageElement);
    
    // 滚动到最新消息
    scrollToBottom();
}

// 滚动到聊天窗口底部
function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// 清空聊天记录
function clearChat() {
    // 保留第一条AI欢迎消息
    while (messagesContainer.childNodes.length > 1) {
        messagesContainer.removeChild(messagesContainer.lastChild);
    }
    
    // 重置对话历史
    conversationHistory = [
        {
            role: "assistant",
            content: "你好！我是你的Life Coach助手。我可以帮助你解决生活中的问题，提供建议，促进你的个人成长。请告诉我你想聊些什么？"
        }
    ];
    
    // 重置情绪数据
    emotionData = [];
    
    // 重置情绪图标
    emotionIcons.forEach(icon => icon.classList.remove('active'));
    currentEmotion = '';
    
    // 更新当前对话
    updateCurrentConversation();
    
    // 清空情绪分析区域
    emotionChart.innerHTML = '<div class="chart-placeholder">随着对话进行，这里将显示情绪变化趋势</div>';
    emotionAnalysis.innerHTML = '<div class="analysis-item"><div class="analysis-label">点击"开始分析"按钮开始分析对话</div></div>';
    aiInsight.innerHTML = '<div class="insight-placeholder">点击"开始分析"按钮获取AI洞察</div>';
}

// 更新情绪数据
function updateEmotionData(emotion) {
    emotionData.push({
        emotion: emotion,
        timestamp: new Date().toISOString()
    });
}

// 更新当前对话
function updateCurrentConversation() {
    // 更新当前对话的消息
    conversations[0].messages = [...conversationHistory];
    conversations[0].time = '刚刚';
}

// 开始新对话
function startNewConversation() {
    // 保存当前对话到历史记录
    if (conversationHistory.length > 1) {
        const currentTime = new Date();
        const timeString = `${currentTime.getHours()}:${String(currentTime.getMinutes()).padStart(2, '0')}`;
        
        // 从对话中提取标题
        let title = '新对话';
        if (conversationHistory.length > 1 && conversationHistory[1].role === 'user') {
            title = conversationHistory[1].content.substring(0, 20) + (conversationHistory[1].content.length > 20 ? '...' : '');
        }
        
        // 创建新的历史记录
        const newHistory = {
            id: 'conv_' + Date.now(),
            title: title,
            time: timeString,
            messages: [...conversationHistory]
        };
        
        // 添加到历史记录列表
        conversations.unshift(newHistory);
        
        // 只保留最近的10个对话
        if (conversations.length > 10) {
            conversations.pop();
        }
        
        // 更新历史列表UI
        updateHistoryList();
    }
    
    // 清空当前对话
    clearChat();
}

// 更新历史列表UI
function updateHistoryList() {
    // 清空历史列表
    historyList.innerHTML = '';
    
    // 添加历史项
    conversations.forEach((conv, index) => {
        const historyItem = document.createElement('div');
        historyItem.classList.add('history-item');
        if (index === 0) historyItem.classList.add('active');
        
        historyItem.innerHTML = `
            <div class="history-title">${conv.title}</div>
            <div class="history-time">${conv.time}</div>
        `;
        
        // 添加点击事件
        historyItem.addEventListener('click', () => {
            // 切换active类
            document.querySelectorAll('.history-item').forEach(item => item.classList.remove('active'));
            historyItem.classList.add('active');
            
            // 加载对话
            loadConversation(conv);
        });
        
        historyList.appendChild(historyItem);
    });
}

// 加载对话
function loadConversation(conversation) {
    // 清空当前消息区域
    messagesContainer.innerHTML = '';
    
    // 设置对话历史
    conversationHistory = [...conversation.messages];
    
    // 显示消息
    conversationHistory.forEach(msg => {
        if (msg.role === 'assistant') {
            addMessageToChat('ai', msg.content);
        } else if (msg.role === 'user') {
            addMessageToChat('user', msg.content);
        }
    });
    
    // 重置情绪数据和UI
    emotionData = [];
    emotionIcons.forEach(icon => icon.classList.remove('active'));
    currentEmotion = '';
    
    // 清空情绪分析区域
    emotionChart.innerHTML = '<div class="chart-placeholder">随着对话进行，这里将显示情绪变化趋势</div>';
    emotionAnalysis.innerHTML = '<div class="analysis-item"><div class="analysis-label">点击"开始分析"按钮开始分析对话</div></div>';
    aiInsight.innerHTML = '<div class="insight-placeholder">点击"开始分析"按钮获取AI洞察</div>';
}

// 搜索历史对话
function searchHistory() {
    const searchTerm = historySearch.value.toLowerCase();
    
    // 如果搜索词为空，显示所有历史
    if (searchTerm === '') {
        updateHistoryList();
        return;
    }
    
    // 过滤历史对话
    const filteredConversations = conversations.filter(conv => 
        conv.title.toLowerCase().includes(searchTerm)
    );
    
    // 更新UI
    historyList.innerHTML = '';
    
    if (filteredConversations.length === 0) {
        historyList.innerHTML = '<div class="history-empty">没有找到匹配的对话</div>';
        return;
    }
    
    // 添加过滤后的历史项
    filteredConversations.forEach((conv, index) => {
        const historyItem = document.createElement('div');
        historyItem.classList.add('history-item');
        if (conv.id === 'current') historyItem.classList.add('active');
        
        historyItem.innerHTML = `
            <div class="history-title">${conv.title}</div>
            <div class="history-time">${conv.time}</div>
        `;
        
        // 添加点击事件
        historyItem.addEventListener('click', () => {
            // 切换active类
            document.querySelectorAll('.history-item').forEach(item => item.classList.remove('active'));
            historyItem.classList.add('active');
            
            // 加载对话
            loadConversation(conv);
        });
        
        historyList.appendChild(historyItem);
    });
}

// 分析对话
function analyzeConversation() {
    // 如果没有足够的对话，显示提示
    if (conversationHistory.length < 3) {
        alert('需要更多的对话才能进行分析。请继续聊天后再试。');
        return;
    }
    
    // 显示加载状态
    emotionAnalysis.innerHTML = '<div class="analysis-loading">正在分析...</div>';
    aiInsight.innerHTML = '<div class="analysis-loading">正在生成洞察...</div>';
    
    // 生成情绪趋势图
    generateEmotionChart();
    
    // 分析情绪变化
    analyzeEmotionChanges();
    
    // 生成AI洞察
    generateAIInsight();
}

// 生成情绪趋势图
function generateEmotionChart() {
    // 使用情绪趋势图模块生成折线图
    const chartHTML = createEmotionChart(emotionData);
    emotionChart.innerHTML = chartHTML;
}


// 分析情绪变化
function analyzeEmotionChanges() {
    // 如果没有情绪数据，显示提示
    if (emotionData.length === 0) {
        emotionAnalysis.innerHTML = '<div class="analysis-item"><div class="analysis-label">没有情绪数据可供分析</div></div>';
        return;
    }
    
    // 计算情绪统计
    const emotionCounts = {};
    emotionData.forEach(data => {
        const emotion = data.emotion;
        emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
    });
    
    // 找出主要情绪
    let mainEmotion = '';
    let maxCount = 0;
    
    for (const emotion in emotionCounts) {
        if (emotionCounts[emotion] > maxCount) {
            maxCount = emotionCounts[emotion];
            mainEmotion = emotion;
        }
    }
    
    // 生成分析HTML
    let analysisHTML = '';
    
    if (mainEmotion) {
        analysisHTML += `<div class="analysis-item"><div class="analysis-label">主要情绪:</div><div class="analysis-value">${mainEmotion}</div></div>`;
    }
    
    // 添加情绪分布
    analysisHTML += '<div class="analysis-item"><div class="analysis-label">情绪分布:</div>';
    analysisHTML += '<div class="emotion-distribution">';
    
    // 情绪对应的表情图标
    const emotionIcons = {
        '开心': '😊',
        '平静': '😐',
        '生气': '😠',
        '伤心': '😢',
        '下雨': '🌧️'
    };
    
    // 生成情绪分布图标
    for (const emotion in emotionCounts) {
        const percentage = Math.round((emotionCounts[emotion] / emotionData.length) * 100);
        const icon = emotionIcons[emotion] || '❓';
        analysisHTML += `<div class="emotion-dist-item">
            <div class="emotion-dist-icon" title="${emotion}">${icon}</div>
            <div class="emotion-dist-percentage">${percentage}%</div>
        </div>`;
    }
    
    analysisHTML += '</div></div>';
    
    // 检测情绪变化
    if (emotionData.length > 1) {
        const firstEmotion = emotionData[0].emotion;
        const lastEmotion = emotionData[emotionData.length - 1].emotion;
        
        if (firstEmotion !== lastEmotion) {
            analysisHTML += `<div class="analysis-item"><div class="analysis-label">情绪变化:</div><div class="analysis-value">从 ${firstEmotion} 变为 ${lastEmotion}</div></div>`;
        }
    }
    
    emotionAnalysis.innerHTML = analysisHTML;
}

// 生成AI洞察
function generateAIInsight() {
    // 简单的AI洞察示例
    let insightHTML = '';
    
    // 基于对话历史和情绪数据生成洞察
    if (conversationHistory.length > 2) {
        insightHTML += '<div class="insight-content">';
        
        // 根据情绪数据生成不同的洞察
        if (emotionData.length > 0) {
            const lastEmotion = emotionData[emotionData.length - 1].emotion;
            
            switch (lastEmotion) {
                case '开心':
                    insightHTML += '你的对话显示积极的情绪，继续保持这种乐观的态度对个人成长很有帮助。';
                    break;
                case '平静':
                    insightHTML += '你保持着平静的心态，这有助于理性思考和做出更好的决策。';
                    break;
                case '生气':
                    insightHTML += '对话中显示有一些负面情绪，尝试深呼吸和换个角度思考问题可能会有所帮助。';
                    break;
                case '伤心':
                    insightHTML += '感到悲伤是正常的，允许自己感受这些情绪，同时寻找支持和积极的方面也很重要。';
                    break;
                case '下雨':
                    insightHTML += '你似乎感到有些低落，就像雨天一样。记住，雨后总会有彩虹，这些情绪也会过去。';
                    break;
                default:
                    insightHTML += '通过对话，我们可以看到情绪的变化是自然的，接受并理解这些变化有助于个人成长。';
            }
        } else {
            insightHTML += '通过更多的对话和分享你的情绪，AI可以提供更个性化的洞察和建议。';
        }
        
        insightHTML += '</div>';
    } else {
        insightHTML = '<div class="insight-placeholder">需要更多的对话才能生成洞察</div>';
    }
    
    aiInsight.innerHTML = insightHTML;
}

// 初始化变量
let currentEmotion = '';
let emotionData = [];
let conversations = [
    {
        id: 'current',
        title: '当前的对话',
        time: '刚刚',
        messages: [...conversationHistory]
    }
];

// 事件监听器
document.addEventListener('DOMContentLoaded', () => {
    // 发送按钮点击事件
    sendButton.addEventListener('click', sendMessage);
    
    // 输入框回车事件
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // 清空按钮点击事件
    clearButton.addEventListener('click', clearChat);
    
    // 情绪图标点击事件
    emotionIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            // 移除其他图标的active类
            emotionIcons.forEach(i => i.classList.remove('active'));
            
            // 添加active类到当前图标
            icon.classList.add('active');
            
            // 更新当前情绪
            currentEmotion = icon.getAttribute('data-emotion');
            
            // 记录情绪数据
            updateEmotionData(currentEmotion);
            
            // 更新情绪图表和分析
            generateEmotionChart();
            analyzeEmotionChanges();
        });
    });
    
    // 开始分析按钮点击事件
    startAnalysisBtn.addEventListener('click', analyzeConversation);
    
    // 历史搜索输入事件
    historySearch.addEventListener('input', searchHistory);
    
    // 新对话按钮点击事件
    newBtn.addEventListener('click', startNewConversation);
    
    // 退出按钮点击事件
    exitBtn.addEventListener('click', () => {
        if (confirm('确定要退出当前对话吗？')) {
            window.location.href = '/';
        }
    });
});