// src/app/(home)/Music-Player.tsx
'use client';
import React from 'react';
import styles from './Music-Player.module.css';

export default function MusicPlayer() {
  if (typeof window === 'undefined') return null;
  
  return (
    // 外层容器：匹配页面板块的毛玻璃+雪顶样式
    <div className={styles.playerContainer}>
      {/* 雪顶装饰（和页面板块一致） */}
      <div className={styles.snowTop}></div>
      {/* QQ音乐播放器iframe */}
      <iframe
        frameBorder="no"
        border="0"
        marginWidth="0"
        marginHeight="0"
        width="100%"
        height="65px"
        title="QQ音乐播放器"
        src="https://i.y.qq.com/v8/playsong.html?songid=106958339&songtype=0#webchat_redirect"
        className={styles.iframe}
      />
    </div>
  );
}
