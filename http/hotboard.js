import { HttpResponse } from '#utils/http-utils.js';

/**
 * 热榜查询 API
 * 提供各大平台热榜数据的查询接口
 */
export default {
  name: 'hotboard',
  dsc: '热榜查询 API',
  priority: 180,
  init: async (app, Bot) => {
    // 初始化逻辑（如果需要）
  },

  routes: [
    {
      method: 'GET',
      path: '/api/hotboard',
      handler: HttpResponse.asyncHandler(async (req, res, Bot) => {
        const { type } = req.query;
        
        if (!type) {
          return HttpResponse.error(res, 400, '平台类型不能为空');
        }

        try {
          // 调用 hotboard 工作流的方法获取热榜数据
          // 这里直接调用 API，与 stream 插件使用相同的数据源
          const url = `https://uapis.cn/api/v1/misc/hotboard?type=${encodeURIComponent(type)}`;
          
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            },
            timeout: 10000
          });

          if (!response.ok) {
            let errorMessage = `HTTP错误: ${response.status}`;
            try {
              const errorData = await response.json();
              errorMessage = errorData.message || errorMessage;
            } catch (e) {
              // 忽略 JSON 解析错误
            }
            return HttpResponse.error(res, response.status, errorMessage);
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

          const result = {
            type: data.type,
            update_time: data.update_time,
            list: formattedList
          };

          return HttpResponse.success(res, result);
        } catch (error) {
          return HttpResponse.error(res, 500, `获取热榜失败: ${error.message}`);
        }
      }, 'hotboard.get')
    },

    {
      method: 'GET',
      path: '/api/hotboard/platforms',
      handler: HttpResponse.asyncHandler(async (req, res, Bot) => {
        // 返回支持的平台列表
        const platforms = {
          categories: {
            '视频/社区': ['bilibili', 'acfun', 'weibo', 'zhihu', 'douyin', 'kuaishou', 'douban-movie', 'tieba', 'hupu', 'v2ex'],
            '新闻/资讯': ['baidu', 'thepaper', 'toutiao', 'qq-news', 'sina', 'netease-news', 'huxiu'],
            '技术/IT': ['sspai', 'ithome', 'juejin', 'jianshu', 'guokr', '36kr', '51cto', 'csdn'],
            '游戏': ['lol', 'genshin', 'honkai', 'starrail'],
            '其他': ['weread', 'weatheralarm', 'earthquake', 'history']
          },
          all: [
            'bilibili', 'acfun', 'weibo', 'zhihu', 'douyin', 'kuaishou', 'douban-movie', 'tieba', 'hupu', 'v2ex',
            'baidu', 'thepaper', 'toutiao', 'qq-news', 'sina', 'netease-news', 'huxiu',
            'sspai', 'ithome', 'juejin', 'jianshu', 'guokr', '36kr', '51cto', 'csdn',
            'lol', 'genshin', 'honkai', 'starrail',
            'weread', 'weatheralarm', 'earthquake', 'history'
          ]
        };

        return HttpResponse.success(res, platforms);
      }, 'hotboard.platforms')
    }
  ]
};
