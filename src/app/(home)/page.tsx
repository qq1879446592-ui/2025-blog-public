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
  const { maxSM } = useSize() // maxSM = 移动端（手机）
  const { cardStyles, configDialogOpen, setConfigDialogOpen, siteContent, setCardStyles } = useConfigStore()
  const editing = useLayoutEditStore(state => state.editing)
  const saveEditing = useLayoutEditStore(state => state.saveEditing)
  const cancelEditing = useLayoutEditStore(state => state.cancelEditing)
  
  // 拖拽核心控制（仅电脑端用）
  const dragControls = useDragControls()
  const isDragging = useRef(false)
  const playerRef = useRef<HTMLDivElement>(null)
  const [windowSize, setWindowSize] = useState({ 
    width: typeof window !== 'undefined' ? window.innerWidth : 1920, 
    height: typeof window !== 'undefined' ? window.innerHeight : 1080 
  })

  // 窗口尺寸 + 全局鼠标监听（仅电脑端拖拽用）
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

  // 电脑端拖拽逻辑（仅电脑端用）
  const handleDragStart = (e: React.MouseEvent) => {
    if (!editing || maxSM) return // 移动端不触发拖拽
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

  // 编辑模式操作
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

  // 快捷键逻辑
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

  // 电脑端拖拽约束（仅电脑端用）
  const getConstraints = () => ({
    top: 0,
    left: 0,
    right: windowSize.width - (cardStyles.musicPlayer?.width || 320),
    bottom: windowSize.height - (cardStyles.musicPlayer?.height || 65),
  })

  return (
    <>
      {siteContent.enableChristmas && <SnowfallBackground zIndex={0} count={!maxSM ? 125 : 20} />}

      {editing && !maxSM && ( // 仅电脑端显示编辑栏
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

      {/* 页面主体：区分电脑端/移动端布局 */}
      <div className='max-sm:flex max-sm:flex-col max-sm:items-center max-sm:gap-6 max-sm:pt-28 max-sm:pb-20'>
        {/* 电脑端专属组件（maxSM=false 时显示） */}
        {!maxSM && cardStyles.artCard?.enabled !== false && <ArtCard />}
        {!maxSM && cardStyles.hiCard?.enabled !== false && <HiCard />}
        {!maxSM && cardStyles.clockCard?.enabled !== false && <ClockCard />}
        {!maxSM && cardStyles.calendarCard?.enabled !== false && <CalendarCard />}
        
        {/* 电脑端音乐播放器（保持原有逻辑，不修改） */}
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

        {/* 移动端+电脑端通用组件 */}
        {cardStyles.socialButtons?.enabled !== false && <SocialButtons />}

        {/* ========== 新增：移动端音乐播放器（仅手机端显示，放在GitHub按钮下方） ========== */}
        {maxSM && cardStyles.musicPlayer?.enabled !== false && ( // maxSM=true = 手机端
          <div style={{
            width: '100%',
            maxWidth: 300, // 适配手机宽度
            height: 65,
            marginTop: 8, // 与上方GitHub按钮保持间距
            borderRadius: 12,
            overflow: 'hidden'
          }}>
            <MusicPlayer style={{ width: '100%', height: '100%' }} />
          </div>
        )}
        {/* ============================================== */}

        {/* 其他通用/移动端组件 */}
        {!maxSM && cardStyles.musicCard?.enabled !== false && <MusicCard />}
        {!maxSM && cardStyles.shareCard?.enabled !== false && <ShareCard />}
        {cardStyles.articleCard?.enabled !== false && <AritcleCard />}
        {!maxSM && cardStyles.writeButtons?.enabled !== false && <WriteButtons />}
        {cardStyles.likePosition?.enabled !== false && <LikePosition />}
        {cardStyles.hatCard?.enabled !== false && <HatCard />}
        {cardStyles.beianCard?.enabled !== false && <BeianCard />}
      </div>

      {siteContent.enableChristmas && <SnowfallBackground zIndex={2} count={!maxSM ? 125 : 20} />}
      <ConfigDialog open={configDialogOpen} onClose={() => setConfigDialogOpen(false)} />
    </>
  )
}
