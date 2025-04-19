
import React from 'react';
import { PowerIcon, LightingIcon, AcIcon } from '@/components/icons/DeviceIcons';
import { useLabStore, type Room, type DeviceType } from '@/store/labStore';

const FloorPlan = () => {
  const { rooms, toggleDevice } = useLabStore();
  
  // Create a grid layout for the floor plan
  // We'll divide the rooms into 4 rows of 5 rooms each
  const rowsOfRooms = [
    rooms.slice(0, 5),
    rooms.slice(5, 10),
    rooms.slice(10, 15),
    rooms.slice(15, 20),
  ];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold mb-4">实验室平面图</h2>
      <svg 
        viewBox="0 0 800 480" 
        className="w-full h-full"
      >
        {/* Background grid for reference */}
        <defs>
          <pattern 
            id="grid" 
            width="40" 
            height="40" 
            patternUnits="userSpaceOnUse"
          >
            <path 
              d="M 40 0 L 0 0 0 40" 
              fill="none" 
              stroke="rgba(0,0,0,0.05)" 
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect 
          width="100%" 
          height="100%" 
          fill="url(#grid)" 
        />
        
        {/* Render each room as a rectangle with device icons */}
        {rowsOfRooms.map((row, rowIndex) => (
          <React.Fragment key={`row-${rowIndex}`}>
            {row.map((room, colIndex) => {
              // Calculate position with reduced spacing
              const x = 40 + colIndex * 150;
              const y = 40 + rowIndex * 110;
              const width = 130;
              const height = 90;
              
              return (
                <g key={room.id}>
                  {/* Room rectangle */}
                  <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    rx="4"
                    stroke="#6b7280"
                    strokeWidth="1"
                    fill="#f9fafb"
                  />
                  
                  {/* Room label */}
                  <text
                    x={x + width / 2}
                    y={y + 20}
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="500"
                  >
                    {room.name}
                  </text>
                  
                  {/* Device icons */}
                  <DeviceIconsGroup 
                    room={room} 
                    x={x + width / 2} 
                    y={y + 50} 
                    toggleDevice={toggleDevice}
                  />
                </g>
              );
            })}
          </React.Fragment>
        ))}
      </svg>
    </div>
  );
};

// Helper component to render device icons for a room
interface DeviceIconsGroupProps {
  room: Room;
  x: number;
  y: number;
  toggleDevice: (roomId: string, deviceType: DeviceType) => void;
}

const DeviceIconsGroup = ({ room, x, y, toggleDevice }: DeviceIconsGroupProps) => {
  return (
    <>
      <foreignObject x={x - 50} y={y - 10} width="30" height="30">
        <div 
          className="w-full h-full flex items-center justify-center cursor-pointer"
          onClick={() => toggleDevice(room.id, 'power')}
        >
          <PowerIcon powered={room.devices.power.powered} size={20} />
        </div>
      </foreignObject>
      
      <foreignObject x={x - 10} y={y - 10} width="30" height="30">
        <div 
          className="w-full h-full flex items-center justify-center cursor-pointer"
          onClick={() => toggleDevice(room.id, 'lighting')}
        >
          <LightingIcon powered={room.devices.lighting.powered} size={20} />
        </div>
      </foreignObject>
      
      <foreignObject x={x + 30} y={y - 10} width="30" height="30">
        <div 
          className="w-full h-full flex items-center justify-center cursor-pointer"
          onClick={() => toggleDevice(room.id, 'ac')}
        >
          <AcIcon powered={room.devices.ac.powered} size={20} />
        </div>
      </foreignObject>
    </>
  );
};

export default FloorPlan;
