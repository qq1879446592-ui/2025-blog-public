'use client'

import HiCard from '@/app/(home)/hi-card' 
import ArtCard from '@/app/(home)/art-card'
import ClockCard from '@/app/(home)/clock-card'
import CalendarCard from '@/app/(home)/calendar-card'
import MusicPlayer from '@/app/(home)/Music-Player'
import MusicCard from '@/app/(home)/music-card'
import SocialButtons from '@/app/(home)/social-buttons' 
import ShareCard from '@/app/(home)/share-card'
import AritcleCard from '@/app/(home)/aritcle-card' 
import WriteButtons from '@/app/(home)/write-buttons'
import LikePosition from './like-position' 
import HatCard from './hat-card'
import BeianCard from './beian-card'
import { useSize } from '@/hooks/use-size'
import { motion, useDragControls } from 'motion/react'
import { useLayoutEditStore } from './stores/layout-edit-store'
import { useConfigStore } from './stores/config-store'
import { toast } from 'sonner'
import ConfigDialog from './config-dialog/index'
import { useEffect, useState, useCallback, useRef } from 'react'
import SnowfallBackground from '@/layout/backgrounds/snowfall'

export default function Home() {
  const { maxSM } = useSize() 
  const { cardStyles, configDialogOpen, setConfigDialogOpen, siteContent, setCardStyles } = useConfigStore()
  const editing = useLayoutEditStore(state => state.editing)
  const saveEditing = useLayoutEditStore(state => state.saveEditing)
  const cancelEditing = useLayoutEditStore(state => state.cancelEditing)
  
  // 电脑端拖拽逻辑（保留，不影响手机端）
  const dragControls = useDragControls()
  const isDragging = useRef(false)
  const playerRef = useRef<HTMLDivElement>(null)
  const [windowSize, setWindowSize] = useState({ 
    width: typeof window !== 'undefined' ? window.innerWidth : 1920, 
    height: typeof window !== 'undefined' ? window.innerHeight : 1080 
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', handleResize)
    const handleGlobalMouseUp = () => {
      if (isDragging.current) {
        dragControls.stop()
        isDragging.current = false
      }
    }
    window.addEventListener('mouseup', handleGlobalMouseUp)
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mouseup', handleGlobalMouseUp)
    }
  }, [dragControls])

  const handleDragStart = (e: React.MouseEvent) => {
    if (!editing || maxSM) return
    e.stopPropagation()
    isDragging.current = true
    dragControls.start(e)
  }

  const handleDragEnd = useCallback((_, info) => {
    if (!editing || maxSM || !isDragging.current) return
    setCardStyles({
      ...cardStyles,
      musicPlayer: {
        ...cardStyles.musicPlayer,
        top: Math.max(0, Math.min(info.offset.y, windowSize.height - (cardStyles.musicPlayer?.height || 65))),
        left: Math.max(0, Math.min(info.offset.x, windowSize.width - (cardStyles.musicPlayer?.width || 320))),
      },
    })
    isDragging.current = false
  }, [cardStyles, setCardStyles, editing, dragControls, windowSize, maxSM])

  const handleSave = () => {
    saveEditing()
    toast.success('首页布局偏移已保存')
  }

  const handleCancel = () => {
    cancelEditing()
    isDragging.current = false
    dragControls.stop()
    toast.info('已取消此次拖拽布局修改')
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'l' || e.key === ',')) {
        e.preventDefault()
        setConfigDialogOpen(true)
      }
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [setConfigDialogOpen])

  const getConstraints = () => ({
    top: 0,
    left: 0,
    right: windowSize.width - (cardStyles.musicPlayer?.width || 320),
    bottom: windowSize.height - (cardStyles.musicPlayer?.height || 65),
  })

  return (
    <>
      {siteContent.enableChristmas && <SnowfallBackground zIndex={0} count={!maxSM ? 125 : 20} />}

      {/* ========== 核心：把顶部功能栏移到最顶部空白区 ========== */}
      {maxSM && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 99, // 悬浮在最顶部，不遮挡其他内容
          padding: '4px 8px',
          boxSizing: 'border-box'
        }}>
          {/* 这里是你红圈里的顶部功能栏组件（替换成实际组件名） */}
          {/* 比如：<TopBar /> （如果是HiCard里的顶部栏，调整HiCard的结构） */}
          {/* 若HiCard包含顶部栏+问候语，拆分后：顶部栏放这里，问候语保留原位 */}
          <HiCard renderOnlyTopBar={true} /> 
        </div>
      )}

      {editing && !maxSM && (
        <div className='pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center pt-6'>
          <div className='pointer-events-auto flex items-center gap-3 rounded-2xl bg-white/80 px-4 py-2 shadow-lg backdrop-blur'>
            <span className='text-xs text-gray-600'>编辑模式：拖右上角手柄调整位置 | 点击播放器可播放</span>
            <div className='flex gap-2'>
              <motion.button
                type='button'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCancel}
                className='rounded-xl border bg-white px-3 py-1 text-xs font-medium text-gray-700'>
                取消
              </motion.button>
              <motion.button 
                type='button' 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }} 
                onClick={handleSave} 
                className='brand-btn px-3 py-1 text-xs'>
                保存位置
              </motion.button>
            </div>
          </div>
        </div>
      )}

      {/* ========== 其他元素：位置/尺寸完全不动，仅调宽播放器 ========== */}
      <div className='max-sm:flex max-sm:flex-col max-sm:items-center max-sm:gap-0 max-sm:pt-12 max-sm:pb-0'>
        {/* 1. 问候语（仅保留问候语部分，顶部栏已移到最顶部） */}
        {cardStyles.hiCard?.enabled !== false && <HiCard renderOnlyGreeting={true} />}

        {/* 2. GitHub/dy/邮件按钮栏：位置/尺寸完全不动 */}
        {cardStyles.socialButtons?.enabled !== false && <SocialButtons />}

        {/* 3. 播放器：调宽（全屏宽度），高度不变，其他不动 */}
        {maxSM && cardStyles.musicPlayer?.enabled !== false && (
          <div style={{
            width: '100%', // 调宽为全屏宽度，匹配按钮栏
            height: 42, // 高度不变
            marginTop: 4,
            marginBottom: 4,
            borderRadius: 6,
            overflow: 'hidden'
          }}>
            <MusicPlayer style={{ width: '100%', height: '100%' }} />
          </div>
        )}

        {/* 4. 最新文章卡片：位置/尺寸完全不动 */}
        {cardStyles.articleCard?.enabled !== false && <AritcleCard />}

        {/* 5. 爱心按钮：位置/尺寸完全不动 */}
        {cardStyles.likePosition?.enabled !== false && <LikePosition />}

        {/* ========== 电脑端组件：无改动 ========== */}
        {!maxSM && cardStyles.artCard?.enabled !== false && <ArtCard />}
        {!maxSM && cardStyles.clockCard?.enabled !== false && <ClockCard />}
        {!maxSM && cardStyles.calendarCard?.enabled !== false && <CalendarCard />}
        {!maxSM && cardStyles.musicPlayer?.enabled !== false && (
          <motion.div
            ref={playerRef}
            data-id="musicPlayer"
            style={{
              position: 'absolute',
              top: cardStyles.musicPlayer.top || 0,
              left: cardStyles.musicPlayer.left || 0,
              width: cardStyles.musicPlayer.width || 320,
              height: cardStyles.musicPlayer.height || 65,
              borderRadius: 12,
              zIndex: 10,
              userSelect: 'none',
              touchAction: 'none',
            }}
            dragControls={dragControls}
            drag={editing}
            dragConstraints={getConstraints()}
            dragElastic={0}
            dragMomentum={false}
            dragScale={1}
            onDragEnd={handleDragEnd}
            whileDrag={{ boxShadow: '0 8px 20px rgba(0,0,0,0.15)' }}
          >
            <div style={{ width: '100%', height: '100%', pointerEvents: 'auto' }}>
              <MusicPlayer style={{ width: '100%', height: '100%' }} />
            </div>
            {editing && (
              <div 
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: 24,
                  height: 24,
                  backgroundColor: 'rgba(64, 150, 255, 0.8)',
                  borderRadius: '0 12px 0 8px',
                  cursor: 'move',
                  pointerEvents: 'auto',
                  zIndex: 11,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: 12
                }}
                onMouseDown={handleDragStart}
                title="拖拽调整位置"
              >
                ☰
              </div>
            )}
          </motion.div>
        )}
        {!maxSM && cardStyles.musicCard?.enabled !== false && <MusicCard />}
        {!maxSM && cardStyles.shareCard?.enabled !== false && <ShareCard />}
        {!maxSM && cardStyles.writeButtons?.enabled !== false && <WriteButtons />}
        {cardStyles.hatCard?.enabled !== false && <HatCard />}
        {cardStyles.beianCard?.enabled !== false && <BeianCard />}
      </div>

      {siteContent.enableChristmas && <SnowfallBackground zIndex={2} count={!maxSM ? 125 : 20} />}
      <ConfigDialog open={configDialogOpen} onClose={() => setConfigDialogOpen(false)} />
    </>
  )
}
