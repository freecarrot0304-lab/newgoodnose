
import React, { useState, useEffect, useCallback } from 'react';
import { Clock, History, CloudSun, ShieldCheck, Loader2, MapPin } from 'lucide-react';
import { MedicationLog, Settings, AppState, Season } from './types';
import Dashboard from './components/Dashboard';
import HistoryView from './components/HistoryView';
import LogForm from './components/LogForm';
import { GoogleGenAI } from "@google/genai";

const STORAGE_KEY = 'allerease_v3_data';

const DEFAULT_SETTINGS: Settings = {
  inventoryCount: 5.0,
  totalBottles: 10,
  startDate: new Date().toISOString().split('T')[0],
};

const getSeason = (date: Date): Season => {
  const month = date.getMonth() + 1;
  if ([3, 4, 5].includes(month)) return '春';
  if ([6, 7, 8].includes(month)) return '夏';
  if ([9, 10, 11].includes(month)) return '秋';
  return '冬';
};

interface WeatherData {
  condition: string;
  temp: string;
  aqi: string;
  aqiLabel: string;
  locationName: string;
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history'>('dashboard');
  const [showLogForm, setShowLogForm] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        logs: parsed.logs || [],
        settings: { ...DEFAULT_SETTINGS, ...parsed.settings }
      };
    }
    return {
      logs: [],
      settings: DEFAULT_SETTINGS
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const fetchWeather = useCallback(async () => {
    if (!navigator.geolocation) return;
    setLoadingWeather(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const prompt = `Identify the specific city at coordinates ${latitude}, ${longitude}. 
        Then, fetch the current real-time temperature for this city from Moji Weather (墨迹天气) 
        and the current Air Quality Index (AQI) with its level (e.g., 优, 良) from IQAir (智空气/AirVisual). 
        Return strictly a JSON object: { "condition": "sunny/cloudy/etc", "temp": "25°C", "aqi": "45", "aqiLabel": "优", "locationName": "City Name" }.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt,
          config: { 
            responseMimeType: "application/json", 
            tools: [{ googleSearch: {} }] 
          }
        });

        const data = JSON.parse(response.text || '{}');
        if (data.temp && data.aqi) {
          setWeather(data);
        }
      } catch (err) {
        console.error('Weather fetch error:', err);
      } finally {
        setLoadingWeather(false);
      }
    }, () => setLoadingWeather(false));
  }, []);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  const handleQuickConfirm = useCallback(() => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const existingLogIdx = state.logs.findIndex(l => l.dateString === today);
    
    if (existingLogIdx > -1) {
      const updatedLogs = [...state.logs];
      updatedLogs[existingLogIdx] = { ...updatedLogs[existingLogIdx], medicationTaken: true };
      setState(prev => ({
        ...prev,
        logs: updatedLogs,
        settings: { ...prev.settings, inventoryCount: Math.max(0, parseFloat((prev.settings.inventoryCount - 0.2).toFixed(1))) },
      }));
    } else {
      const newLog: MedicationLog = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        dateString: today,
        medicationTaken: true,
        treatments: { antiHistamine: false, nasalSpray: false, nasalWash: false },
        symptoms: null,
        exercise: '未运动',
        season: getSeason(now)
      };
      setState(prev => ({
        ...prev,
        logs: [newLog, ...prev.logs],
        settings: { ...prev.settings, inventoryCount: Math.max(0, parseFloat((prev.settings.inventoryCount - 0.2).toFixed(1))) },
      }));
    }
  }, [state.logs, state.settings.inventoryCount]);

  const handleUpdateSettings = (newSettings: Settings) => {
    setState(prev => ({ ...prev, settings: newSettings }));
  };

  const handleSaveLog = useCallback((logData: Omit<MedicationLog, 'id' | 'timestamp' | 'dateString' | 'season'>) => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    setState(prev => {
      const existingLogIdx = prev.logs.findIndex(l => l.dateString === today);
      let updatedLogs = [...prev.logs];
      
      if (existingLogIdx > -1) {
        updatedLogs[existingLogIdx] = {
          ...updatedLogs[existingLogIdx],
          ...logData,
        };
      } else {
        const newLog: MedicationLog = {
          ...logData,
          id: Math.random().toString(36).substr(2, 9),
          timestamp: Date.now(),
          dateString: today,
          season: getSeason(now)
        };
        updatedLogs = [newLog, ...updatedLogs];
      }

      return {
        ...prev,
        logs: updatedLogs,
      };
    });
    setShowLogForm(false);
  }, []);

  const startDate = new Date(state.settings.startDate);
  const now = new Date();
  const diffDays = Math.ceil(Math.abs(now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) || 0;

  return (
    <div className="flex flex-col h-screen w-full max-w-md mx-auto bg-[#F2F2F7] overflow-hidden relative shadow-2xl">
      <header className="px-5 pt-12 pb-3 bg-white/80 ios-blur sticky top-0 z-10 border-b border-gray-100 grid grid-cols-3 items-center shrink-0">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-black tracking-tighter text-black">
            {activeTab === 'dashboard' ? '好鼻子' : '分析'}
          </h1>
        </div>

        <div className="flex flex-col items-center">
            <span className="text-[9px] font-black text-blue-600/60 uppercase tracking-widest whitespace-nowrap">已坚持脱敏治疗</span>
            <div className="flex items-baseline gap-0.5">
                <span className="text-xl font-black text-blue-600">{diffDays}</span>
                <span className="text-[10px] font-black text-blue-600/80">天</span>
            </div>
        </div>
        
        <div onClick={fetchWeather} className="flex flex-col items-end cursor-pointer active:opacity-50 transition-opacity">
          {loadingWeather ? (
            <Loader2 className="animate-spin text-blue-500" size={14} />
          ) : weather ? (
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1 text-blue-600">
                <span className="text-xs font-black">{weather.temp}</span>
                <CloudSun size={12} />
              </div>
              <div className="flex items-center gap-0.5 text-[8px] font-bold text-gray-400">
                <span className="truncate max-w-[40px] text-right">{weather.locationName}</span>
                <span className="mx-0.5">|</span>
                <span>AQI {weather.aqi}</span>
                <ShieldCheck size={8} className={weather.aqiLabel === '优' ? 'text-green-500' : 'text-amber-500'} />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-[9px] text-blue-600 font-bold">
              <MapPin size={10} />
              <span>更新</span>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        {activeTab === 'dashboard' && (
          <Dashboard 
            state={state} 
            onOpenForm={() => setShowLogForm(true)} 
            onQuickConfirm={handleQuickConfirm}
            onUpdateSettings={handleUpdateSettings}
            onSaveLog={handleSaveLog}
          />
        )}
        {activeTab === 'history' && <HistoryView logs={state.logs} onClear={() => setState(p => ({...p, logs: []}))} />}
      </main>

      <nav className="shrink-0 bg-white/90 ios-blur border-t border-gray-100 safe-area-bottom flex justify-around py-3 z-20">
        <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center transition-all ${activeTab === 'dashboard' ? 'text-blue-600 scale-105' : 'text-gray-300'}`}>
          <Clock size={22} strokeWidth={3} />
          <span className="text-[10px] mt-1 font-bold">首页</span>
        </button>
        <button onClick={() => setActiveTab('history')} className={`flex flex-col items-center transition-all ${activeTab === 'history' ? 'text-blue-600 scale-105' : 'text-gray-300'}`}>
          <History size={22} strokeWidth={3} />
          <span className="text-[10px] mt-1 font-bold">分析</span>
        </button>
      </nav>

      {showLogForm && (
          <LogForm 
            initialMedicationTaken={state.logs.find(l => l.dateString === new Date().toISOString().split('T')[0])?.medicationTaken || false}
            onSave={handleSaveLog} 
            onClose={() => setShowLogForm(false)} 
          />
      )}
    </div>
  );
};

export default App;
