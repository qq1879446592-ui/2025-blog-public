'use client'

import HiCard from '@/app/(home)/hi-card' 
import SocialButtons from '@/app/(home)/social-buttons' 
import AritcleCard from '@/app/(home)/aritcle-card' 
import LikePosition from './like-position' 
import { useSize } from '@/hooks/use-size'
import { useConfigStore } from './stores/config-store'
import SnowfallBackground from '@/layout/backgrounds/snowfall'

export default function Home() {
  const { maxSM } = useSize() 
  const { cardStyles, siteContent } = useConfigStore()

  return (
    <>
      {siteContent.enableChristmas && <SnowfallBackground zIndex={0} count={maxSM ? 20 : 125} />}

      {/* ========== 完全复刻图一的容器/间距/样式 ========== */}
      <div style={{
        maxWidth: '100%',
        margin: '0 auto',
        padding: '0',
        display: maxSM ? 'flex' : 'block',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0px',
        background: 'transparent',
      }}>
        {/* 1. 问候语卡片：还原图一的边框/圆角/位置 */}
        {cardStyles.hiCard?.enabled !== false && (
          <div style={{
            width: '92%',
            marginTop: '8px',
            marginBottom: '2px',
            borderRadius: '16px',
            padding: '12px 8px',
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.2)',
          }}>
            <HiCard />
          </div>
        )}

        {/* 2. 社交按钮栏：还原图一的间距/位置 */}
        {cardStyles.socialButtons?.enabled !== false && (
          <div style={{
            width: '92%',
            marginTop: '0px',
            marginBottom: '4px',
          }}>
            <SocialButtons />
          </div>
        )}

        {/* 3. 最新文章卡片：还原图一的圆角/阴影/位置 */}
        {cardStyles.articleCard?.enabled !== false && (
          <div style={{
            width: '92%',
            marginTop: '0px',
            borderRadius: '12px',
            padding: '8px 6px',
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(6px)',
            border: '1px solid rgba(255,255,255,0.15)',
          }}>
            <AritcleCard />
          </div>
        )}

        {/* 4. 爱心按钮：还原图一的位置 */}
        {cardStyles.likePosition?.enabled !== false && (
          <div style={{
            width: '92%',
            marginTop: '2px',
            display: 'flex',
            justifyContent: 'center',
          }}>
            <LikePosition />
          </div>
        )}
      </div>

      {siteContent.enableChristmas && <SnowfallBackground zIndex={2} count={maxSM ? 20 : 125} />}
    </>
  )
}
