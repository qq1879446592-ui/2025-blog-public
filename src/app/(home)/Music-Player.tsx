'use client';
import React from 'react';
import styles from './Music-Player.module.css';

export default function MusicPlayer() {
  if (typeof window === 'undefined') return null;

  return (
    <div className={styles.playerContainer}>
      <div className={styles.snowTop}></div>
      <iframe 
        frameBorder="no" 
        border="0" 
        marginWidth="0" 
        marginHeight="0" 
        width={320} 
        height={65} 
        src="https://i.y.qq.com/n2/m/outchain/player/index.html?songid=106958339&songtype=0"
        title="QQ音乐播放器"
        className={styles.playerIframe}
      ></iframe>
    </div>
  );
}
