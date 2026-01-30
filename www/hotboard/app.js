/**
 * 热榜查询前端应用脚本
 */

// 全局变量
let currentPlatform = null;
let platformsData = null;

// DOM 元素
const elements = {
    platformCategories: document.querySelector('.platform-categories'),
    hotboardList: document.getElementById('hotboardList'),
    loading: document.getElementById('loading'),
    emptyState: document.getElementById('emptyState'),
    resultTitle: document.getElementById('resultTitle'),
    updateTime: document.getElementById('updateTime'),
    refreshBtn: document.getElementById('refreshBtn')
};

// 初始化应用
async function initApp() {
    try {
        // 加载平台列表
        await loadPlatforms();
        
        // 初始化事件监听器
        initEventListeners();
        
        // 显示空状态
        showEmptyState();
    } catch (error) {
        console.error('初始化失败:', error);
    }
}

// 加载平台列表
async function loadPlatforms() {
    try {
        // 这里直接使用静态数据，也可以从 API 获取
        platformsData = {
            categories: {
                '视频/社区': ['bilibili', 'acfun', 'weibo', 'zhihu', 'douyin', 'kuaishou', 'douban-movie', 'tieba', 'hupu', 'v2ex'],
                '新闻/资讯': ['baidu', 'thepaper', 'toutiao', 'qq-news', 'sina', 'netease-news', 'huxiu'],
                '技术/IT': ['sspai', 'ithome', 'juejin', 'jianshu', 'guokr', '36kr', '51cto', 'csdn'],
                '游戏': ['lol', 'genshin', 'honkai', 'starrail'],
                '其他': ['weread', 'weatheralarm', 'earthquake', 'history']
            }
        };
        
        // 渲染平台分类
        renderPlatformCategories();
    } catch (error) {
        throw new Error('加载平台列表失败');
    }
}

// 渲染平台分类
function renderPlatformCategories() {
    if (!platformsData || !platformsData.categories) return;
    
    elements.platformCategories.innerHTML = '';
    
    for (const [category, platforms] of Object.entries(platformsData.categories)) {
        const categoryElement = document.createElement('div');
        categoryElement.className = 'platform-category';
        
        // 分类标题
        const categoryHeader = document.createElement('div');
        categoryHeader.className = 'category-header';
        categoryHeader.textContent = category;
        categoryElement.appendChild(categoryHeader);
        
        // 平台按钮
        const platformButtons = document.createElement('div');
        platformButtons.className = 'platform-buttons';
        
        platforms.forEach(platform => {
            const button = document.createElement('button');
            button.className = 'platform-btn';
            button.textContent = platform;
            button.dataset.platform = platform;
            
            button.addEventListener('click', () => {
                selectPlatform(platform);
            });
            
            platformButtons.appendChild(button);
        });
        
        categoryElement.appendChild(platformButtons);
        elements.platformCategories.appendChild(categoryElement);
    }
}

// 选择平台
function selectPlatform(platform) {
    // 更新当前平台
    currentPlatform = platform;
    
    // 更新按钮状态
    document.querySelectorAll('.platform-btn').forEach(btn => {
        if (btn.dataset.platform === platform) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // 更新结果标题
    elements.resultTitle.textContent = `${platform} 热榜`;
    
    // 获取热榜数据
    fetchHotboardData(platform);
}

// 获取热榜数据
async function fetchHotboardData(platform) {
    try {
        // 显示加载状态
        showLoading();
        
        // 调用 API 获取热榜数据
        const response = await fetch(`/api/hotboard?type=${encodeURIComponent(platform)}`);
        
        if (!response.ok) {
            throw new Error(`API 请求失败: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.message || '获取热榜数据失败');
        }
        
        // 检查 data 是否存在且包含 list 属性
        if (!data || !data.list) {
            throw new Error('无效的热榜数据');
        }
        
        // 显示热榜数据
        displayHotboardData(data);
        
        // 更新时间
        elements.updateTime.textContent = `更新时间: ${data.update_time || '未知'}`;
        
        // 成功获取热榜数据
        console.log(`获取 ${platform} 热榜成功`);
    } catch (error) {
        console.error('获取热榜数据失败:', error);
        showEmptyState();
    }
}

// 显示热榜数据
function displayHotboardData(data) {
    if (!data || !data.list || data.list.length === 0) {
        showEmptyState();
        return;
    }
    
    // 隐藏加载和空状态
    elements.loading.style.display = 'none';
    elements.emptyState.style.display = 'none';
    
    // 清空列表
    elements.hotboardList.innerHTML = '';
    
    // 渲染热榜项
    data.list.forEach(item => {
        const hotboardItem = document.createElement('div');
        hotboardItem.className = 'hotboard-item';
        
        // 排名数字
        const rankNumber = document.createElement('div');
        rankNumber.className = 'rank-number';
        if (item.index <= 3) {
            rankNumber.classList.add('top3');
        }
        rankNumber.textContent = item.index;
        hotboardItem.appendChild(rankNumber);
        
        // 内容
        const content = document.createElement('div');
        content.className = 'hotboard-content';
        
        // 标题
        const title = document.createElement('div');
        title.className = 'hotboard-title';
        title.textContent = item.title;
        content.appendChild(title);
        
        // 元数据
        const meta = document.createElement('div');
        meta.className = 'hotboard-meta';
        
        // 热度值
        const hotValue = document.createElement('span');
        hotValue.className = 'hot-value';
        hotValue.textContent = item.hot_value;
        meta.appendChild(hotValue);
        
        // 链接
        const link = document.createElement('a');
        link.className = 'hotboard-link';
        link.href = item.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = '查看详情';
        meta.appendChild(link);
        
        content.appendChild(meta);
        hotboardItem.appendChild(content);
        
        elements.hotboardList.appendChild(hotboardItem);
    });
}

// 显示加载状态
function showLoading() {
    elements.loading.style.display = 'flex';
    elements.emptyState.style.display = 'none';
    
    // 清空列表
    elements.hotboardList.innerHTML = '';
    elements.hotboardList.appendChild(elements.loading);
    elements.hotboardList.appendChild(elements.emptyState);
}

// 显示空状态
function showEmptyState() {
    elements.loading.style.display = 'none';
    elements.emptyState.style.display = 'flex';
    
    // 清空列表
    elements.hotboardList.innerHTML = '';
    elements.hotboardList.appendChild(elements.loading);
    elements.hotboardList.appendChild(elements.emptyState);
}

// 初始化事件监听器
function initEventListeners() {
    // 刷新按钮
    elements.refreshBtn.addEventListener('click', () => {
        if (currentPlatform) {
            fetchHotboardData(currentPlatform);
        } else {
            showToast('请先选择一个平台', 'error');
        }
    });
}



// 启动应用
window.addEventListener('DOMContentLoaded', initApp);
