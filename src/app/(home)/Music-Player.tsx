// src/app/(home)/Music-Player.tsx
'use client';
import React, { useState, useRef, useEffect } from 'react';
import styles from './Music-Player.module.css';

// 歌曲配置：和截图完全一致
const SONG_CONFIG = {
  cover: 'https://p11-flow-imagex-sign.byteimg.com/tos-cn-i-a9rns2rl98/ef674e35da5145e29d93e23aa8864f4e.png~tplv-a9rns2rl98-image.png', // 截图里的封面图
  name: 'I Really W', // 歌曲名
  duration: '04:06', // 总时长
  songId: '106958339', // QQ音乐songid（作者给的）
};

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressInterval = useRef<number | null>(null);

  // 播放/暂停切换
  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      // 暂停
      audioRef.current.pause();
      clearInterval(progressInterval.current!);
      setIsPlaying(false);
    } else {
      // 播放
      audioRef.current.play();
      setIsPlaying(true);
      // 模拟进度条走动（和QQ音乐播放器一致）
      progressInterval.current = window.setInterval(() => {
        progressRef.current += 0.1;
        if (progressRef.current >= 100) {
          clearInterval(progressInterval.current!);
          progressRef.current = 0;
          setIsPlaying(false);
        }
        setProgress(progressRef.current);
      }, 100);
    }
  };

  // 卸载组件清除定时器
  useEffect(() => {
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, []);

  // 仅在客户端渲染
  if (typeof window === 'undefined') return null;

return (
  {/* 外层毛玻璃+雪顶容器（和图二页面一致） */}
  <div className={styles.playerContainer}>
    {/* 雪顶装饰（复刻图二积雪） */}
    <div className={styles.snowTop}></div>
    
    {/* 核心：1:1复刻截图里的播放器样式 */}
    <div className={styles.qqPlayer}>
        {/* 左侧封面+播放按钮 */}
        <div className={styles.coverBox} onClick={togglePlay}>
          <img src={SONG_CONFIG.cover} alt="歌曲封面" className={styles.cover} />
          <div className={styles.playBtn}>{isPlaying ? '❚❚' : '▶'}</div>
        </div>

        {/* 中间：进度条+时间 */}
        <div className={styles.progressArea}>
          <div className={styles.timeText}>00:00</div>
          <div className={styles.progressBar}>
            <div 
              className={styles.progress} 
              style={{ width: `${progress}%` }}
            >
              <div className={styles.progressDot}></div>
            </div>
          </div>
        </div>

        {/* 右侧：歌曲名+总时长 */}
        <div className={styles.songInfoArea}>
          <div className={styles.songName}>{SONG_CONFIG.name}</div>
          <div className={styles.totalTime}>{SONG_CONFIG.duration}</div>
        </div>

        {/* 隐藏的真实音频（对接QQ音乐，可选） */}
        <audio
          ref={audioRef}
          src={`https://i.y.qq.com/v8/playsong.html?songid=${SONG_CONFIG.songId}&songtype=0#webchat_redirect`}
          onEnded={() => {
            setIsPlaying(false);
            progressRef.current = 0;
            setProgress(0);
            clearInterval(progressInterval.current!);
          }}
        />
      </div>
    </div>
  );
}
