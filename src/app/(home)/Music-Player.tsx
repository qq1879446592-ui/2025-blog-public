// src/app/(home)/Music-Player.tsx
import React, { FC, useRef, useEffect } from 'react';

interface MusicPlayerProps {
  songId?: string;
  width?: number | string;
  height?: number | string;
}

const MusicPlayer: FC<MusicPlayerProps> = ({
  songId = '106958339',
  width = 320,
  height = 65,
}) => {
  const isClient = typeof window !== 'undefined';
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.src = `https://i.y.qq.com/v8/playsong.html?songid=${songId}&songtype=0#webchat_redirect`;
    }
  }, [songId]);

  if (!isClient) return null;

  return (
    <iframe
      ref={iframeRef}
      frameBorder="no"
      border="0"
      marginWidth="0"
      marginHeight="0"
      width={width}
      height={height}
      title="QQ音乐播放器"
      loading="lazy"
      src=""
      style={{ border: 'none' }}
    />
  );
};

export default MusicPlayer; // 必加！默认导出
