
import React, { useMemo } from 'react';
import { MedicationLog, Season, SneezingLevel, RunnyNoseLevel, CongestionLevel } from '../types';
import { Wind, CheckCircle2, Circle, BarChart3, TrendingUp } from 'lucide-react';

interface HistoryViewProps {
  logs: MedicationLog[];
  onClear: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ logs, onClear }) => {
  const seasons: Season[] = ['春', '夏', '秋', '冬'];

  const seasonalStats = useMemo(() => {
    const stats: Record<Season, any> = {
      '春': { total: 0, sneezing: {}, runnyNose: {}, congestion: {} },
      '夏': { total: 0, sneezing: {}, runnyNose: {}, congestion: {} },
      '秋': { total: 0, sneezing: {}, runnyNose: {}, congestion: {} },
      '冬': { total: 0, sneezing: {}, runnyNose: {}, congestion: {} },
    };

    logs.forEach(log => {
      if (!log.symptoms) return;
      const s = log.season;
      stats[s].total++;
      
      const { sneezing, runnyNose, congestion } = log.symptoms;
      stats[s].sneezing[sneezing] = (stats[s].sneezing[sneezing] || 0) + 1;
      stats[s].runnyNose[runnyNose] = (stats[s].runnyNose[runnyNose] || 0) + 1;
      stats[s].congestion[congestion] = (stats[s].congestion[congestion] || 0) + 1;
    });

    return stats;
  }, [logs]);

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 p-10 text-center">
        <Wind size={48} strokeWidth={1} className="mb-4 opacity-20" />
        <p className="text-sm font-medium">暂无历史记录</p>
      </div>
    );
  }

  const renderStatBar = (label: string, data: Record<string, number>, total: number, levels: string[], colors: string[]) => {
    if (total === 0) return null;
    return (
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{label}</span>
          <span className="text-[8px] font-bold text-gray-300">分布情况</span>
        </div>
        <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden flex shadow-inner">
          {levels.map((level, idx) => {
            const count = data[level] || 0;
            const percentage = (count / total) * 100;
            if (percentage === 0) return null;
            return (
              <div 
                key={level} 
                style={{ width: `${percentage}%` }} 
                className={`${colors[idx]} h-full transition-all duration-500`}
                title={`${level}: ${Math.round(percentage)}%`}
              />
            );
          })}
        </div>
        <div className="flex gap-2 flex-wrap">
           {levels.map((level, idx) => {
             const count = data[level] || 0;
             if (count === 0) return null;
             return (
               <div key={level} className="flex items-center gap-1">
                 <div className={`w-1.5 h-1.5 rounded-full ${colors[idx]}`} />
                 <span className="text-[8px] font-bold text-gray-500">{level} {Math.round((count/total)*100)}%</span>
               </div>
             )
           })}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full px-4 py-4 space-y-6 overflow-y-auto pb-20">
      {/* 1. 季节性统计分析面板 */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <BarChart3 size={18} className="text-blue-600" />
          <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">季节性症状统计</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {seasons.map(season => {
            const stats = seasonalStats[season];
            if (stats.total === 0) return null;

            return (
              <div key={season + '-stats'} className="bg-white rounded-[32px] p-5 shadow-sm border border-gray-100 space-y-5 animate-in fade-in slide-in-from-top-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-black text-xs">
                      {season}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-gray-900">{season}季分析</h4>
                      <p className="text-[9px] font-bold text-gray-400">共 {stats.total} 条症状记录</p>
                    </div>
                  </div>
                  <TrendingUp size={16} className="text-blue-100" />
                </div>

                <div className="space-y-4 pt-1">
                  {renderStatBar(
                    '打喷嚏频率', 
                    stats.sneezing, 
                    stats.total, 
                    ['轻微', '能忍', '打到头晕'], 
                    ['bg-green-400', 'bg-amber-400', 'bg-red-500']
                  )}
                  {renderStatBar(
                    '流鼻涕情况', 
                    stats.runnyNose, 
                    stats.total, 
                    ['干爽的一天', '半包纸巾', '干翻了两包'], 
                    ['bg-blue-400', 'bg-indigo-500', 'bg-purple-600']
                  )}
                  {renderStatBar(
                    '鼻塞严重度', 
                    stats.congestion, 
                    stats.total, 
                    ['几乎是正常人', '一只可用', '憋死我了'], 
                    ['bg-emerald-400', 'bg-orange-400', 'bg-rose-600']
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. 原始记录时间轴 */}
      <div className="pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">详细病程时间轴</h3>
          <button onClick={() => { if(confirm('确定要永久清除所有记录吗？')) onClear(); }} className="text-red-500 text-[10px] font-bold uppercase tracking-tighter bg-red-50 px-3 py-1 rounded-full">清除全部记录</button>
        </div>

        {seasons.map(season => {
          const seasonLogs = logs.filter(l => l.season === season);
          if (seasonLogs.length === 0) return null;

          return (
            <section key={season} className="space-y-3 mb-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="h-px flex-1 bg-gray-100"></span>
                <h4 className="text-[9px] font-black text-blue-500/50 uppercase tracking-[0.2em]">{season}季流水</h4>
                <span className="h-px flex-1 bg-gray-100"></span>
              </div>
              
              <div className="space-y-2">
                {seasonLogs.map(log => (
                  <div key={log.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3 active:scale-[0.98] transition-all">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        {log.medicationTaken ? (
                          <div className="bg-green-100 p-1 rounded-lg">
                            <CheckCircle2 size={14} className="text-green-600" />
                          </div>
                        ) : (
                          <div className="bg-gray-100 p-1 rounded-lg">
                            <Circle size={14} className="text-gray-300" />
                          </div>
                        )}
                        <div className="font-bold text-gray-900 text-sm">
                          {new Date(log.timestamp).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', weekday: 'short' })}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 justify-end max-w-[120px]">
                        {log.treatments.antiHistamine && <span className="text-[7px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-lg font-black uppercase">抗组药</span>}
                        {log.treatments.nasalSpray && <span className="text-[7px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded-lg font-black uppercase">鼻喷</span>}
                        {log.exercise !== '未运动' && <span className="text-[7px] bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded-lg font-black uppercase">{log.exercise}</span>}
                      </div>
                    </div>
                    
                    {log.symptoms ? (
                      <div className="grid grid-cols-3 gap-2 border-t pt-3 border-gray-50">
                        <div className="text-center">
                          <p className="text-[7px] text-gray-300 font-bold uppercase tracking-tighter">喷嚏</p>
                          <p className={`text-[10px] font-black mt-0.5 ${log.symptoms.sneezing === '打到头晕' ? 'text-red-500' : 'text-gray-600'}`}>{log.symptoms.sneezing}</p>
                        </div>
                        <div className="text-center border-x border-gray-50 px-1">
                          <p className="text-[7px] text-gray-300 font-bold uppercase tracking-tighter">涕量</p>
                          <p className={`text-[10px] font-black mt-0.5 ${log.symptoms.runnyNose === '干翻了两包' ? 'text-red-500' : 'text-gray-600'}`}>{log.symptoms.runnyNose}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[7px] text-gray-300 font-bold uppercase tracking-tighter">鼻塞</p>
                          <p className={`text-[10px] font-black mt-0.5 ${log.symptoms.congestion === '憋死我了' ? 'text-red-500' : 'text-gray-600'}`}>{log.symptoms.congestion}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-[10px] text-gray-300 italic pt-1 font-medium">当日仅记录用药</div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default HistoryView;
