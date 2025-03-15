// 情绪趋势图模块

// 情绪映射到数值
const emotionValues = {
    '开心': 5,
    '平静': 3,
    '下雨': 2,
    '伤心': 1,
    '生气': -0.00000001
};

// 情绪映射到颜色
const emotionColors = {
    '开心': '#34c759',
    '平静': '#007aff',
    '生气': '#ff3b30',
    '伤心': '#5856d6',
    '下雨': '#8e8e93'
};

// 创建情绪趋势折线图
export function createEmotionChart(emotionData) {
    // 如果没有情绪数据，返回提示信息
    if (!emotionData || emotionData.length === 0) {
        return '<div class="chart-placeholder">没有情绪数据可供分析</div>';
    }

    // 准备数据
    const labels = [];
    const values = [];
    const colors = [];
    
    emotionData.forEach((data, index) => {
        const emotion = data.emotion;
        labels.push(""); // 移除 #1, #2 等序号标签
        values.push(emotionValues[emotion] || 3); // 默认为平静(3)
        colors.push(emotionColors[emotion] || '#8e8e93');
    });

    // 创建画布元素
    const canvasId = 'emotion-trend-chart';
    const chartHtml = `
        <canvas id="${canvasId}" width="100%" height="100%"></canvas>
        <div class="emotion-legend">
            <div class="legend-item"><span class="legend-color" style="background-color: #34c759;"></span>开心</div>
            <div class="legend-item"><span class="legend-color" style="background-color: #007aff;"></span>平静</div>
            <div class="legend-item"><span class="legend-color" style="background-color: #8e8e93;"></span>下雨</div>
            <div class="legend-item"><span class="legend-color" style="background-color: #5856d6;"></span>伤心</div>
            <div class="legend-item"><span class="legend-color" style="background-color: #ff3b30;"></span>生气</div>
        </div>
    `;

    // 在下一个事件循环中初始化图表
    setTimeout(() => {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        // 创建渐变背景
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, 'rgba(52, 199, 89, 0.2)');
        gradient.addColorStop(1, 'rgba(88, 86, 214, 0.1)');

        // 创建图表
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: '情绪趋势',
                    data: values,
                    borderColor: '#007aff',
                    backgroundColor: gradient,
                    borderWidth: 2,
                    pointBackgroundColor: colors,
                    pointBorderColor: '#ffffff',
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const index = context.dataIndex;
                                const emotion = emotionData[index].emotion;
                                return `情绪: ${emotion}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        min: 0,
                        max: 5,
                        ticks: {
                            stepSize: 1,
                            callback: function(value) {
                                switch(value) {
                                    case 5: return '开心';
                                    case 4: return '';
                                    case 3: return '平静';
                                    case 2: return '下雨';
                                    case 1: return '伤心';
                                    case 0: return '生气';
                                    default: return '';
                                }
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    }
                }
            }
        });
    }, 0);

    return chartHtml;
}