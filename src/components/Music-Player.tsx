// src/components/Music-Player.tsx
import MusicPlayer from '../components/Music-Player';

// 定义组件属性类型（支持动态扩展）
interface MusicPlayerProps {
  songId?: string; // 歌曲ID，可动态切换
  width?: number | string; // 播放器宽度
  height?: number | string; // 播放器高度
  className?: string; // 自定义样式类名
}

// 播放器组件（FC + TypeScript 类型约束）
const MusicPlayer: FC<MusicPlayerProps> = ({
  songId = '106958339',
  width = 320,
  height = 65,
  className = '',
}) => {
  // 拼接QQ音乐站外播放链接
  const playerSrc = `https://i.y.qq.com/v8/playsong.html?songid=${songId}&songtype=0#webchat_redirect`;

  return (
    <div className={`music-player-container ${className}`}>
      <iframe
        frameBorder="no"
        border="0"
        marginWidth="0"
        marginHeight="0"
        width={width}
        height={height}
        src={playerSrc}
        title="QQ音乐播放器" // 符合Next.js/React可访问性规范
        loading="lazy" // 懒加载优化性能
        // 防止iframe内容溢出（可选）
        style={{ border: 'none', borderRadius: '4px' }}
      />
    </div>
  );
};

export default Music-Player;
