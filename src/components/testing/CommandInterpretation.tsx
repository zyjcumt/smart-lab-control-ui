
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const CommandInterpretation = () => {
  const [command, setCommand] = useState('');
  const [interpretation, setInterpretation] = useState('');
  
  // Interpret command
  const interpretCommand = () => {
    if (!command.trim()) return;
    
    try {
      // Parse the command format: ACTION:DEVICE:TARGET
      const parts = command.split(':');
      
      if (parts.length !== 3) {
        throw new Error('命令格式不正确，应为 ACTION:DEVICE:TARGET');
      }
      
      const [action, device, target] = parts;
      
      // Map action to human-readable description
      const actionMap: Record<string, string> = {
        'POWER_ON': '打开',
        'POWER_OFF': '关闭',
        'GET_STATUS': '查询',
        'RESET': '重置',
      };
      
      // Map device to human-readable description
      const deviceMap: Record<string, string> = {
        'POWER': '动力',
        'LIGHTING': '照明',
        'AC': '空调',
        'ALL': '所有设备',
      };
      
      // Format the interpretation
      let result = {
        intent: {
          action: action,
          actionDescription: actionMap[action] || action,
        },
        entities: {
          device: device,
          deviceDescription: deviceMap[device] || device,
          target: target,
          targetDescription: target === 'ALL' ? '所有实验室' : `实验室 ${target}`,
        },
      };
      
      setInterpretation(JSON.stringify(result, null, 2));
    } catch (error) {
      if (error instanceof Error) {
        setInterpretation(JSON.stringify({ error: error.message }, null, 2));
      } else {
        setInterpretation(JSON.stringify({ error: '未知错误' }, null, 2));
      }
    }
  };
  
  return (
    <div className="test-module">
      <h3 className="text-lg font-semibold mb-3">2.3 命令解释</h3>
      
      <div className="space-y-4">
        <div>
          <div className="mb-2 font-medium">输入命令：</div>
          <Textarea
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="例如：POWER_ON:LIGHTING:05-08"
            className="h-20 font-mono"
          />
        </div>
        
        <div className="flex justify-center">
          <Button onClick={interpretCommand}>解释命令</Button>
        </div>
        
        <div>
          <div className="mb-2 font-medium">解释结果：</div>
          <Textarea
            value={interpretation}
            readOnly
            placeholder="命令解释结果将显示在这里..."
            className="h-36 font-mono"
          />
        </div>
      </div>
    </div>
  );
};

export default CommandInterpretation;
