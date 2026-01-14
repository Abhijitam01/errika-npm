import { useState } from 'react';
import { Button, Card } from '@repo/ui';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Welcome to Errika</h1>
        <p>Vite + React + Turborepo</p>
      </header>
      
      <main className="app-main">
        <Card>
          <h2>Get Started</h2>
          <p>Edit <code>src/App.tsx</code> to get started</p>
          <div className="counter">
            <Button onClick={() => setCount((count) => count + 1)}>
              Count is {count}
            </Button>
          </div>
        </Card>

        <div className="links">
          <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer">
            Vite Docs
          </a>
          <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
            React Docs
          </a>
          <a href="https://turbo.build" target="_blank" rel="noopener noreferrer">
            Turborepo Docs
          </a>
        </div>
      </main>
    </div>
  );
}

export default App;

