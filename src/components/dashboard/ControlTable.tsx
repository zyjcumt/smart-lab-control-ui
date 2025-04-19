
import React from 'react';
import { useLabStore, type DeviceType } from '@/store/labStore';
import { PowerIcon, LightingIcon, AcIcon } from '@/components/icons/DeviceIcons';
import { cn } from '@/lib/utils';

const ControlTable = () => {
  const { rooms, toggleDevice } = useLabStore();
  
  // Device types and their labels
  const deviceTypes: { type: DeviceType; label: string }[] = [
    { type: 'power', label: '动力' },
    { type: 'lighting', label: '照明' },
    { type: 'ac', label: '空调' },
  ];
  
  // Get the appropriate icon component for a device type
  const getDeviceIcon = (type: DeviceType, powered: boolean) => {
    switch (type) {
      case 'power':
        return <PowerIcon powered={powered} size={20} />;
      case 'lighting':
        return <LightingIcon powered={powered} size={20} />;
      case 'ac':
        return <AcIcon powered={powered} size={20} />;
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 overflow-x-auto">
      <h2 className="text-lg font-semibold mb-4">设备控制表</h2>
      <table className="w-full control-table">
        <thead>
          <tr>
            <th className="w-24"></th>
            {rooms.map((room) => (
              <th key={room.id}>{room.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {deviceTypes.map(({ type, label }) => (
            <tr key={type}>
              <th className="text-left">{label}</th>
              {rooms.map((room) => {
                const isPowered = room.devices[type].powered;
                return (
                  <td 
                    key={`${room.id}-${type}`}
                    onClick={() => toggleDevice(room.id, type)}
                    className={cn(
                      "cursor-pointer transition-colors hover:bg-gray-50",
                      isPowered ? "bg-green-50" : "bg-gray-50"
                    )}
                  >
                    <div className="flex justify-center">
                      {getDeviceIcon(type, isPowered)}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ControlTable;
