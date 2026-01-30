# wei-Core

wei-Core 是 XRK-AGT 平台的一个核心模块，提供热榜查询等实用功能。

## 模块简介

wei-Core 模块专注于提供热榜查询功能，支持多个主流平台的实时热榜数据获取，方便用户快速了解网络热点。

## 功能说明

### 热榜查询

通过 `hotboard` 工作流插件，可查询以下平台的热榜数据：

- **视频/社区**：bilibili、acfun、weibo、zhihu、douyin、kuaishou、douban-movie、tieba、hupu、v2ex 等
- **新闻/资讯**：baidu、thepaper、toutiao、qq-news、sina、netease-news、huxiu 等
- **技术/IT**：sspai、ithome、juejin、jianshu、guokr、36kr、51cto、csdn 等
- **游戏**：lol、genshin、honkai、starrail 等
- **其他**：weread、weatheralarm、earthquake、history 等

## 安装与使用

### 安装

wei-Core 模块已集成到 XRK-AGT 项目中，无需单独安装。

### 使用方法

#### 通过 MCP 工具调用

1. **查询热榜**：调用 `hotboard.get_hotboard` 工具，指定平台类型

   ```javascript
   // 调用示例：查询微博热搜
   const result = await context.callTool('hotboard.get_hotboard', {
     type: 'weibo'
   });
   ```

2. **返回数据结构**：

   ```javascript
   {
     "success": true,
     "data": {
       "type": "weibo",
       "update_time": "2026-01-30 21:41:25",
       "list": [
         {
           "index": 1,
           "title": "警方通报金晨事件",
           "hot_value": "4977568",
           "url": "https://s.weibo.com/weibo?q=%23%E8%AD%A6%E6%96%B9%E9%80%9A%E6%8A%A5%E9%87%91%E6%99%A8%E4%BA%8B%E4%BB%B6%23"
         },
         // 更多热榜条目...
       ]
     }
   }
   ```

## 插件列表

| 插件名称 | 类型 | 功能说明 | 文件路径 |
|---------|------|---------|----------|
| hotboard | stream | 热榜查询工作流，支持多个平台的实时热榜数据 | stream/hotboard.js |

## 技术实现

- **基于 AIStream 基类**：遵循 XRK-AGT 的工作流规范
- **使用原生 fetch API**：调用 `https://uapis.cn/api/v1/misc/hotboard` 接口
- **完整的错误处理**：处理网络错误、API 错误等情况
- **数据格式化**：返回标准化的热榜数据结构
- **上下文管理**：将查询结果存储到上下文，便于后续使用

## 配置说明

wei-Core 模块无需特殊配置，使用默认配置即可正常工作。

## 注意事项

1. 热榜数据来源于第三方 API，请遵守相关平台的使用规范
2. 频繁查询可能会触发 API 限流，建议合理控制查询频率
3. 部分平台的热榜数据可能会有延迟或更新不及时的情况

## 版本历史

- **v1.0.0** (2026-01-30)：初始版本，添加热榜查询功能

## 贡献

欢迎提交 Issue 和 Pull Request 来改进 wei-Core 模块。

## 许可

wei-Core 模块遵循 XRK-AGT 项目的许可协议。
