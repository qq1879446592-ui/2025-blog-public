'use client'

export default function Home() {
  return (
    <div style={{
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '4px 0',
      gap: '1px'
    }}>
      {/* 1. 图一的问候语（仅1次） */}
      <div style={{ width: '95%', marginBottom: '2px' }}>
        {/* 粘贴你HiCard组件的原始代码（保证和图一一致） */}
        <div>
          <img src="你的头像地址" style={{ borderRadius: '50%', width: '80px', margin: '0 auto' }} />
          <p>Good Afternoon</p>
          <p>I'm douzi, Nice to meet you!</p>
        </div>
      </div>

      {/* 2. 图一的GitHub/dy/邮件按钮栏 */}
      <div style={{ width: '95%', marginBottom: '2px' }}>
        {/* 粘贴你SocialButtons的原始代码 */}
        <div>
          <button>GitHub</button>
          <button>dy</button>
          <button>邮件</button>
        </div>
      </div>

      {/* 3. 播放器（调宽，无其他改动） */}
      <div style={{ width: '95%', height: '45px', marginBottom: '2px' }}>
        <div style={{ width: '100%', height: '100%' }}>
          {/* 粘贴你MusicPlayer的原始代码 */}
          <div>MAMA - EXO-K</div>
          <button>播放</button>
        </div>
      </div>

      {/* 4. 图一的最新文章卡片 */}
      <div style={{ width: '95%', marginBottom: '2px' }}>
        {/* 粘贴你AritcleCard的原始代码 */}
        <div>
          <p>最新文章</p>
          <p>解决电脑屏幕帧数问题</p>
          <p>2025/12/18</p>
        </div>
      </div>

      {/* 5. 图一的爱心按钮 */}
      <div style={{ width: '95%' }}>
        {/* 粘贴你LikePosition的原始代码 */}
        <button style={{ borderRadius: '50%', width: '40px', height: '40px' }}>❤️</button>
      </div>
    </div>
  )
}
