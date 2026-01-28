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
import { motion, useDragControls } from 'motion/react' // 新增：引入dragControls
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
  
  // 1. 手动控制拖拽（核心：解决粘鼠标）
  const dragControls = useDragControls() // 拖拽控制器
  const isDragging = useRef(false) // 标记是否正在拖拽
  const playerRef = useRef<HTMLDivElement>(null) // 播放器容器ref

  // 2. 窗口尺寸（兜底）
  const [windowSize, setWindowSize] = useState({ width: typeof window !== 'undefined' ? window.innerWidth : 1920, height: typeof window !== 'undefined' ? window.innerHeight : 1080 })

  // 初始化窗口尺寸 + 全局监听鼠标松开（强制结束拖拽）
  useEffect(() => {
    if (typeof window === 'undefined') return

    // 窗口大小监听
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }
    window.addEventListener('resize', handleResize)

    // 全局监听鼠标松开：强制结束拖拽（核心修复）
    const handleGlobalMouseUp = () => {
      if (isDragging.current) {
        dragControls.stop() // 强制停止拖拽
        isDragging.current = false
        // 重置播放器的拖拽状态（避免样式残留）
        if (playerRef.current) {
          playerRef.current.style.transform = ''
        }
      }
    }

    // 全局监听鼠标离开窗口（防止鼠标移出窗口后无法释放）
    const handleGlobalMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 0 || e.clientX < 0 || e.clientX > window.innerWidth || e.clientY > window.innerHeight) {
        handleGlobalMouseUp()
      }
    }

    window.addEventListener('mouseup', handleGlobalMouseUp)
    window.addEventListener('mouseleave', handleGlobalMouseLeave)

    // 清理监听
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mouseup', handleGlobalMouseUp)
      window.removeEventListener('mouseleave', handleGlobalMouseLeave)
    }
  }, [dragControls])

  // 3. 手动触发拖拽开始（仅编辑模式 + 仅点击播放器空白处）
  const handleDragStart = (e: React.MouseEvent) => {
    if (!editing) return
    // 阻止事件冒泡到内部元素（比如iframe）
    e.stopPropagation()
    isDragging.current = true
    dragControls.start(e) // 手动启动拖拽
  }

  // 4. 拖拽结束：更新位置 + 强制重置
  const handleDragEnd = useCallback((_, info) => {
    if (!editing || !isDragging.current) return
    // 更新位置（限制在可视区域内）
    setCardStyles({
      ...cardStyles,
      musicPlayer: {
        ...cardStyles.musicPlayer,
        top: Math.max(0, Math.min(info.offset.y, windowSize.height - (cardStyles.musicPlayer?.height || 65))),
        left: Math.max(0, Math.min(info.offset.x, windowSize.width - (cardStyles.musicPlayer?.width || 320))),
      },
    })
    // 强制结束拖拽
    isDragging.current = false
    dragControls.stop()
  }, [cardStyles, setCardStyles, editing, dragControls, windowSize])

  // 5. 编辑模式相关
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

  // 拖拽约束（简单兜底）
  const getConstraints = () => ({
    top: 0,
    left: 0,
    right: windowSize.width - (cardStyles.musicPlayer?.width || 320),
    bottom: windowSize.height - (cardStyles.musicPlayer?.height || 65),
  })

  return (
    <>
      {siteContent.enableChristmas && <SnowfallBackground zIndex={0} count={!maxSM ? 125 : 20} />}

      {/* 编辑模式提示栏 */}
      {editing && (
        <div className='pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center pt-6'>
          <div className='pointer-events-auto flex items-center gap-3 rounded-2xl bg-white/80 px-4 py-2 shadow-lg backdrop-blur'>
            <span className='text-xs text-gray-600'>编辑模式：拖拽播放器调整位置</span>
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

      {/* 页面主体 */}
      <div className='max-sm:flex max-sm:flex-col max-sm:items-center max-sm:gap-6 max-sm:pt-28 max-sm:pb-20'>
        {cardStyles.artCard?.enabled !== false && <ArtCard />}
        {cardStyles.hiCard?.enabled !== false && <HiCard />}
        {!maxSM && cardStyles.clockCard?.enabled !== false && <ClockCard />}
        {!maxSM && cardStyles.calendarCard?.enabled !== false && <CalendarCard />}
        
        {/* 音乐播放器（核心修复） */}
        {!maxSM && cardStyles.musicPlayer?.enabled !== false && (
          <motion.div
            ref={playerRef}
            data-id="musicPlayer"
            // 仅编辑模式可点击
            style={{
              position: 'absolute',
              top: cardStyles.musicPlayer.top || 0,
              left: cardStyles.musicPlayer.left || 0,
              width: cardStyles.musicPlayer.width || 320,
              height: cardStyles.musicPlayer.height || 65,
              borderRadius: 12,
              zIndex: 10,
              // 非编辑模式完全禁止交互
              pointerEvents: editing ? 'auto' : 'none',
              // 彻底阻断内部事件冒泡
              userSelect: 'none',
              touchAction: 'none',
            }}
            // 手动拖拽控制（核心）
            dragControls={dragControls}
            drag={editing}
            dragConstraints={getConstraints()}
            // 关闭所有可能导致粘滞的物理属性
            dragElastic={0}
            dragMomentum={false}
            dragScale={1}
            // 绑定事件
            onMouseDown={handleDragStart} // 手动启动拖拽
            onDragEnd={handleDragEnd}
            // 拖拽时的样式（简化，避免干扰）
            whileDrag={{
              boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
              // 拖拽时完全禁用内部所有元素的事件
              pointerEvents: 'none',
            }}
            whileHover={{ cursor: editing ? 'move' : 'default' }}
          >
            {/* 核心：嵌套两层div，彻底阻断iframe事件 */}
            <div style={{ 
              width: '100%', 
              height: '100%', 
              pointerEvents: 'none', // 第一层阻断
              position: 'relative' 
            }}>
              <div style={{ 
                width: '100%', 
                height: '100%', 
                pointerEvents: 'none' // 第二层阻断
              }}>
                {/* 站外播放器：强制禁用pointer-events */}
                <MusicPlayer 
                  style={{ 
                    pointerEvents: 'none', 
                    width: '100%', 
                    height: '100%' 
                  }} 
                />
              </div>
              
              {/* 可选：添加专门的拖拽手柄（推荐！只拖手柄，不拖播放器本体） */}
              {editing && (
                <div 
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: 20,
                    height: 20,
                    backgroundColor: '#4096ff',
                    borderRadius: '0 12px 0 8px',
                    cursor: 'move',
                    pointerEvents: 'auto', // 手柄单独开启事件
                    zIndex: 11,
                  }}
                  onMouseDown={handleDragStart}
                />
              )}
            </div>
          </motion.div>
        )}

        {!maxSM && cardStyles.musicCard?.enabled !== false && <MusicCard />}
        {cardStyles.socialButtons?.enabled !== false && <SocialButtons />}
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
