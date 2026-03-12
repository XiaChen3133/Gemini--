import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Download, Upload, Database, AlertTriangle, Calendar } from 'lucide-react';

export function SettingsPage() {
  const { state, exportData, importData, updateFutureMemo } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          if (window.confirm('导入将覆盖当前所有数据，确定要继续吗？')) {
            importData(content);
          }
        }
      };
      reader.readAsText(file);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pt-4">
      <header className="mb-6">
        <h1 className="text-xl font-bold text-[#1A6840]">数据管理</h1>
        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">BACKUP AND RESTORE YOUR DATA</p>
      </header>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-start space-x-4 mb-4">
          <div className="p-3 bg-[#1A6840]/5 text-[#1A6840] rounded-xl">
            <Calendar size={24} />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">未来待办 / 备忘</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1 leading-relaxed">
              记录不属于日常队列的长期计划或灵感。
            </p>
          </div>
        </div>
        <textarea
          value={state.futureMemo}
          onChange={(e) => updateFutureMemo(e.target.value)}
          placeholder="在这里输入你的未来待办或备忘..."
          className="w-full h-40 p-4 bg-gray-50 border border-gray-100 rounded-xl text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#1A6840]/40 resize-none transition-all"
        />
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-start space-x-4 mb-6">
          <div className="p-3 bg-[#1A6840]/5 text-[#1A6840] rounded-xl">
            <Database size={24} />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">本地数据存储</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1 leading-relaxed">
              由于浏览器限制，网页应用无法直接访问您的硬盘文件。
              为了防止浏览器缓存清理导致数据丢失，请定期<b>导出备份</b>。
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={exportData}
            className="w-full flex items-center justify-center space-x-2 p-4 bg-[#1A6840] text-white rounded-xl hover:bg-[#1A6840]/90 transition-all shadow-lg shadow-[#1A6840]/10 font-bold text-[10px] uppercase tracking-widest"
          >
            <Download size={20} />
            <span>导出数据备份 (JSON)</span>
          </button>

          <div className="relative">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center space-x-2 p-4 bg-gray-50 border border-gray-100 text-gray-400 rounded-xl hover:bg-gray-100 transition-all font-bold text-[10px] uppercase tracking-widest"
            >
              <Upload size={20} />
              <span>导入数据恢复</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 flex items-start space-x-3">
        <AlertTriangle size={20} className="text-gray-300 flex-shrink-0 mt-0.5" />
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-relaxed">
          <strong>注意：</strong> 导入数据将会完全覆盖当前应用中的所有任务和设置。建议在导入前先导出当前数据作为备份。
        </p>
      </div>
    </div>
  );
}
