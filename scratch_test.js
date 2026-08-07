const React = require('react');
const { useEffect, useState } = React;

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("Effect run");
    const listener = (e) => {
      if (e.key === ' ') {
        console.log("Space pressed!");
        drawLot();
      }
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  });

  const drawLot = () => {
    console.log("drawLot called! count is", count);
    setCount(c => c + 1);
  };

  return null;
}
