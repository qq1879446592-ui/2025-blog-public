// src/app/(home)/Music-Player.tsx
'use client'; // 必须置顶的客户端指令
import React from 'react';
// 引入配套的样式文件（下面会创建）
import styles from './Music-Player.module.css';

export default function MusicPlayer() {
  // 仅在客户端渲染，避免服务端报错
  if (typeof window === 'undefined') return null;
  
  return (
    {/* 外层容器：匹配页面板块的毛玻璃+雪顶样式 */}
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
        // 你的QQ音乐播放链接
        src="https://i.y.qq.com/v8/playsong.html?songid=106958339&songtype=0#webchat_redirect"
        className={styles.iframe}
      />
    </div>
  );
}
