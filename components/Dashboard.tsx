
import React from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  ShoppingBag, 
  Droplet, 
  ClipboardList, 
  PlusCircle,
  BellRing,
  Wind,
  Activity
} from 'lucide-react';
import { AppState, Settings, MedicationLog, SneezingLevel, RunnyNoseLevel, CongestionLevel, ExerciseType } from '../types';

interface DashboardProps {
  state: AppState;
  onOpenForm: () => void;
  onQuickConfirm: () => void;
  onUpdateSettings: (settings: Settings) => void;
  onSaveLog: (data: Omit<MedicationLog, 'id' | 'timestamp' | 'dateString' | 'season'>) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ state, onOpenForm, onQuickConfirm, onUpdateSettings, onSaveLog }) => {
  const today = new Date().toISOString().split('T')[0];
  const todayLog = state.logs.find(log => log.dateString === today);
  const isTaken = todayLog?.medicationTaken || false;
  
  const inventoryValue = state.settings.inventoryCount;
  const inventoryColor = inventoryValue <= 1 ? 'text-red-500' : inventoryValue <= 3 ? 'text-yellow-500' : 'text-blue-600';

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = parseFloat(e.target.value);
    onUpdateSettings({ ...state.settings, inventoryCount: newVal });
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateSettings({ ...state.settings, reminderTime: e.target.value });
  };

  const handleSymptomUpdate = (key: 'sneezing' | 'runnyNose' | 'congestion', val: any) => {
    const currentSymptoms = todayLog?.symptoms || { sneezing: '轻微', runnyNose: '干爽的一天', congestion: '几乎是正常人' };
    onSaveLog({
        medicationTaken: isTaken,
        treatments: todayLog?.treatments || { antiHistamine: false, nasalSpray: false, nasalWash: false },
        symptoms: { ...currentSymptoms, [key]: val },
        exercise: todayLog?.exercise || '未运动'
    });
  };

  const handleExerciseUpdate = (val: ExerciseType) => {
    onSaveLog({
        medicationTaken: isTaken,
        treatments: todayLog?.treatments || { antiHistamine: false, nasalSpray: false, nasalWash: false },
        symptoms: todayLog?.symptoms || null,
        exercise: val
    });
  };

  return (
    <div className="h-full px-5 py-4 flex flex-col gap-3 overflow-y-auto pb-10">
      {/* 1. 今日滴药确认区 */}
      <div className="bg-white rounded-[32px] p-4 shadow-sm border border-gray-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${isTaken ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-blue-500'}`}>
                {isTaken ? <CheckCircle2 size={24} /> : <Droplet size={24} className="animate-pulse" />}
            </div>
            <div>
                <h2 className="text-sm font-black text-gray-900">滴药确认</h2>
                <p className={`text-[10px] font-bold ${isTaken ? 'text-green-600' : 'text-gray-400'}`}>
                    {isTaken ? '今日已完成' : '还没滴药哦'}
                </p>
            </div>
        </div>
        {!isTaken && (
          <button 
            onClick={onQuickConfirm}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-2xl font-black text-xs active:scale-95 transition-all shadow-lg shadow-blue-100"
          >
            确认滴药
          </button>
        )}
      </div>

      {/* 2. 症状实时记录模块 (恢复设计的模块) */}
      <div className="bg-white rounded-[32px] p-5 shadow-sm border border-gray-100 space-y-4">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Wind size={16} className="text-orange-500" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">病症监控</span>
            </div>
            <button onClick={onOpenForm} className="text-blue-600"><PlusCircle size={16} /></button>
        </div>
        
        <div className="space-y-3">
            <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-gray-300">打喷嚏</span>
                <div className="grid grid-cols-3 gap-1.5">
                    {(['轻微', '能忍', '打到头晕'] as SneezingLevel[]).map(l => (
                        <button 
                            key={l} 
                            onClick={() => handleSymptomUpdate('sneezing', l)}
                            className={`py-2 text-[9px] font-black rounded-xl transition-all border ${todayLog?.symptoms?.sneezing === l ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-gray-50 text-gray-400 border-transparent'}`}
                        >
                            {l}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-gray-300">流鼻涕</span>
                <div className="grid grid-cols-3 gap-1.5">
                    {(['干爽的一天', '半包纸巾', '干翻了两包'] as RunnyNoseLevel[]).map(l => (
                        <button 
                            key={l} 
                            onClick={() => handleSymptomUpdate('runnyNose', l)}
                            className={`py-2 text-[9px] font-black rounded-xl transition-all border ${todayLog?.symptoms?.runnyNose === l ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-gray-50 text-gray-400 border-transparent'}`}
                        >
                            {l}
                        </button>
                    ))}
                </div>
            </div>
        </div>
      </div>

      {/* 3. 运动强度模块 (恢复设计的模块) */}
      <div className="bg-white rounded-[32px] p-5 shadow-sm border border-gray-100 space-y-3">
        <div className="flex items-center gap-2">
            <Activity size={16} className="text-green-500" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">今日运动</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
            {(['跑步', '游泳', '骑车', '力量', '未运动'] as ExerciseType[]).map(e => (
                <button 
                    key={e} 
                    onClick={() => handleExerciseUpdate(e)}
                    className={`px-3 py-2 text-[9px] font-black rounded-xl transition-all border ${todayLog?.exercise === e ? 'bg-green-500 text-white border-green-500 shadow-sm' : 'bg-gray-50 text-gray-400 border-transparent'}`}
                >
                    {e}
                </button>
            ))}
        </div>
      </div>

      {/* 4. 药量控制滑动条 */}
      <div className="bg-white rounded-[32px] p-5 shadow-sm border border-gray-100 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-blue-500" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">药量实时库存</span>
          </div>
          <span className={`text-xl font-black ${inventoryColor}`}>
            {inventoryValue.toFixed(1)} <span className="text-[10px] font-bold text-gray-400">瓶</span>
          </span>
        </div>
        <div className="px-1">
          <input 
            type="range" 
            min="0" 
            max={state.settings.totalBottles} 
            step="0.2" 
            value={inventoryValue} 
            onChange={handleSliderChange}
            className="w-full h-2.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-blue-600"
          />
        </div>
      </div>

      {/* 5. 提醒时间快速设置 */}
      <div className="bg-white rounded-[32px] p-4 shadow-sm border border-gray-100 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-amber-100 p-2 rounded-2xl text-amber-600">
            <BellRing size={18} />
          </div>
          <div>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">系统闹铃时间</p>
            <p className="text-[10px] text-gray-400 font-bold">每日准时提醒</p>
          </div>
        </div>
        <input 
          type="time" 
          value={state.settings.reminderTime}
          onChange={handleTimeChange}
          className="bg-gray-50 text-gray-900 font-black text-xl px-4 py-2 rounded-2xl border-none focus:ring-4 focus:ring-blue-50 outline-none appearance-none transition-all"
        />
      </div>
    </div>
  );
};

export default Dashboard;
