
import { useState, useEffect, useCallback } from 'react';

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

export interface UseSpeechRecognitionProps {
  onResult?: (text: string) => void;
  onEnd?: () => void;
  lang?: string;
}

export const useSpeechRecognition = ({
  onResult,
  onEnd,
  lang = 'zh-CN'
}: UseSpeechRecognitionProps = {}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Check if browser supports speech recognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('您的浏览器不支持语音识别功能');
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognitionInstance = new SpeechRecognition();
    
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = lang;

    recognitionInstance.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result: any) => result.transcript)
        .join('');

      if (event.results[0].isFinal && onResult) {
        onResult(transcript);
      }
    };

    recognitionInstance.onend = () => {
      setIsRecording(false);
      if (onEnd) onEnd();
    };

    recognitionInstance.onerror = (event: any) => {
      setError(event.error);
      setIsRecording(false);
    };

    setRecognition(recognitionInstance);

    return () => {
      if (recognitionInstance) {
        recognitionInstance.stop();
      }
    };
  }, [lang, onEnd, onResult]);

  const startRecording = useCallback(() => {
    if (recognition && !isRecording) {
      try {
        recognition.start();
        setIsRecording(true);
        setError('');
      } catch (err) {
        console.error('Speech recognition error:', err);
        setError('启动语音识别时发生错误');
      }
    }
  }, [recognition, isRecording]);

  const stopRecording = useCallback(() => {
    if (recognition && isRecording) {
      recognition.stop();
      setIsRecording(false);
    }
  }, [recognition, isRecording]);

  return {
    isRecording,
    startRecording,
    stopRecording,
    error
  };
};
