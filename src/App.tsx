import { useState } from 'react';
import { useLegalFabDemo, type DemoType } from './hooks/useLegalFabDemo';
import { Header } from './components/Header';
import { QueryPanel } from './components/QueryPanel';
import { StepIndicator } from './components/StepIndicator';
import { FixedGraphVisualization } from './components/FixedGraphVisualization';
import { AgentsPanel } from './components/AgentsPanel';
import { SourcesPanel } from './components/SourcesPanel';
import { ControlBar } from './components/ControlBar';
import { ResultsPanel } from './components/ResultsPanel';
import { StepMessage } from './components/StepMessage';

function App() {
  const [selectedDemo, setSelectedDemo] = useState<DemoType>('billing');
  const demo = useLegalFabDemo(selectedDemo);
  const [showResults, setShowResults] = useState(false);

  // Show results when demo completes
  const handleShowResults = () => {
    setShowResults(true);
  };

  const handleHideResults = () => {
    setShowResults(false);
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      {/* Header */}
      <Header selectedDemo={selectedDemo} onDemoChange={setSelectedDemo} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">
        {/* Top Section: Query + Step Indicator */}
        <div className="flex gap-4">
          <QueryPanel query={demo.query} />
          <StepIndicator
            currentStep={demo.currentStep}
            totalSteps={demo.totalSteps}
            onStepClick={demo.goToStep}
          />
        </div>

        {/* Middle Section: Graph + Side Panels */}
        <div className="flex-1 flex gap-4 overflow-hidden">
          {/* Left Panel: Agents */}
          <div className="w-56 flex-shrink-0">
            <AgentsPanel
              step={demo.step}
              activeAgents={demo.activeAgents}
            />
          </div>

          {/* Center: Graph Visualization */}
          <div className="flex-1 flex flex-col gap-3 overflow-hidden">
            <StepMessage step={demo.step} isAnimating={demo.isAnimating} />
            <div className="flex-1 glass rounded-xl overflow-hidden">
              <FixedGraphVisualization
                nodes={demo.visibleNodes}
                edges={demo.visibleEdges}
              />
            </div>
          </div>

          {/* Right Panel: Sources */}
          <div className="w-56 flex-shrink-0">
            <SourcesPanel
              step={demo.step}
              activeSources={demo.activeSources}
            />
          </div>
        </div>

        {/* Bottom Section: Controls */}
        <ControlBar
          isPlaying={demo.isPlaying}
          currentStep={demo.currentStep}
          totalSteps={demo.totalSteps}
          progress={demo.progress}
          isComplete={demo.isComplete}
          onPlay={demo.play}
          onPause={demo.pause}
          onReset={demo.reset}
          onNext={demo.nextStep}
          onPrev={demo.prevStep}
          onShowResults={handleShowResults}
        />
      </div>

      {/* Results Modal */}
      {showResults && (
        <ResultsPanel
          finalAnswer={demo.finalAnswer}
          metadata={demo.metadata}
          onClose={handleHideResults}
        />
      )}
    </div>
  );
}

export default App;
