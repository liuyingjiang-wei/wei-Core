import { useState, useEffect } from 'react'
import { fetchHotboard } from "./services/api"
import ClickSpark from "./components/ui/ClickSpark"

const platforms = {
  '视频': ['bilibili', 'weibo', 'douyin', 'kuaishou'],
  '资讯': ['baidu', 'toutiao', 'thepaper', 'sina'],
  '技术': ['juejin', 'sspai', 'ithome', 'v2ex'],
  '游戏': ['lol', 'genshin', 'starrail']
}

export default function App() {
  const [selected, setSelected] = useState(null)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [cat, setCat] = useState('视频')

  useEffect(() => {
    if (!selected) return
    setLoading(true)
    fetchHotboard(selected)
      .then(setData)
      .finally(() => setLoading(false))
  }, [selected])

  return (
    <ClickSpark
      sparkColor="#999"
      sparkSize={10}
      sparkRadius={20}
      sparkCount={12}
      duration={500}
    >
      <div className="app">
        <div className="content">
          <h1 className="title">热榜查询</h1>

          <div className="card">
            <div className="platform-selector">
              <div className="category-buttons">
                {Object.keys(platforms).map(k => (
                  <button 
                    key={k} 
                    className={`btn ${cat === k ? 'active' : ''}`}
                    onClick={() => setCat(k)}
                  >
                    {k}
                  </button>
                ))}
              </div>
              <div className="platform-buttons">
                {platforms[cat].map(id => (
                  <button 
                    key={id} 
                    className={`btn ${selected === id ? 'active' : ''}`}
                    onClick={() => setSelected(id)}
                  >
                    {id}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {selected && (
            <div className="card">
              <div className="hotboard-header">
                <span>{selected}</span>
                <button 
                  className="btn"
                  onClick={() => {
                    setLoading(true)
                    fetchHotboard(selected).then(setData).finally(() => setLoading(false))
                  }}
                >
                  刷新
                </button>
              </div>
              {loading ? (
                <div className="loading">
                  {Array(10).fill(0).map((_, i) => (
                    <div key={i} className="hotboard-item">
                      <div className="skeleton rank"></div>
                      <div style={{ flex: 1 }}>
                        <div className="skeleton" style={{ height: '14px', marginBottom: '4px' }}></div>
                        <div className="skeleton" style={{ height: '12px', width: '50%' }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : data?.list ? (
                <div className="hotboard-list">
                  {data.list.map((item, i) => (
                    <div key={i} className="hotboard-item">
                      <div className={`rank ${i < 3 ? 'top' : 'normal'}`}>{i + 1}</div>
                      <div className="item-content">
                        <div className="item-title">{item.title}</div>
                        <div className="item-meta">
                          {i < 3 && <span className="hot-badge">热</span>}
                          <span>{item.hot_value}</span>
                        </div>
                      </div>
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="item-link"
                      >
                        →
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty">暂无数据</div>
              )}
            </div>
          )}

          <div className="footer">© 2026</div>
        </div>
      </div>
    </ClickSpark>
  )
}
