
import React, { useState } from 'react';
import { X, Save, Droplets, Wind, Activity } from 'lucide-react';
import { SneezingLevel, RunnyNoseLevel, CongestionLevel, ExerciseType, MedicationLog } from '../types';

interface LogFormProps {
  initialMedicationTaken: boolean;
  onSave: (data: Omit<MedicationLog, 'id' | 'timestamp' | 'dateString' | 'season'>) => void;
  onClose: () => void;
}

const LogForm: React.FC<LogFormProps> = ({ initialMedicationTaken, onSave, onClose }) => {
  const [medicationTaken, setMedicationTaken] = useState(initialMedicationTaken);
  const [antiHistamine, setAntiHistamine] = useState(false);
  const [nasalSpray, setNasalSpray] = useState(false);
  const [nasalWash, setNasalWash] = useState(false);
  const [sneezing, setSneezing] = useState<SneezingLevel>('轻微');
  const [runnyNose, setRunnyNose] = useState<RunnyNoseLevel>('干爽的一天');
  const [congestion, setCongestion] = useState<CongestionLevel>('几乎是正常人');
  const [exercise, setExercise] = useState<ExerciseType>('未运动');

  const handleConfirm = () => {
    onSave({
      medicationTaken,
      treatments: { antiHistamine, nasalSpray, nasalWash },
      symptoms: { sneezing, runnyNose, congestion },
      exercise
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F2F2F7] overflow-hidden animate-in slide-in-from-bottom duration-300">
      <div className="bg-white h-full flex flex-col max-w-md mx-auto relative shadow-2xl">
        <header className="px-6 pt-12 pb-4 border-b border-gray-50 flex justify-between items-center shrink-0">
          <button onClick={onClose} className="text-gray-400 font-bold text-sm">取消</button>
          <h2 className="text-lg font-black">详细日志</h2>
          <button onClick={handleConfirm} className="text-blue-600 font-black text-sm">完成</button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Medication Toggle */}
          <section className="bg-blue-600 p-5 rounded-[32px] flex items-center justify-between shadow-lg shadow-blue-100">
            <div className="flex items-center gap-3 text-white">
              <div className="bg-white/20 p-2 rounded-xl"><Droplets size={20}/></div>
              <span className="font-bold text-sm tracking-tight">今日已滴药水？</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={medicationTaken} onChange={(e) => setMedicationTaken(e.target.checked)} className="sr-only peer"/>
              <div className="w-14 h-7 bg-white/20 rounded-full peer peer-checked:bg-white peer-checked:after:translate-x-7 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white peer-checked:after:bg-blue-600 after:rounded-full after:h-6 after:w-6 after:transition-all"></div>
            </label>
          </section>

          {/* Treatment */}
          <section className="space-y-3">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">辅助治疗</h3>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => setAntiHistamine(!antiHistamine)} className={`py-4 px-1 rounded-2xl border-2 transition-all text-[10px] font-bold ${antiHistamine ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-50 bg-gray-50 text-gray-400'}`}>
                服用抗阻药
              </button>
              <button onClick={() => setNasalSpray(!nasalSpray)} className={`py-4 px-1 rounded-2xl border-2 transition-all text-[10px] font-bold ${nasalSpray ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-50 bg-gray-50 text-gray-400'}`}>
                使用鼻喷
              </button>
              <button onClick={() => setNasalWash(!nasalWash)} className={`py-4 px-1 rounded-2xl border-2 transition-all text-[10px] font-bold ${nasalWash ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-50 bg-gray-50 text-gray-400'}`}>
                生理洗鼻
              </button>
            </div>
          </section>

          {/* Symptoms */}
          <section className="space-y-6">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">症状监控</h3>
            <div className="space-y-5">
              <div className="bg-gray-50 p-4 rounded-3xl space-y-3">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-tighter block">打喷嚏</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['轻微', '能忍', '打到头晕'] as SneezingLevel[]).map(l => (
                    <button key={l} onClick={() => setSneezing(l)} className={`py-3 text-[10px] rounded-xl font-bold transition-all ${sneezing === l ? 'bg-white text-blue-600 shadow-sm border border-blue-100' : 'text-gray-400'}`}>{l}</button>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-3xl space-y-3">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-tighter block">流鼻涕</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['干爽的一天', '半包纸巾', '干翻了两包'] as RunnyNoseLevel[]).map(l => (
                    <button key={l} onClick={() => setRunnyNose(l)} className={`py-3 text-[10px] rounded-xl font-bold transition-all ${runnyNose === l ? 'bg-white text-blue-600 shadow-sm border border-blue-100' : 'text-gray-400'}`}>{l}</button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Exercise */}
          <section className="space-y-3">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">运动强度</h3>
            <div className="flex flex-wrap gap-2">
              {(['跑步', '游泳', '骑车', '力量', '未运动'] as ExerciseType[]).map(e => (
                <button key={e} onClick={() => setExercise(e)} className={`px-4 py-3 text-[10px] rounded-2xl font-bold transition-all border-2 ${exercise === e ? 'bg-orange-500 text-white border-orange-500 shadow-md' : 'bg-gray-50 text-gray-400 border-transparent'}`}>{e}</button>
              ))}
            </div>
          </section>
        </div>

        <footer className="p-6 bg-white shrink-0 safe-area-bottom">
          <button onClick={handleConfirm} className="w-full py-4 bg-blue-600 text-white rounded-[24px] font-black shadow-xl shadow-blue-100 text-base active:scale-95 transition-all">
            保存记录
          </button>
        </footer>
      </div>
    </div>
  );
};

export default LogForm;
