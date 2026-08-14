import React from 'react';
import { X, CheckCircle, Bug, Rocket, History, Info } from 'lucide-react';
import changelogData from '../data/changelog.json';

export default function ChangelogModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-4xl max-h-full bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 md:px-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl">
              <History size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">更新紀錄</h2>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-1">目前版本: <span className="text-blue-600 dark:text-blue-400">{changelogData[0]?.version}</span></p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Timeline Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-slate-50/50 dark:bg-slate-900/50 custom-scrollbar">
          <div className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-4 md:ml-6 space-y-10">
            {changelogData.map((log, index) => {
              const isLatest = index === 0;
              const isBugFix = log.isFix || log.typeTag.toLowerCase() === 'fix';
              const isFeature = log.typeTag.toLowerCase() === 'feat' || log.typeTag.toLowerCase() === 'feature';
              
              return (
                <div key={log.id} className="relative pl-8 md:pl-10">
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[13px] top-1 h-6 w-6 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center ${
                    isLatest 
                      ? 'bg-blue-500 shadow-[0_0_0_4px_rgba(59,130,246,0.2)]' 
                      : isBugFix ? 'bg-amber-500' : isFeature ? 'bg-emerald-500' : 'bg-slate-400 dark:bg-slate-600'
                  }`}>
                  </div>

                  {/* Content Card */}
                  <div className={`bg-white dark:bg-slate-800 rounded-2xl p-5 md:p-6 shadow-sm border ${
                    isLatest ? 'border-blue-200 dark:border-blue-800 shadow-blue-900/5' : 'border-slate-200 dark:border-slate-700'
                  }`}>
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-xl text-xs font-black tracking-wider ${
                          isLatest 
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' 
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                        }`}>
                          {log.version}
                        </span>
                        
                        {isBugFix && (
                          <span className="flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-black tracking-wider bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                            <Bug size={14} /> Bug 修復
                          </span>
                        )}
                        
                        {isFeature && (
                          <span className="flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-black tracking-wider bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                            <Rocket size={14} /> 新功能
                          </span>
                        )}
                      </div>
                      
                      <div className="text-sm font-bold text-slate-400 dark:text-slate-500">
                        {log.date}
                      </div>
                    </div>
                    
                    <h3 className="text-lg md:text-xl font-black text-slate-800 dark:text-slate-100 mb-2 leading-snug">
                      {log.title}
                    </h3>
                    
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed whitespace-pre-wrap">
                      {log.details !== log.title && log.details !== `${log.typeTag}: ${log.title}` ? log.details : ''}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
