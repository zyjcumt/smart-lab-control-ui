
import React from 'react';
import SpeechToText from '@/components/testing/SpeechToText';
import TextToCommand from '@/components/testing/TextToCommand';
import CommandInterpretation from '@/components/testing/CommandInterpretation';
import CommandExecution from '@/components/testing/CommandExecution';
import StatusRetrieval from '@/components/testing/StatusRetrieval';
import ResultToText from '@/components/testing/ResultToText';
import TextToSpeech from '@/components/testing/TextToSpeech';
import StatusDisplay from '@/components/testing/StatusDisplay';

const Testing = () => {
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">分步测试</h1>
      <p className="text-muted-foreground mb-6">
        在此页面中，您可以分别测试语音交互流程中的各个步骤，以便定位和解决问题。
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SpeechToText />
        <TextToCommand />
        <CommandInterpretation />
        <CommandExecution />
        <StatusRetrieval />
        <ResultToText />
        <TextToSpeech />
        <StatusDisplay />
      </div>
    </div>
  );
};

export default Testing;
