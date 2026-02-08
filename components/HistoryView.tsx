
import React from 'react';
import { MedicationLog, Season } from '../types';
import { Wind, CheckCircle2, Circle } from 'lucide-react';

interface HistoryViewProps {
  logs: MedicationLog[];
  onClear: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ logs, onClear }) => {
  const seasons: Season[] = ['春', '夏', '秋', '冬'];

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 p-10 text-center">
        <Wind size={48} strokeWidth={1} className="mb-4 opacity-20" />
        <p className="text-sm font-medium">暂无历史记录</p>
      </div>
    );
  }

  return (
    <div className="h-full px-4 py-4 space-y-6 overflow-y-auto pb-4">
      <div className="flex justify-between items-center">
        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">病程时间轴</h3>
        <button onClick={() => { if(confirm('清除所有数据？')) onClear(); }} className="text-red-500 text-[10px] font-bold uppercase">清除记录</button>
      </div>

      {seasons.map(season => {
        const seasonLogs = logs.filter(l => l.season === season);
        if (seasonLogs.length === 0) return null;

        return (
          <section key={season} className="space-y-3">
            <h4 className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full w-fit">{season}季总结</h4>
            <div className="space-y-2">
              {seasonLogs.map(log => (
                <div key={log.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {log.medicationTaken ? (
                        <CheckCircle2 size={16} className="text-green-500" />
                      ) : (
                        <Circle size={16} className="text-gray-200" />
                      )}
                      <div className="font-bold text-gray-900 text-sm">
                        {new Date(log.timestamp).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', weekday: 'short' })}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 justify-end max-w-[100px]">
                      {log.treatments.antiHistamine && <span className="text-[7px] bg-blue-50 text-blue-600 px-1 py-0.5 rounded font-bold">抗阻药</span>}
                      {log.treatments.nasalSpray && <span className="text-[7px] bg-indigo-50 text-indigo-600 px-1 py-0.5 rounded font-bold">鼻喷</span>}
                    </div>
                  </div>
                  
                  {log.symptoms ? (
                    <div className="grid grid-cols-3 gap-2 border-t pt-2 border-gray-50">
                      <div className="text-center">
                        <p className="text-[7px] text-gray-400 font-bold uppercase">打喷嚏</p>
                        <p className={`text-[9px] font-bold mt-0.5 ${log.symptoms.sneezing === '打到头晕' ? 'text-red-500' : 'text-gray-600'}`}>{log.symptoms.sneezing}</p>
                      </div>
                      <div className="text-center border-x border-gray-50">
                        <p className="text-[7px] text-gray-400 font-bold uppercase">流鼻涕</p>
                        <p className={`text-[9px] font-bold mt-0.5 ${log.symptoms.runnyNose === '干翻了两包' ? 'text-red-500' : 'text-gray-600'}`}>{log.symptoms.runnyNose}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[7px] text-gray-400 font-bold uppercase">鼻塞</p>
                        <p className={`text-[9px] font-bold mt-0.5 ${log.symptoms.congestion === '憋死我了' ? 'text-red-500' : 'text-gray-600'}`}>{log.symptoms.congestion}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-[9px] text-gray-400 italic pt-1">未记录具体症状</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default HistoryView;
