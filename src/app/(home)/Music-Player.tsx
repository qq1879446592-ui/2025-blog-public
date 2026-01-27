// src/app/(home)/Music-Player.tsx
'use client';
import React, { useState, useRef, useEffect } from 'react';
import styles from './Music-Player.module.css';

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressInterval = useRef<number | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      clearInterval(progressInterval.current!);
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
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

  useEffect(() => {
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, []);

  if (typeof window === 'undefined') return null;

  // 完全删掉所有注释，避免语法错误！
  return (
    <div className={styles.playerContainer}>
      <div className={styles.snowTop}></div>
      <div className={styles.qqPlayer}>
        <div className={styles.coverBox} onClick={togglePlay}>
          <img 
            src="https://p11-flow-imagex-sign.byteimg.com/tos-cn-i-a9rns2rl98/ef674e35da5145e29d93e23aa8864f4e.png~tplv-a9rns2rl98-image.png" 
            alt="歌曲封面" 
            className={styles.cover} 
          />
          <div className={styles.playBtn}>{isPlaying ? '❚❚' : '▶'}</div>
        </div>
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
        <div className={styles.songInfoArea}>
          <div className={styles.songName}>I Really W</div>
          <div className={styles.totalTime}>04:06</div>
        </div>
        <audio
          ref={audioRef}
          src="https://i.y.qq.com/v8/playsong.html?songid=106958339&songtype=0#webchat_redirect"
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
