
import React, { useState } from 'react';
import { PowerIcon, LightingIcon, AcIcon } from '@/components/icons/DeviceIcons';

// Simple room interface for this test module
interface TestRoom {
  id: string;
  name: string;
  power: boolean;
  lighting: boolean;
  ac: boolean;
}

const StatusDisplay = () => {
  // Initialize test rooms with default states
  const defaultRooms: TestRoom[] = [
    { id: '01-04', name: '01-04', power: false, lighting: false, ac: false },
    { id: '05-08', name: '05-08', power: false, lighting: false, ac: false },
    { id: '09-10', name: '09-10', power: false, lighting: false, ac: false },
    { id: '11-12', name: '11-12', power: false, lighting: false, ac: false },
    { id: 'a415', name: 'A415', power: false, lighting: false, ac: false },
    { id: 'b426', name: 'B426', power: false, lighting: false, ac: false },
  ];
  
  const [rooms, setRooms] = useState<TestRoom[]>(defaultRooms);
  
  // Toggle device state
  const toggleDevice = (roomId: string, device: 'power' | 'lighting' | 'ac') => {
    setRooms(prevRooms => 
      prevRooms.map(room => 
        room.id === roomId 
          ? { ...room, [device]: !room[device] }
          : room
      )
    );
  };
  
  return (
    <div className="test-module">
      <h3 className="text-lg font-semibold mb-3">2.8 状态 UI 显示 (模拟)</h3>
      
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          点击图标切换其状态，模拟通电/断电变化。此模块用于测试 UI 更新逻辑。
        </p>
        
        <div className="flex flex-wrap gap-4 justify-center">
          {rooms.map((room) => (
            <div 
              key={room.id}
              className="border rounded-lg p-3 w-48 bg-gray-50"
            >
              <div className="font-medium text-center mb-2">
                {room.name}
              </div>
              
              <div className="flex justify-around items-center">
                <div 
                  className="cursor-pointer p-2 hover:bg-gray-100 rounded-full"
                  onClick={() => toggleDevice(room.id, 'power')}
                >
                  <PowerIcon powered={room.power} />
                </div>
                
                <div 
                  className="cursor-pointer p-2 hover:bg-gray-100 rounded-full"
                  onClick={() => toggleDevice(room.id, 'lighting')}
                >
                  <LightingIcon powered={room.lighting} />
                </div>
                
                <div 
                  className="cursor-pointer p-2 hover:bg-gray-100 rounded-full"
                  onClick={() => toggleDevice(room.id, 'ac')}
                >
                  <AcIcon powered={room.ac} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatusDisplay;
