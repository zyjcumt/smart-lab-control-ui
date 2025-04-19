
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const TextToCommand = () => {
  const [inputText, setInputText] = useState('');
  const [command, setCommand] = useState('');
  
  // Convert text to standardized command
  const convertToCommand = () => {
    if (!inputText.trim()) return;
    
    // Simple mapping dictionary for common phrases
    const patterns = [
      { regex: /打开|开启|启动/, action: 'POWER_ON' },
      { regex: /关闭|关掉|断电/, action: 'POWER_OFF' },
      { regex: /查询|查看|获取/, action: 'GET_STATUS' },
      { regex: /重置|复位/, action: 'RESET' },
      { regex: /动力|计算机|电脑/, device: 'POWER' },
      { regex: /照明|灯光|灯/, device: 'LIGHTING' },
      { regex: /空调|制冷|温度/, device: 'AC' },
      { regex: /所有|全部/, target: 'ALL' },
    ];
    
    // Extract room numbers
    const roomRegex = /(\d+)-(\d+)|([AB]\d+)/g;
    const roomMatches = inputText.match(roomRegex) || [];
    
    // Detect action
    let action = '';
    for (const pattern of patterns) {
      if (pattern.action && pattern.regex.test(inputText)) {
        action = pattern.action;
        break;
      }
    }
    
    // Detect device
    let device = '';
    for (const pattern of patterns) {
      if (pattern.device && pattern.regex.test(inputText)) {
        device = pattern.device;
        break;
      }
    }
    
    // Detect target (all or specific)
    let target = roomMatches.length > 0 ? roomMatches.join(',') : '';
    for (const pattern of patterns) {
      if (pattern.target && pattern.regex.test(inputText)) {
        target = pattern.target;
        break;
      }
    }
    
    // Format the standardized command
    let standardizedCommand = '';
    if (action && (device || action === 'GET_STATUS') && (target || target === 'ALL')) {
      standardizedCommand = `${action}:${device || 'ALL'}:${target}`;
    } else {
      standardizedCommand = 'INVALID_COMMAND: 无法解析命令，请检查输入';
    }
    
    setCommand(standardizedCommand);
  };
  
  return (
    <div className="test-module">
      <h3 className="text-lg font-semibold mb-3">2.2 文字转命令</h3>
      
      <div className="space-y-4">
        <div>
          <div className="mb-2 font-medium">输入文本：</div>
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="例如：打开05-08实验室的照明"
            className="h-20"
          />
        </div>
        
        <div className="flex justify-center">
          <Button onClick={convertToCommand}>转换为命令</Button>
        </div>
        
        <div>
          <div className="mb-2 font-medium">标准化命令：</div>
          <Textarea
            value={command}
            readOnly
            placeholder="转换后的标准化命令将显示在这里..."
            className="h-20 font-mono"
          />
        </div>
      </div>
    </div>
  );
};

export default TextToCommand;
