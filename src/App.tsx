// src/App.tsx
import React from 'react';
import BrainProgress from './components/BrainProgress';

const App: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Brain Progress Demo</h1>
      <BrainProgress 
        value={30}           // or totalPercent={30}
        maxValue={100}       // when using value-based calculation
        showLabel={true}
        customColors={{ primary: '#3498db', secondary: '#2ecc71' }}
        animationSpeed={1.5} // seconds
      />
    </div>
  );
};

export default App;
