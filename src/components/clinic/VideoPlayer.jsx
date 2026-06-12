import { useRef, useEffect } from "react";

export default function VideoPlayer({ videoUrl, bgColor, avatarInitial }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [videoUrl]);

  if (!videoUrl) {
    return (
      <div className={`w-full h-full bg-gradient-to-br ${bgColor} flex flex-col items-center justify-center`}>
        <div className="w-24 h-24 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-white text-5xl font-bold shadow-lg mb-4">
          {avatarInitial}
        </div>
        <p className="text-white/80 text-sm font-medium">動画準備中</p>
        <div className="mt-6 flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-white/60 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      src={videoUrl}
      className="w-full h-full object-cover"
      autoPlay
      loop
      muted
      playsInline
    />
  );
}
