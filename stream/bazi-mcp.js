export function getMcpServers() {
  const isWin = typeof process !== 'undefined' && process.platform === 'win32';
  return {
    'Bazi': isWin
      ? {
          command: 'cmd',
          args: ['/c', 'npx', 'bazi-mcp'],
          optional: true
        }
      : {
          command: 'npx',
          args: ['bazi-mcp'],
          optional: true
        }
  };
}

// 占位工作流：不参与对话，只为 getMcpServers 提供容器
export default class BaziMcpStream {
  constructor() {
    this.name = 'bazi-mcp';
    this.config = { enabled: false }; // 仅用于挂 MCP，不参与对话
  }

  // 占位：避免 Embedding 初始化时报错
  async initEmbedding() {
    return;
  }
}
