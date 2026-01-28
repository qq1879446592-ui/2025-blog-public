'use client';
import React, { useEffect, useRef } from 'react'; // 仅新增useRef/useEffect
import styles from './Music-Player.module.css';

export default function MusicPlayer() {
  const iframeRef = useRef<HTMLIFrameElement>(null); // 新增：获取iframe引用
  const hasPlayed = useRef(false); // 新增：标记是否已播放过

  // 新增：监听页面点击，触发播放（浏览器允许用户交互后播放）
  useEffect(() => {
    if (typeof window === 'undefined' || hasPlayed.current) return;

    // 点击页面任意位置触发播放
    const handlePageClick = () => {
      if (!iframeRef.current || hasPlayed.current) return;
      // 向QQ音乐iframe发送播放指令（兼容跨域）
      iframeRef.current.contentWindow?.postMessage(
        { action: 'play' },
        'https://i.y.qq.com' // 限定QQ音乐域名，更安全
      );
      hasPlayed.current = true; // 只播放一次
      document.removeEventListener('click', handlePageClick); // 移除监听
    };

    // 全局监听首次点击
    document.addEventListener('click', handlePageClick);

    // 组件卸载时清理监听
    return () => {
      document.removeEventListener('click', handlePageClick);
    };
  }, []);

  // 原有代码完全不变，仅给iframe加ref属性
  if (typeof window === 'undefined') return null;
  return (
    <div className={styles.playerContainer}>
      <iframe 
        ref={iframeRef} // 仅新增这一行
        frameBorder="no" 
        border="0" 
        marginWidth="0" 
        marginHeight="0" 
        width={320} 
        height={65} 
        src="https://i.y.qq.com/n2/m/outchain/player/index.html?songid=1247347&songtype=0&autoplay=1"
        title="QQ音乐播放器"
        className={styles.playerIframe}
        allow="autoplay; encrypted-media" // 仅新增：允许自动播放权限
      ></iframe>
    </div>
  );
}
