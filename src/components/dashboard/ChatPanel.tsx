
import React, { useState, useRef, useEffect } from 'react';
import { Mic, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLabStore } from '@/store/labStore';
import { cn } from '@/lib/utils';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { toast } from 'sonner';

const ChatPanel = () => {
  const { chatMessages, addChatMessage, setIsRecording } = useLabStore();
  const [inputText, setInputText] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const { isRecording, startRecording, stopRecording, error, volume } = useSpeechRecognition({
    onResult: (text) => {
      addChatMessage('user', text);
      
      // Simulate system response (replace with actual logic later)
      setTimeout(() => {
        const responses = [
          "已执行切换操作。",
          "请详细描述您的请求。",
          "正在处理您的指令。",
          "该实验室当前所有设备已断电。",
          "该操作已成功完成。",
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addChatMessage('system', randomResponse);
      }, 1000);
    },
    onEnd: () => {
      setIsRecording(false);
    },
    volumeThreshold: 10,
    silenceThreshold: 3000
  });

  // Show errors as toasts
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      addChatMessage('user', inputText);
      
      setTimeout(() => {
        const responses = [
          "已执行切换操作。",
          "请详细描述您的请求。",
          "正在处理您的指令。",
          "该实验室当前所有设备已断电。",
          "该操作已成功完成。",
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addChatMessage('system', randomResponse);
      }, 1000);
      
      setInputText('');
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
      addChatMessage('system', "正在听取您的指令...");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">语音对话</h2>
      </div>
      
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3"
        style={{ maxHeight: '300px' }}
      >
        {chatMessages.length === 0 ? (
          <div className="text-center text-gray-500 py-6">
            使用语音或文字与系统交互
          </div>
        ) : (
          chatMessages.map((message) => (
            <div 
              key={message.id}
              className={cn(
                "flex max-w-[80%] rounded-lg p-3",
                message.sender === 'user' 
                  ? "bg-blue-100 ml-auto" 
                  : "bg-gray-100"
              )}
            >
              <p className="text-sm">{message.text}</p>
            </div>
          ))
        )}
        
        {isRecording && (
          <div className="h-16 bg-gray-100 rounded-md flex items-end justify-center p-2">
            <div 
              className="w-full h-full flex items-end justify-center space-x-1"
              style={{ maxWidth: '200px' }}
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
      </div>
      
      <div className="p-3 border-t">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Button
            type="button"
            size="icon"
            onClick={toggleRecording}
            className={cn(
              "flex-shrink-0",
              isRecording ? "bg-red-500 hover:bg-red-600" : ""
            )}
          >
            <Mic size={18} />
          </Button>
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="输入指令..."
            className="flex-1"
          />
          <Button type="submit" size="icon" className="flex-shrink-0">
            <Send size={18} />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatPanel;
