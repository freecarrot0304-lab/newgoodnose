
import React, { useEffect, useRef } from 'react';
import { Bell, X, Check, Clock, Volume2 } from 'lucide-react';

interface ReminderOverlayProps {
  sound: string;
  onConfirm: () => void;
  onSnooze: (minutes: number) => void;
  onClose: () => void;
}

const ReminderOverlay: React.FC<ReminderOverlayProps> = ({ sound, onConfirm, onSnooze, onClose }) => {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  // 模拟警报声 (使用 Web Audio API 产生高频哔哔声)
  const startAlarmSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = ctx;
      
      const playBeep = () => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'square'; // 尖锐的方波
        osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 频率
        
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      };

      // 循环播放
      const interval = setInterval(playBeep, 800);
      return interval;
    } catch (e) {
      console.error("Audio error", e);
      return null;
    }
  };

  useEffect(() => {
    // 触发震动 (iOS 必须在用户交互后或特定条件下)
    const vibrate = () => {
      if ('vibrate' in navigator) {
        navigator.vibrate([500, 200, 500, 200, 500]);
      }
    };
    
    vibrate();
    const soundInterval = startAlarmSound();
    const vibrateInterval = setInterval(vibrate, 2000);

    return () => {
      if (soundInterval) clearInterval(soundInterval);
      if (vibrateInterval) clearInterval(vibrateInterval);
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/60 backdrop-blur-xl animate-in fade-in duration-500">
      <div className="bg-white w-full h-[90vh] sm:h-auto sm:max-w-sm rounded-t-[40px] sm:rounded-[40px] p-8 shadow-2xl flex flex-col items-center text-center space-y-8 relative overflow-hidden animate-in slide-in-from-bottom-full duration-500">
        
        {/* 顶部装饰条 (iOS 抽屉风格) */}
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mb-4 opacity-50" />

        <div className="w-24 h-24 bg-red-500 text-white rounded-[32px] flex items-center justify-center animate-pulse shadow-2xl shadow-red-200 relative">
          <Bell size={48} strokeWidth={2.5} className="animate-bounce" />
          <div className="absolute -inset-4 bg-red-500/20 rounded-full animate-ping" />
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">用药时间到</h2>
          <p className="text-gray-500 font-bold flex items-center justify-center gap-2">
            <Volume2 size={16} /> 正在播放：{sound}
          </p>
        </div>

        <div className="w-full space-y-4 pt-4">
          <button 
            onClick={() => { onConfirm(); onClose(); }}
            className="w-full py-6 bg-blue-600 text-white rounded-[24px] font-black text-xl flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-blue-200"
          >
            <Check size={28} /> 确认滴药
          </button>
          
          <div className="grid grid-cols-1 gap-3">
            <button 
              onClick={() => onSnooze(15)}
              className="py-5 bg-gray-100 text-gray-700 rounded-[24px] font-bold text-base flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Clock size={20} /> 15 分钟后再响
            </button>
            <button 
              onClick={onClose}
              className="py-4 text-gray-400 font-bold text-sm active:opacity-50"
            >
              稍后处理
            </button>
          </div>
        </div>

        <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest pb-4">
          AllerEase Pro • 智能提醒系统
        </p>
      </div>
    </div>
  );
};

export default ReminderOverlay;
