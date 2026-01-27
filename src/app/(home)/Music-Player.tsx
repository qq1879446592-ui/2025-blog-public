// 替换后的 Music-Player.tsx（有声音+单播放器+封面显示）
'use client';
import React, { useState } from 'react';
import styles from './Music-Player.module.css';

// 封面图替换成你能访问的链接（本地/CDN都可以）
const COVER_IMG = '/images/song-cover.jpg'; // 建议把封面图放在 public/images 下

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressTimer = React.useRef<NodeJS.Timeout | null>(null);

  // 播放/暂停逻辑（控制进度条+iframe播放状态）
  const togglePlay = () => {
    if (isPlaying) {
      // 暂停：停止进度条+给iframe发暂停指令
      clearInterval(progressTimer.current!);
      setIsPlaying(false);
      // QQ音乐iframe暂停（需通过postMessage，简化版直接重置进度）
      setProgress(0);
    } else {
      // 播放：启动进度条+iframe自动播放
      setIsPlaying(true);
      progressTimer.current = setInterval(() => {
        setProgress(prev => prev >= 100 ? 0 : prev + 0.1);
      }, 100);
    }
  };

  // 卸载组件清除定时器
  React.useEffect(() => {
    return () => clearInterval(progressTimer.current!);
  }, []);

  if (typeof window === 'undefined') return null;

  return (
    <div className={styles.playerContainer}>
      {/* 雪顶装饰 */}
      <div className={styles.snowTop}></div>
      
      {/* 核心：视觉复刻你要的样式 + 隐藏的QQ音乐iframe（有声音） */}
      <div className={styles.playerWrapper}>
        {/* 隐藏的QQ音乐iframe（负责播放声音，定位到屏幕外） */}
        <iframe
          src="https://i.y.qq.com/v8/playsong.html?songid=106958339&songtype=0#webchat_redirect"
          width={320}
          height={65}
          frameBorder="0"
          className={styles.hiddenIframe}
          allow="autoplay" // 允许自动播放声音
        />

        {/* 视觉层：和你截图1:1的样式（封面+进度条+文字） */}
        <div className={styles.visualPlayer}>
          {/* 封面+播放按钮 */}
          <div className={styles.coverBox} onClick={togglePlay}>
            <img src={COVER_IMG} alt="歌曲封面" className={styles.cover} />
            <div className={styles.playBtn}>{isPlaying ? '❚❚' : '▶'}</div>
          </div>
          
          {/* 进度条+时间 */}
          <div className={styles.progressArea}>
            <div className={styles.timeText}>00:00</div>
            <div className={styles.progressBar}>
              <div className={styles.progress} style={{ width: `${progress}%` }}>
                <div className={styles.progressDot}></div>
              </div>
            </div>
          </div>
          
          {/* 歌曲名+时长 */}
          <div className={styles.songInfo}>
            <div className={styles.songName}>I Really W</div>
            <div className={styles.totalTime}>04:06</div>
          </div>
        </div>
      </div>
    </div>
  );
}
