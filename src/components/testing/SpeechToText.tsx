
import React, { useState } from 'react';
import { Mic, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const SpeechToText = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [engineType, setEngineType] = useState('default');
  
  // Simulate starting recording
  const startRecording = () => {
    setIsRecording(true);
    setRecognizedText('');
    
    // Simulate recognition after a delay
    setTimeout(() => {
      const sampleTexts = [
        "打开05-08实验室的照明",
        "关闭09-10实验室的空调",
        "查询13-14实验室的用电状态",
        "开启所有实验室的动力",
        "关闭A415的所有设备",
      ];
      const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
      setRecognizedText(randomText);
      setIsRecording(false);
    }, 3000);
  };
  
  // Stop recording
  const stopRecording = () => {
    setIsRecording(false);
  };
  
  return (
    <div className="test-module">
      <h3 className="text-lg font-semibold mb-3">2.1 语音转文字</h3>
      
      <div className="space-y-4">
        <div className="flex gap-3 items-center">
          <div className="w-32">ASR 引擎：</div>
          <Select value={engineType} onValueChange={setEngineType}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="选择引擎" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">默认引擎</SelectItem>
              <SelectItem value="google">Google Speech</SelectItem>
              <SelectItem value="baidu">百度语音</SelectItem>
              <SelectItem value="azure">Azure Speech</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex justify-center mb-4">
          {isRecording ? (
            <Button 
              variant="destructive"
              size="lg"
              className="rounded-full w-16 h-16 flex items-center justify-center"
              onClick={stopRecording}
            >
              <Square size={24} />
            </Button>
          ) : (
            <Button 
              variant="default"
              size="lg"
              className="rounded-full w-16 h-16 flex items-center justify-center"
              onClick={startRecording}
            >
              <Mic size={24} />
            </Button>
          )}
        </div>
        
        {isRecording && (
          <div className="h-20 bg-gray-100 rounded-md flex items-center justify-center">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i}
                  className="w-1 bg-primary"
                  style={{
                    height: `${20 + Math.random() * 30}px`,
                    animationDuration: `${0.2 + Math.random() * 0.3}s`,
                    animationDelay: `${i * 0.1}s`,
                    animationName: 'pulse-subtle',
                    animationIterationCount: 'infinite',
                  }}
                />
              ))}
            </div>
          </div>
        )}
        
        <div>
          <div className="mb-2 font-medium">识别结果：</div>
          <Textarea
            value={recognizedText}
            readOnly
            placeholder="语音识别结果将显示在这里..."
            className="h-20"
          />
        </div>
      </div>
    </div>
  );
};

export default SpeechToText;
