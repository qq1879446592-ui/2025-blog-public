import React, { FC, useRef, useEffect } from 'react';

import './MusicPlayer.css'; // 可选：引入独立的样式文件

// 定义播放器组件的属性类型（当前无自定义属性，可扩展）
interface MusicPlayerProps {
  songId?: string; // 可选：扩展歌曲ID属性，方便动态切换歌曲
  width?: number | string; // 可选：自定义宽度
  height?: number | string; // 可选：自定义高度
}

// 函数式组件（FC）+ TypeScript 类型约束
const MusicPlayer: FC<MusicPlayerProps> = ({
  songId = '106958339', // 默认歌曲ID
  width = 320, // 默认宽度
  height = 65, // 默认高度
}) => {
  // 拼接QQ音乐播放器链接（支持动态替换songId）
  const playerSrc = `https://i.y.qq.com/v8/playsong.html?songid=${songId}&songtype=0#webchat_redirect`;

  return (
    <div className="music-player-container">
      <iframe
        frameBorder="no"
        border="0"
        marginWidth="0"
        marginHeight="0"
        width={width}
        height={height}
        src={playerSrc}
        title="QQ音乐播放器" // 必加：提升可访问性，符合React规范
        loading="lazy" // 可选：懒加载，优化页面性能
      />
    </div>
  );
};

// 导出组件，方便在其他页面引入
export default MusicPlayer;
