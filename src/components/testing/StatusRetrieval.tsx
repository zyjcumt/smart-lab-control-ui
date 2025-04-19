
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useLabStore } from '@/store/labStore';

const StatusRetrieval = () => {
  const { rooms } = useLabStore();
  const [roomId, setRoomId] = useState('');
  const [statusInfo, setStatusInfo] = useState('');
  
  // Get device status
  const getStatus = () => {
    let targetRooms = [];
    
    if (!roomId.trim()) {
      // If no room specified, get all rooms
      targetRooms = rooms;
    } else {
      // Filter rooms by the specified ID
      targetRooms = rooms.filter(room => 
        room.name.toLowerCase().includes(roomId.toLowerCase())
      );
    }
    
    if (targetRooms.length === 0) {
      setStatusInfo(`找不到实验室: ${roomId}`);
      return;
    }
    
    // Format the status information
    let status = [];
    
    for (const room of targetRooms) {
      status.push(`实验室: ${room.name}`);
      status.push(`  动力: ${room.devices.power.powered ? '通电' : '断电'}`);
      status.push(`  照明: ${room.devices.lighting.powered ? '通电' : '断电'}`);
      status.push(`  空调: ${room.devices.ac.powered ? '通电' : '断电'}`);
      status.push(''); // Empty line for spacing
    }
    
    setStatusInfo(status.join('\n'));
  };
  
  return (
    <div className="test-module">
      <h3 className="text-lg font-semibold mb-3">2.5 状态获取</h3>
      
      <div className="space-y-4">
        <div>
          <div className="mb-2 font-medium">实验室标识（留空获取所有）：</div>
          <Input
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="例如：05-08 或留空获取全部"
          />
        </div>
        
        <div className="flex justify-center">
          <Button onClick={getStatus}>获取状态</Button>
        </div>
        
        <div>
          <div className="mb-2 font-medium">状态信息：</div>
          <Textarea
            value={statusInfo}
            readOnly
            placeholder="设备状态信息将显示在这里..."
            className="h-36 font-mono"
          />
        </div>
      </div>
    </div>
  );
};

export default StatusRetrieval;
