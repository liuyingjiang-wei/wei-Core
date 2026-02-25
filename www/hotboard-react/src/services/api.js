const API_BASE_URL = import.meta.env.VITE_XRK_MAIN_ORIGIN || ''

export async function fetchHotboard(platform) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/hotboard?type=${encodeURIComponent(platform)}`)
    
    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.message || '获取热榜数据失败')
    }
    
    return data
  } catch (error) {
    console.error('获取热榜数据失败:', error)
    throw error
  }
}
