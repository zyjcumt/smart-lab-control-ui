
import React, { useState, useRef, useEffect } from 'react';
import { Mic, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLabStore } from '@/store/labStore';
import { cn } from '@/lib/utils';

const ChatPanel = () => {
  const { chatMessages, addChatMessage, isRecording, setIsRecording } = useLabStore();
  const [inputText, setInputText] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      // Add user message
      addChatMessage('user', inputText);
      
      // Simulate system response after a delay
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
      
      // Clear input
      setInputText('');
    }
  };
  
  // Toggle voice input recording
  const toggleRecording = () => {
    // Toggle recording state
    setIsRecording(!isRecording);
    
    // If we're starting to record, simulate speech recognition after a delay
    if (!isRecording) {
      // Add a user message to indicate recording
      addChatMessage('system', "正在听取您的指令...");
      
      // Simulate ending the recording and getting a result after 3 seconds
      setTimeout(() => {
        setIsRecording(false);
        
        // Simulate recognized text
        const recognizedTexts = [
          "打开05-08实验室的照明",
          "关闭09-10实验室的空调",
          "查询13-14实验室的用电状态",
          "开启所有实验室的动力",
          "关闭A415的所有设备",
        ];
        const randomText = recognizedTexts[Math.floor(Math.random() * recognizedTexts.length)];
        
        // Add the recognized text as a user message
        addChatMessage('user', randomText);
        
        // Simulate system response
        setTimeout(() => {
          addChatMessage('system', "已执行您的指令。");
        }, 1000);
      }, 3000);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">语音对话</h2>
      </div>
      
      {/* Chat messages area */}
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
      </div>
      
      {/* Input area */}
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
