
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const ResultToText = () => {
  const [executionResult, setExecutionResult] = useState('');
  const [textDescription, setTextDescription] = useState('');
  
  // Convert execution result to natural language
  const convertToText = () => {
    if (!executionResult.trim()) return;
    
    try {
      // Process the execution result
      const lines = executionResult.split('\n').filter(line => line.trim());
      
      if (lines.length === 0) {
        throw new Error('执行结果为空');
      }
      
      // Handle different result formats
      let description = '';
      
      // Check if it's a status report
      if (lines[0].includes('实验室:')) {
        const roomStatuses = [];
        let currentRoom = '';
        
        for (const line of lines) {
          if (line.startsWith('实验室:')) {
            currentRoom = line.replace('实验室:', '').trim();
          } else if (line.trim().startsWith('动力:') || 
                    line.trim().startsWith('照明:') || 
                    line.trim().startsWith('空调:')) {
            const [device, status] = line.trim().split(':').map(s => s.trim());
            roomStatuses.push(`${currentRoom}实验室的${device}${status === '通电' ? '已通电' : '已断电'}`);
          }
        }
        
        description = roomStatuses.join('；') + '。';
      } 
      // Check if it's a command execution result
      else if (lines.some(line => line.includes('->') || line.includes(':'))) {
        const actions = [];
        
        for (const line of lines) {
          if (line.includes('->')) {
            const [target, action] = line.split('->').map(s => s.trim());
            const [room, device] = target.split(' ').map(s => s.trim());
            
            const deviceMap: Record<string, string> = {
              'power': '动力',
              'lighting': '照明',
              'ac': '空调'
            };
            
            actions.push(`${room}实验室的${deviceMap[device] || device}已${action === 'ON' ? '打开' : '关闭'}`);
          } else if (line.includes(':')) {
            const parts = line.split(':').map(s => s.trim());
            if (parts.length >= 2) {
              actions.push(`${parts[0]}${parts.slice(1).join('：')}`);
            } else {
              actions.push(line);
            }
          } else {
            actions.push(line);
          }
        }
        
        description = actions.join('；') + '。';
      } 
      // Error message
      else if (executionResult.toLowerCase().includes('error') || executionResult.includes('错误')) {
        description = `操作失败：${executionResult}`;
      } 
      // Fallback for unknown formats
      else {
        description = `操作结果：${executionResult}`;
      }
      
      setTextDescription(description);
    } catch (error) {
      if (error instanceof Error) {
        setTextDescription(`转换失败: ${error.message}`);
      } else {
        setTextDescription('转换过程中发生未知错误');
      }
    }
  };
  
  return (
    <div className="test-module">
      <h3 className="text-lg font-semibold mb-3">2.6 执行结果转文字描述</h3>
      
      <div className="space-y-4">
        <div>
          <div className="mb-2 font-medium">执行结果：</div>
          <Textarea
            value={executionResult}
            onChange={(e) => setExecutionResult(e.target.value)}
            placeholder="例如：05-08 lighting -> ON"
            className="h-20 font-mono"
          />
        </div>
        
        <div className="flex justify-center">
          <Button onClick={convertToText}>转换为文字描述</Button>
        </div>
        
        <div>
          <div className="mb-2 font-medium">文字描述：</div>
          <Textarea
            value={textDescription}
            readOnly
            placeholder="生成的自然语言描述将显示在这里..."
            className="h-20"
          />
        </div>
      </div>
    </div>
  );
};

export default ResultToText;
