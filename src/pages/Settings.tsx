
import React, { useState } from 'react';
import { useLabStore } from '@/store/labStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const Settings = () => {
  const { 
    backendUrl,
    asrApiUrl,
    ttsApiUrl,
    voiceprintApiUrl,
    setBackendUrl,
    setAsrApiUrl,
    setTtsApiUrl,
    setVoiceprintApiUrl,
    rooms,
    updateRoomNames
  } = useLabStore();
  
  // Local state for form values
  const [backendUrlInput, setBackendUrlInput] = useState(backendUrl);
  const [asrApiUrlInput, setAsrApiUrlInput] = useState(asrApiUrl);
  const [ttsApiUrlInput, setTtsApiUrlInput] = useState(ttsApiUrl);
  const [voiceprintApiUrlInput, setVoiceprintApiUrlInput] = useState(voiceprintApiUrl);
  
  // Get current room names as a string
  const currentRoomNames = rooms.map(room => room.name).join(',');
  const [roomNamesInput, setRoomNamesInput] = useState(currentRoomNames);
  
  // Save endpoint settings
  const saveEndpointSettings = () => {
    setBackendUrl(backendUrlInput);
    setAsrApiUrl(asrApiUrlInput);
    setTtsApiUrl(ttsApiUrlInput);
    setVoiceprintApiUrl(voiceprintApiUrlInput);
    
    toast.success('端点设置已保存');
  };
  
  // Save room settings
  const saveRoomSettings = () => {
    const roomNames = roomNamesInput.split(',').map(name => name.trim()).filter(Boolean);
    updateRoomNames(roomNames);
    
    toast.success('实验室设置已保存');
  };
  
  // Reset to default rooms
  const resetToDefaultRooms = () => {
    const defaultRooms = [
      '01-04', '05-08', '09-10', '11-12', '13-14', '15-16', 
      '17-18', '19-20', '21-22', '23-24', '25-26', '27-28', 
      '29-30', '31-32', '33-34', '35-36', 'A415', 'B426', 
      'B411', 'A416'
    ];
    
    setRoomNamesInput(defaultRooms.join(','));
    updateRoomNames(defaultRooms);
    
    toast.success('已重置为默认实验室配置');
  };
  
  return (
    <div className="container mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">参数设置</h1>
      
      {/* API Endpoints Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>API 端点设置</CardTitle>
          <CardDescription>配置系统所需的各种 API 端点地址</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">控制端（后端服务）地址</label>
            <Input 
              value={backendUrlInput} 
              onChange={(e) => setBackendUrlInput(e.target.value)}
              placeholder="例如：http://localhost:8000"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">语音识别 (ASR) API 地址</label>
            <Input 
              value={asrApiUrlInput} 
              onChange={(e) => setAsrApiUrlInput(e.target.value)}
              placeholder="例如：https://api.example.com/asr"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">文本转语音 (TTS) API 地址</label>
            <Input 
              value={ttsApiUrlInput} 
              onChange={(e) => setTtsApiUrlInput(e.target.value)}
              placeholder="例如：https://api.example.com/tts"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">声纹识别 API 地址（可选）</label>
            <Input 
              value={voiceprintApiUrlInput} 
              onChange={(e) => setVoiceprintApiUrlInput(e.target.value)}
              placeholder="例如：https://api.example.com/voiceprint"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={saveEndpointSettings}>保存端点设置</Button>
        </CardFooter>
      </Card>
      
      {/* Room Configuration Card */}
      <Card>
        <CardHeader>
          <CardTitle>实验室配置</CardTitle>
          <CardDescription>配置系统中的实验室名称</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">实验室名称列表（逗号分隔）</label>
            <Textarea 
              value={roomNamesInput} 
              onChange={(e) => setRoomNamesInput(e.target.value)}
              placeholder="例如：01-04,05-08,09-10,11-12"
              rows={6}
            />
            <p className="text-sm text-muted-foreground mt-1">
              每个名称用逗号分隔。默认包含：01-04,05-08,09-10,11-12,13-14,15-16,17-18...等
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={resetToDefaultRooms}>重置为默认</Button>
          <Button onClick={saveRoomSettings}>保存实验室设置</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Settings;
