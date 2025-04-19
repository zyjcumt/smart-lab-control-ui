import { create } from 'zustand';

// Lab room names based on requirements
const DEFAULT_ROOMS = [
  '01-04', '05-08', '09-10', '11-12', '13-14', '15-16', 
  '17-18', '19-20', '21-22', '23-24', '25-26', '27-28', 
  '29-30', '31-32', '33-34', '35-36', 'A415', 'B426', 
  'B411', 'A416'
];

// Device types
export type DeviceType = 'power' | 'lighting' | 'ac';

// Device state interface
export interface DeviceState {
  powered: boolean;
}

// Room interface
export interface Room {
  id: string;
  name: string;
  devices: {
    power: DeviceState;
    lighting: DeviceState;
    ac: DeviceState;
  };
}

// Chat message interface
export interface ChatMessage {
  id: string;
  sender: 'user' | 'system';
  text: string;
  timestamp: Date;
}

// Log entry interface
export interface LogEntry {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'error';
  timestamp: Date;
}

// Lab state interface
interface LabState {
  rooms: Room[];
  chatMessages: ChatMessage[];
  logs: LogEntry[];
  backendUrl: string;
  asrApiUrl: string;
  ttsApiUrl: string;
  voiceprintApiUrl: string;
  isRecording: boolean;
  
  // Actions
  toggleDevice: (roomId: string, deviceType: DeviceType) => void;
  addChatMessage: (sender: 'user' | 'system', text: string) => void;
  addLog: (message: string, type: 'info' | 'warning' | 'error') => void;
  setBackendUrl: (url: string) => void;
  setAsrApiUrl: (url: string) => void;
  setTtsApiUrl: (url: string) => void;
  setVoiceprintApiUrl: (url: string) => void;
  setIsRecording: (isRecording: boolean) => void;
  updateRoomNames: (newRooms: string[]) => void;
}

// Initialize rooms with default state
const initializeRooms = () => {
  return DEFAULT_ROOMS.map(name => ({
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    devices: {
      power: { powered: Math.random() > 0.5 },
      lighting: { powered: Math.random() > 0.5 },
      ac: { powered: Math.random() > 0.5 },
    }
  }));
};

// Create store
export const useLabStore = create<LabState>((set) => ({
  rooms: initializeRooms(),
  chatMessages: [],
  logs: [],
  backendUrl: 'http://localhost:8000',
  asrApiUrl: '',
  ttsApiUrl: '',
  voiceprintApiUrl: '',
  isRecording: false,
  
  // Toggle device power state
  toggleDevice: (roomId, deviceType) => set(state => {
    const updatedRooms = state.rooms.map(room => {
      if (room.id === roomId) {
        return {
          ...room,
          devices: {
            ...room.devices,
            [deviceType]: { 
              ...room.devices[deviceType],
              powered: !room.devices[deviceType].powered 
            }
          }
        };
      }
      return room;
    });
    
    // Add a log entry for the action
    const room = state.rooms.find(r => r.id === roomId);
    const isNowPowered = !room?.devices[deviceType].powered;
    const logMessage = `${room?.name} 实验室的${
      deviceType === 'power' ? '动力' : deviceType === 'lighting' ? '照明' : '空调'
    }已${isNowPowered ? '通电' : '断电'}`;
    
    return {
      rooms: updatedRooms,
      logs: [
        {
          id: Date.now().toString(),
          message: logMessage,
          type: 'info',
          timestamp: new Date()
        },
        ...state.logs
      ]
    };
  }),
  
  // Add chat message
  addChatMessage: (sender, text) => set(state => ({
    chatMessages: [
      {
        id: Date.now().toString(),
        sender,
        text,
        timestamp: new Date()
      },
      ...state.chatMessages
    ]
  })),
  
  // Add log entry
  addLog: (message, type) => set(state => ({
    logs: [
      {
        id: Date.now().toString(),
        message,
        type,
        timestamp: new Date()
      },
      ...state.logs
    ]
  })),
  
  // Set backend URL
  setBackendUrl: (url) => set({ backendUrl: url }),
  
  // Set ASR API URL
  setAsrApiUrl: (url) => set({ asrApiUrl: url }),
  
  // Set TTS API URL
  setTtsApiUrl: (url) => set({ ttsApiUrl: url }),
  
  // Set voiceprint API URL
  setVoiceprintApiUrl: (url) => set({ voiceprintApiUrl: url }),
  
  // Set recording state
  setIsRecording: (isRecording) => set({ isRecording }),
  
  // Update room names
  updateRoomNames: (newRooms) => set(state => {
    const currentRooms = [...state.rooms];
    
    // Keep existing rooms if they're in the new list
    const remainingRooms = currentRooms.filter(
      room => newRooms.includes(room.name)
    );
    
    // Add new rooms with default state
    const existingRoomNames = remainingRooms.map(room => room.name);
    const newRoomObjects = newRooms
      .filter(name => !existingRoomNames.includes(name))
      .map(name => ({
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name,
        devices: {
          power: { powered: false },
          lighting: { powered: false },
          ac: { powered: false },
        }
      }));
    
    return { rooms: [...remainingRooms, ...newRoomObjects] };
  })
}));
