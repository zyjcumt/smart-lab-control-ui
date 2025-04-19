
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause } from 'lucide-react';

const TextToSpeech = () => {
  const [text, setText] = useState('');
  const [voiceType, setVoiceType] = useState('default');
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Create a ref for the audio element
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Play speech
  const playSpeech = () => {
    if (!text.trim()) return;
    
    // In a real implementation, this would call a TTS API
    // For now, we'll simulate with browser's speech synthesis if available
    
    if ('speechSynthesis' in window) {
      // Create a SpeechSynthesisUtterance instance
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set language to Chinese
      utterance.lang = 'zh-CN';
      
      // Set voice based on selection
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        // Try to find a Chinese voice
        const chineseVoice = voices.find(voice => 
          voice.lang.includes('zh') || voice.lang.includes('cmn')
        );
        if (chineseVoice) {
          utterance.voice = chineseVoice;
        }
      }
      
      // Set speech rate and pitch
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      
      // Set event handlers
      utterance.onstart = () => {
        setIsPlaying(true);
      };
      
      utterance.onend = () => {
        setIsPlaying(false);
      };
      
      utterance.onerror = () => {
        setIsPlaying(false);
      };
      
      // Speak the text
      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback for browsers without speech synthesis
      alert('抱歉，您的浏览器不支持语音合成功能。');
    }
  };
  
  // Stop speech
  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };
  
  return (
    <div className="test-module">
      <h3 className="text-lg font-semibold mb-3">2.7 文字描述转语音</h3>
      
      <div className="space-y-4">
        <div className="flex gap-3 items-center">
          <div className="w-32">TTS 引擎：</div>
          <Select value={voiceType} onValueChange={setVoiceType}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="选择引擎" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">默认引擎</SelectItem>
              <SelectItem value="azure">Azure TTS</SelectItem>
              <SelectItem value="google">Google TTS</SelectItem>
              <SelectItem value="baidu">百度语音</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <div className="mb-2 font-medium">输入文字：</div>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="输入要转换为语音的文字..."
            className="h-20"
          />
        </div>
        
        <div className="flex justify-center space-x-2">
          {isPlaying ? (
            <Button variant="outline" onClick={stopSpeech}>
              <Pause className="mr-2" size={16} />
              停止播放
            </Button>
          ) : (
            <Button onClick={playSpeech}>
              <Play className="mr-2" size={16} />
              播放语音
            </Button>
          )}
        </div>
        
        {/* Hidden audio element for custom TTS API */}
        <audio ref={audioRef} className="hidden" />
      </div>
    </div>
  );
};

export default TextToSpeech;
