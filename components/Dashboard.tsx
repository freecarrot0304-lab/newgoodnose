
import React from 'react';
import { 
  CheckCircle2, 
  ShoppingBag, 
  Droplet, 
  PlusCircle,
  Wind,
  Activity,
  CalendarDays,
  Settings2
} from 'lucide-react';
import { AppState, Settings, MedicationLog, SneezingLevel, RunnyNoseLevel, ExerciseType } from '../types';

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

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateSettings({ ...state.settings, startDate: e.target.value });
  };

  const handleTotalBottlesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateSettings({ ...state.settings, totalBottles: parseInt(e.target.value) });
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
      
      {/* 1. 脱敏治疗配置 (New Section from Settings) */}
      <div className="bg-white rounded-[32px] p-5 shadow-sm border border-gray-100 space-y-3">
        <div className="flex items-center gap-2">
            <Settings2 size={16} className="text-blue-400" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">脱敏配置</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-600">
            <CalendarDays size={14} />
            <span className="text-xs font-bold">起始日期</span>
          </div>
          <input 
            type="date" 
            value={state.settings.startDate}
            onChange={handleStartDateChange}
            className="bg-gray-50 border-none text-[10px] font-black text-blue-600 px-3 py-1.5 rounded-xl focus:ring-0 appearance-none"
          />
        </div>
      </div>

      {/* 2. 今日滴药确认区 */}
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

      {/* 3. 症状实时记录模块 */}
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

      {/* 4. 运动强度模块 */}
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

      {/* 5. 药量控制滑动条 */}
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
        <div className="px-1 space-y-4">
          <input 
            type="range" 
            min="0" 
            max={state.settings.totalBottles} 
            step="0.2" 
            value={inventoryValue} 
            onChange={handleSliderChange}
            className="w-full h-2.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex items-center justify-between pt-2 border-t border-gray-50">
             <span className="text-[10px] font-bold text-gray-300">库存上限 (瓶)</span>
             <input 
                type="number" 
                value={state.settings.totalBottles}
                onChange={handleTotalBottlesChange}
                className="w-12 bg-transparent text-right text-[10px] font-black text-gray-400 focus:outline-none"
             />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
