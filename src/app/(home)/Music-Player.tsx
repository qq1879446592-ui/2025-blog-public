// src/app/(home)/Music-Player.tsx
'use client'; // 仅客户端渲染iframe，避免服务端报错
import React from 'react';
import styles from './Music-Player.module.css';

export default function MusicPlayer() {
  // 仅在浏览器环境渲染iframe
  if (typeof window === 'undefined') return null;

  return (
    {/* 外层毛玻璃+雪顶容器（匹配你页面的风格） */}
    <div className={styles.playerContainer}>
      {/* 雪顶装饰（和你页面的积雪效果一致） */}
      <div className={styles.snowTop}></div>
      
      {/* 完全保留你给的iframe代码，一字不改 */}
      <iframe 
        frameBorder="no" 
        border="0" 
        marginWidth="0" 
        marginHeight="0" 
        width={320} 
        height={65} 
        src="https://i.y.qq.com/n2/m/outchain/player/index.html?songid=127570280&songtype=0"
        title="QQ音乐播放器"
        className={styles.playerIframe}
      ></iframe>
    </div>
  );
}
