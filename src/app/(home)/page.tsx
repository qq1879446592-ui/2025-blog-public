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
import { motion } from 'motion/react'
import { useLayoutEditStore } from './stores/layout-edit-store'
import { useConfigStore } from './stores/config-store'
import { toast } from 'sonner'
import ConfigDialog from './config-dialog/index'
import { useEffect, useState, useCallback } from 'react'
import SnowfallBackground from '@/layout/backgrounds/snowfall'

export default function Home() {
  const { maxSM } = useSize()
  const { cardStyles, configDialogOpen, setConfigDialogOpen, siteContent, setCardStyles } = useConfigStore()
  const editing = useLayoutEditStore(state => state.editing)
  const saveEditing = useLayoutEditStore(state => state.saveEditing)
  const cancelEditing = useLayoutEditStore(state => state.cancelEditing)
  
  // 解决 window is not defined 报错 + 初始化窗口尺寸
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  // 拖拽控制：强制重置拖拽状态
  const [dragKey, setDragKey] = useState(0)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })

      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight
        })
      }
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  // 修复：拖拽结束后强制重置状态（解决粘鼠标）
  const handleDragEnd = useCallback((_, info) => {
    // 1. 更新播放器位置
    setCardStyles({
      ...cardStyles,
      musicPlayer: {
        ...cardStyles.musicPlayer,
        top: Math.max(0, info.offset.y), // 限制top不小于0
        left: Math.max(0, info.offset.x), // 限制left不小于0
      },
    });
    // 2. 强制重置拖拽状态（核心：解决粘鼠标）
    setDragKey(prev => prev + 1)
    // 3. 编辑状态下才保存，非编辑状态禁止拖拽
    if (!editing) {
      toast.info('请进入编辑模式后调整布局')
    }
  }, [cardStyles, setCardStyles, editing])

  const handleSave = () => {
    saveEditing()
    toast.success('首页布局偏移已保存（尚未提交到远程配置）')
  }

  const handleCancel = () => {
    cancelEditing()
    setDragKey(0) // 重置拖拽状态
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
      return () => {
        window.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [setConfigDialogOpen])

  // 修复：拖拽约束兜底（避免尺寸为0导致约束失效）
  const getMusicPlayerConstraints = () => {
    if (windowSize.width === 0 || windowSize.height === 0) {
      return { top: 0, left: 0, right: 1000, bottom: 1000 } // 兜底值
    }
    const playerWidth = cardStyles.musicPlayer?.width || 320
    const playerHeight = cardStyles.musicPlayer?.height || 65
    return {
      top: 0,
      left: 0,
      right: windowSize.width - playerWidth,
      bottom: windowSize.height - playerHeight
    }
  }

  return (
    <>
      {siteContent.enableChristmas && <SnowfallBackground zIndex={0} count={!maxSM ? 125 : 20} />}

      {editing && (
        <div className='pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center pt-6'>
          <div className='pointer-events-auto flex items-center gap-3 rounded-2xl bg-white/80 px-4 py-2 shadow-lg backdrop-blur'>
            <span className='text-xs text-gray-600'>正在编辑首页布局，拖拽卡片调整位置</span>
            <div className='flex gap-2'>
              <motion.button
                type='button'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCancel}
                className='rounded-xl border bg-white px-3 py-1 text-xs font-medium text-gray-700'>
                取消
              </motion.button>
              <motion.button type='button' whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleSave} className='brand-btn px-3 py-1 text-xs'>
                保存偏移
              </motion.button>
            </div>
          </div>
        </div>
      )}

      <div className='max-sm:flex max-sm:flex-col max-sm:items-center max-sm:gap-6 max-sm:pt-28 max-sm:pb-20'>
        {cardStyles.artCard?.enabled !== false && <ArtCard />}
        {cardStyles.hiCard?.enabled !== false && <HiCard />}
        {!maxSM && cardStyles.clockCard?.enabled !== false && <ClockCard />}
        {!maxSM && cardStyles.calendarCard?.enabled !== false && <CalendarCard />}
        {!maxSM && cardStyles.musicPlayer?.enabled !== false && (
          // 核心修复1：添加key强制重置拖拽状态 + 仅编辑模式可拖拽
          <motion.div
            key={`music-player-${dragKey}`}
            data-id="musicPlayer"
            style={{
              position: 'absolute',
              top: cardStyles.musicPlayer.top || 0,
              left: cardStyles.musicPlayer.left || 0,
              width: cardStyles.musicPlayer.width || 320,
              height: cardStyles.musicPlayer.height || 65,
              borderRadius: 12,
              zIndex: 10,
              pointerEvents: editing ? 'auto' : 'none', // 核心修复2：非编辑模式禁止拖拽
            }}
            drag={editing} // 核心修复3：仅编辑模式开启拖拽
            dragConstraints={getMusicPlayerConstraints()}
            dragScale={1.02}
            dragElastic={0.05} // 核心修复4：降低拖拽弹性，避免粘滞
            onDragEnd={handleDragEnd}
            whileHover={{ cursor: editing ? 'move' : 'default' }}
            whileDrag={{
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              scale: 1.05,
              pointerEvents: 'none', // 核心修复5：拖拽时禁止内部元素劫持事件
            }}
          >
            {/* 核心修复6：播放器外层加pointer-events，避免内部元素干扰 */}
            <div style={{ pointerEvents: 'auto', width: '100%', height: '100%' }}>
              <MusicPlayer />
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
