'use client'

import { useRef, useEffect } from 'react'

interface MusicPlayerProps {
  style?: React.CSSProperties
}

export default function MusicPlayer({ style }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)

  // 播放器内部兜底的自动播放逻辑
  useEffect(() => {
    if (!audioRef.current) return

    const handlePlay = () => {
      console.log('音乐开始播放')
    }

    const handleError = (e: Event) => {
      console.error('播放器出错：', e)
    }

    const audio = audioRef.current
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('error', handleError)

    // 组件卸载时清理事件
    return () => {
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('error', handleError)
      audio.pause()
    }
  }, [])

  return (
    <div style={{ 
      ...style, 
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderRadius: 12,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
    }}>
      {/* 音频核心元素（隐藏） */}
      <audio
        ref={audioRef}
        src="https://i.y.qq.com/n2/m/outchain/player/index.html?songid=1247347&songtype=0" // 替换为实际可跨域的音乐链接
        loop // 循环播放（可选）
        preload="auto"
      />

      {/* 播放器UI（可根据你的原有样式调整） */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ color: '#4096ff' }}
        >
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
        <div style={{ fontSize: 14, color: '#333', fontWeight: 500 }}>
          背景音乐
        </div>
      </div>

      {/* 播放/暂停控制按钮 */}
      <button
        onClick={() => {
          if (!audioRef.current) return
          if (audioRef.current.paused) {
            audioRef.current.play()
          } else {
            audioRef.current.pause()
          }
        }}
        style={{
          border: 'none',
          backgroundColor: 'transparent',
          cursor: 'pointer',
          padding: 8,
          borderRadius: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          ref={audioRef}
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ color: '#4096ff' }}
        >
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      </button>
    </div>
  )
}
