
import React, { useState, useEffect } from 'react';
import { Mic, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { toast } from 'sonner';

const SpeechToText = () => {
  const [recognizedText, setRecognizedText] = useState('');
  const [engineType, setEngineType] = useState('default');
  
  const { isRecording, startRecording, stopRecording, error, volume } = useSpeechRecognition({
    onResult: (text) => {
      setRecognizedText(text);
    },
    volumeThreshold: 10,
    silenceThreshold: 3000
  });

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);
  
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
              <SelectItem value="default">Web Speech API</SelectItem>
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
          <div className="h-20 bg-gray-100 rounded-md flex items-end justify-center p-2">
            <div 
              className="w-full h-full flex items-end justify-center space-x-1"
              style={{ maxWidth: '300px' }}
            >
              <div
                className="w-full bg-primary transition-all duration-75"
                style={{
                  height: `${Math.min(100, volume)}%`,
                  minHeight: '2px'
                }}
              />
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
