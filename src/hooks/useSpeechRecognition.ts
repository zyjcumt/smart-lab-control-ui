
import { useState, useEffect, useCallback, useRef } from 'react';

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

export interface UseSpeechRecognitionProps {
  onResult?: (text: string) => void;
  onEnd?: () => void;
  lang?: string;
  volumeThreshold?: number;
  silenceThreshold?: number;
}

export const useSpeechRecognition = ({
  onResult,
  onEnd,
  lang = 'zh-CN',
  volumeThreshold = 10,
  silenceThreshold = 3000
}: UseSpeechRecognitionProps = {}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [volume, setVolume] = useState<number>(0);
  
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const mediaStream = useRef<MediaStream | null>(null);
  const silenceTimer = useRef<NodeJS.Timeout | null>(null);
  const lastVolume = useRef<number>(0);

  const processAudioStream = useCallback((stream: MediaStream) => {
    if (!audioContext.current) {
      audioContext.current = new AudioContext();
      analyser.current = audioContext.current.createAnalyser();
      analyser.current.fftSize = 256;
    }

    const source = audioContext.current.createMediaStreamSource(stream);
    source.connect(analyser.current);

    const dataArray = new Uint8Array(analyser.current.frequencyBinCount);
    
    const checkVolume = () => {
      if (!isRecording || !analyser.current) return;
      
      analyser.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      setVolume(average);
      lastVolume.current = average;

      if (average < volumeThreshold) {
        if (!silenceTimer.current) {
          silenceTimer.current = setTimeout(() => {
            if (lastVolume.current < volumeThreshold) {
              stopRecording();
            }
          }, silenceThreshold);
        }
      } else if (silenceTimer.current) {
        clearTimeout(silenceTimer.current);
        silenceTimer.current = null;
      }

      requestAnimationFrame(checkVolume);
    };

    checkVolume();
  }, [isRecording, volumeThreshold, silenceThreshold]);

  useEffect(() => {
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
      
      if (mediaStream.current) {
        mediaStream.current.getTracks().forEach(track => track.stop());
      }
      if (audioContext.current) {
        audioContext.current.close();
        audioContext.current = null;
      }
      if (silenceTimer.current) {
        clearTimeout(silenceTimer.current);
        silenceTimer.current = null;
      }
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
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then(stream => {
            mediaStream.current = stream;
            processAudioStream(stream);
            recognition.start();
            setIsRecording(true);
            setError('');
          })
          .catch(err => {
            console.error('Microphone access error:', err);
            setError('无法访问麦克风');
          });
      } catch (err) {
        console.error('Speech recognition error:', err);
        setError('启动语音识别时发生错误');
      }
    }
  }, [recognition, isRecording, processAudioStream]);

  const stopRecording = useCallback(() => {
    if (recognition && isRecording) {
      recognition.stop();
      setIsRecording(false);
      if (mediaStream.current) {
        mediaStream.current.getTracks().forEach(track => track.stop());
      }
      if (audioContext.current) {
        audioContext.current.close();
        audioContext.current = null;
      }
      if (silenceTimer.current) {
        clearTimeout(silenceTimer.current);
        silenceTimer.current = null;
      }
    }
  }, [recognition, isRecording]);

  return {
    isRecording,
    startRecording,
    stopRecording,
    error,
    volume
  };
};
