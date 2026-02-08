
import React from 'react';
import { Settings } from '../types';
import { Shield, Package, CalendarDays } from 'lucide-react';

interface SettingsViewProps {
  settings: Settings;
  onUpdate: (settings: Settings) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ settings, onUpdate }) => {
  const handleChange = (key: keyof Settings, value: any) => {
    onUpdate({ ...settings, [key]: value });
  };

  return (
    <div className="h-full px-4 py-4 space-y-4 overflow-y-auto pb-4">
      <section>
        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1 mb-2">基础信息</h3>
        <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 text-blue-600 p-2 rounded-xl"><CalendarDays size={18} /></div>
              <span className="text-sm font-medium">脱敏起始日期</span>
            </div>
            <input 
              type="date" 
              value={settings.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
              className="bg-gray-100 rounded-lg px-2 py-1 text-xs font-bold text-blue-600 focus:outline-none"
            />
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1 mb-2">药剂管理</h3>
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-4 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 text-orange-600 p-2 rounded-xl"><Package size={18} /></div>
              <span className="text-sm font-medium">剩余瓶数</span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => handleChange('inventoryCount', Math.max(0, parseFloat((settings.inventoryCount - 0.2).toFixed(1))))} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600">-</button>
              <span className="font-bold w-10 text-center text-sm">{settings.inventoryCount.toFixed(1)}</span>
              <button onClick={() => handleChange('inventoryCount', parseFloat((settings.inventoryCount + 0.2).toFixed(1)))} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600">+</button>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-gray-400 font-bold">
              <span>库存上限</span>
              <span>{settings.totalBottles} 瓶</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="20" 
              step="1"
              value={settings.totalBottles} 
              onChange={(e) => handleChange('totalBottles', parseInt(e.target.value))} 
              className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>
      </section>

      <div className="bg-white rounded-2xl p-4 flex items-center gap-3 border border-gray-100">
        <Shield size={16} className="text-gray-400" />
        <p className="text-[10px] text-gray-400 font-medium">所有数据保存在本地设备，保护您的健康隐私。</p>
      </div>
    </div>
  );
};

export default SettingsView;
