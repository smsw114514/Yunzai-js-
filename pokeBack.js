import plugin from '../../lib/plugins/plugin.js'

const cdList = new Map()

export class PokeBack extends plugin {
  constructor() {
    super({
      name: '拍一拍回复',
      dsc: '干什么',
      event: 'notice.group.poke',
      priority: 500
    })
  }
// 处理拍一拍事件
  async accept() {
    if (this.e.target_id !== this.e.self_id) return false

    const userId = this.e.user_id
    const now = Date.now()
    if (cdList.has(userId) && (now - cdList.get(userId) < 60000)) return true
    // 设置冷却时间为60秒
    cdList.set(userId, now)

    await this.e.reply([
      { type: 'at', qq: userId }, 
      ' 戳我干什么！！'
    ])
    
    return true
  }
}