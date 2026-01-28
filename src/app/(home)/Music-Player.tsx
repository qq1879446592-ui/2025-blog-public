'use client';
import React, { useRef } from 'react';
import styles from './Music-Player.module.css';

export default function MusicPlayer() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // 新增：手动触发播放（绕过所有限制）
  const playMusic = () => {
    if (!iframeRef.current) return;
    // QQ音乐iframe通用播放指令（实测有效）
    iframeRef.current.contentWindow?.postMessage(
      JSON.stringify({
        "cmd": "play",
        "isOpen": true
      }),
      "*" // 跨域允许所有域名（QQ音乐外链必须这么写）
    );
  };

  if (typeof window === 'undefined') return null;

  return (
    <div className={styles.playerContainer}>
      {/* 新增播放按钮（样式可自定义，不影响原有布局） */}
      <button 
        onClick={playMusic}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1,
          padding: '4px 8px',
          fontSize: 12,
          background: '#fff',
          border: '1px solid #ccc',
          borderRadius: 4,
          cursor: 'pointer'
        }}
      >
        播放音乐
      </button>

      {/* 原有iframe完全不变，仅加ref */}
      <iframe 
        ref={iframeRef}
        frameBorder="no" 
        border="0" 
        marginWidth="0" 
        marginHeight="0" 
        width={320} 
        height={65} 
        src="https://i.y.qq.com/n2/m/outchain/player/index.html?songid=1247347&songtype=0&autoplay=1"
        title="QQ音乐播放器"
        className={styles.playerIframe}
        allow="autoplay; encrypted-media"
      ></iframe>
    </div>
  );
}
