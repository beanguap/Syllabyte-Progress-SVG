// src/App.tsx
import React from 'react';
import BrainProgress from './components/BrainProgress';

const App: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Brain Progress Demo</h1>
      
      {/* Progress states */}
      <div style={{ display: 'flex', gap: '2rem' }}>
        <div>
          <h3>25%</h3>
          <BrainProgress value={25} maxValue={100} showLabel={true} />
        </div>

        <div>
          <h3>50%</h3> 
          <BrainProgress value={50} maxValue={100} showLabel={true} />
        </div>

        <div>
          <h3>75%</h3>
          <BrainProgress value={75} maxValue={100} showLabel={true} />
        </div>

        <div>
          <h3>100%</h3>
          <BrainProgress value={100} maxValue={100} showLabel={true} />
        </div>
      </div>
    </div>
  );
};

export default App;
