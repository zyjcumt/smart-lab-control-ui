
import React, { useRef, useEffect } from 'react';
import { useLabStore } from '@/store/labStore';
import { cn } from '@/lib/utils';

const LogPanel = () => {
  const { logs } = useLabStore();
  const logContainerRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when logs change
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);
  
  // Format timestamp
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">系统日志</h2>
      </div>
      
      <div 
        ref={logContainerRef}
        className="flex-1 overflow-y-auto p-2 bg-gray-50 font-mono text-sm"
        style={{ maxHeight: '200px' }}
      >
        {logs.length === 0 ? (
          <div className="text-center text-gray-500 py-6">
            暂无系统日志
          </div>
        ) : (
          logs.map((log) => (
            <div 
              key={log.id}
              className={cn(
                "py-1 px-2 border-l-2 mb-1",
                log.type === 'info' && "border-blue-500 bg-blue-50",
                log.type === 'warning' && "border-amber-500 bg-amber-50",
                log.type === 'error' && "border-red-500 bg-red-50"
              )}
            >
              <span className="text-gray-500 mr-2">[{formatTime(log.timestamp)}]</span>
              {log.message}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LogPanel;
