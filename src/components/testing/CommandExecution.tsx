
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useLabStore } from '@/store/labStore';

const CommandExecution = () => {
  const { rooms, toggleDevice, addLog } = useLabStore();
  const [command, setCommand] = useState('');
  const [result, setResult] = useState('');
  
  // Execute command
  const executeCommand = () => {
    if (!command.trim()) return;
    
    try {
      // Parse the command format: ACTION:DEVICE:TARGET
      const parts = command.split(':');
      
      if (parts.length !== 3) {
        throw new Error('命令格式不正确，应为 ACTION:DEVICE:TARGET');
      }
      
      const [action, deviceType, target] = parts;
      
      // Process execution based on the command
      const getDeviceType = (deviceStr: string) => {
        switch (deviceStr.toUpperCase()) {
          case 'POWER': return 'power';
          case 'LIGHTING': return 'lighting';
          case 'AC': return 'ac';
          default: return null;
        }
      };
      
      // Determine target rooms
      let targetRooms = [];
      if (target === 'ALL') {
        targetRooms = rooms;
      } else {
        // Handle comma-separated room list
        const roomIds = target.split(',');
        targetRooms = rooms.filter(room => 
          roomIds.some(id => room.name.toLowerCase().includes(id.toLowerCase()))
        );
      }
      
      if (targetRooms.length === 0) {
        throw new Error(`找不到目标实验室: ${target}`);
      }
      
      // Execute the action
      const execResults = [];
      
      switch (action) {
        case 'POWER_ON':
        case 'POWER_OFF':
          const shouldPowerOn = action === 'POWER_ON';
          const device = getDeviceType(deviceType);
          
          if (!device && deviceType !== 'ALL') {
            throw new Error(`未知设备类型: ${deviceType}`);
          }
          
          // Toggle devices based on the command
          for (const room of targetRooms) {
            if (deviceType === 'ALL') {
              // Toggle all devices in the room
              for (const dev of ['power', 'lighting', 'ac'] as const) {
                if (room.devices[dev].powered !== shouldPowerOn) {
                  toggleDevice(room.id, dev);
                  execResults.push(`${room.name} ${dev} -> ${shouldPowerOn ? 'ON' : 'OFF'}`);
                }
              }
            } else if (device) {
              // Toggle specific device
              if (room.devices[device].powered !== shouldPowerOn) {
                toggleDevice(room.id, device);
                execResults.push(`${room.name} ${device} -> ${shouldPowerOn ? 'ON' : 'OFF'}`);
              }
            }
          }
          break;
          
        case 'GET_STATUS':
          // Get status of devices
          for (const room of targetRooms) {
            const statuses = [];
            
            if (deviceType === 'ALL') {
              // Get all device statuses
              for (const dev of ['power', 'lighting', 'ac'] as const) {
                statuses.push(`${dev}: ${room.devices[dev].powered ? 'ON' : 'OFF'}`);
              }
            } else {
              const device = getDeviceType(deviceType);
              if (device) {
                statuses.push(`${device}: ${room.devices[device].powered ? 'ON' : 'OFF'}`);
              }
            }
            
            execResults.push(`${room.name}: ${statuses.join(', ')}`);
          }
          break;
          
        default:
          throw new Error(`未支持的操作: ${action}`);
      }
      
      const resultText = execResults.join('\n');
      setResult(resultText);
      
      // Add to system log
      addLog(`执行命令: ${command} - 成功`, 'info');
    } catch (error) {
      if (error instanceof Error) {
        setResult(`错误: ${error.message}`);
        // Add to system log
        addLog(`执行命令: ${command} - 失败: ${error.message}`, 'error');
      } else {
        setResult('未知错误');
      }
    }
  };
  
  return (
    <div className="test-module">
      <h3 className="text-lg font-semibold mb-3">2.4 命令执行</h3>
      
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
          <Button onClick={executeCommand}>执行命令</Button>
        </div>
        
        <div>
          <div className="mb-2 font-medium">执行结果：</div>
          <Textarea
            value={result}
            readOnly
            placeholder="命令执行的结果将显示在这里..."
            className="h-36 font-mono"
          />
        </div>
      </div>
    </div>
  );
};

export default CommandExecution;
