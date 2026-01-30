import AIStream from '#infrastructure/aistream/aistream.js';

/**
 * 热榜查询工作流
 * 
 * 提供热榜查询功能，支持多个平台的热榜数据：
 * - weibo（新浪微博热搜）
 * - bilibili（哔哩哔哩弹幕网）
 * - zhihu（知乎热榜）
 * - douyin（抖音热榜）
 * - 等多个平台
 */
export default class HotboardStream extends AIStream {
  constructor() {
    super({
      name: 'hotboard',
      description: '热榜查询工作流，支持多个平台的实时热榜数据',
      version: '1.0.0',
      author: 'XRK',
      priority: 180,
      config: {
        enabled: true,
        temperature: 0.3,
        maxTokens: 2000,
        topP: 0.9
      }
    });
  }

  async init() {
    await super.init();
    this.registerAllFunctions();
  }

  registerAllFunctions() {
    // MCP工具：查询热榜
    this.registerMCPTool('get_hotboard', {
      description: '查询指定平台的热榜数据',
      inputSchema: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            description: '热榜平台类型，支持：weibo（新浪微博）、bilibili（哔哩哔哩）、zhihu（知乎）、douyin（抖音）、baidu（百度）、toutiao（今日头条）等'
          }
        },
        required: ['type']
      },
      handler: async (args = {}, context = {}) => {
        const { type } = args;
        if (!type) {
          return { success: false, error: '平台类型不能为空' };
        }

        try {
          const result = await this.fetchHotboard(type);
          
          if (result.success) {
            // 存储到上下文
            if (context.stream) {
              context.stream.context = context.stream.context || {};
              context.stream.context.hotboardResult = result.data;
              context.stream.context.hotboardType = type;
            }

            return {
              success: true,
              data: result.data
            };
          } else {
            if (context.stream) {
              context.stream.context = context.stream.context || {};
              context.stream.context.hotboardError = result.error;
            }
            return { success: false, error: result.error };
          }
        } catch (error) {
          if (context.stream) {
            context.stream.context = context.stream.context || {};
            context.stream.context.hotboardError = error.message;
          }
          return { success: false, error: error.message };
        }
      },
      enabled: true
    });
  }

  /**
   * 从API获取热榜数据
   */
  async fetchHotboard(type) {
    try {
      const url = `https://uapis.cn/api/v1/misc/hotboard?type=${encodeURIComponent(type)}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10秒超时
      });

      if (!response.ok) {
        let errorMessage = `HTTP错误: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // 忽略JSON解析错误
        }
        return { success: false, error: errorMessage };
      }

      const data = await response.json();
      
      // 格式化热榜数据，使其更易读
      const formattedList = data.list.map(item => {
        return {
          index: item.index,
          title: item.title,
          hot_value: item.hot_value,
          url: item.url
        };
      });

      return {
        success: true,
        data: {
          type: data.type,
          update_time: data.update_time,
          list: formattedList
        }
      };
    } catch (error) {
      return { success: false, error: `获取热榜失败: ${error.message}` };
    }
  }

  /**
   * 构建系统提示
   */
  buildSystemPrompt(context) {
    return `【热榜查询说明】
本工作流提供热榜查询功能，支持以下平台：
- 视频/社区：bilibili、acfun、weibo、zhihu、douyin、kuaishou、douban-movie、tieba、hupu、v2ex等
- 新闻/资讯：baidu、thepaper、toutiao、qq-news、sina、netease-news、huxiu等

使用方法：
1. 调用get_hotboard工具，指定平台类型
2. 工具会返回该平台的实时热榜数据，包含排名、标题、热度值和链接
3. 可以根据需要展示热榜信息或进行进一步处理`;
  }
}
