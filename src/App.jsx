import React, { useState } from 'react';
import './App.css';

const leftButtons = ['LSK1', 'LSK2', 'LSK3', 'LSK4', 'LSK5', 'LSK6'];
const rightButtons = ['RSK1', 'RSK2', 'RSK3', 'RSK4', 'RSK5', 'RSK6'];

const functionButtons = [
  ['DIR', 'PROG', 'PERF', 'INIT', 'DATA', ' '],
  ['F-PLN', 'RAD NAV', 'FUEL PRED', 'SEC F-PLN', 'ATC COMM', 'MCDU MENU']
];

const numpadButtons = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['.', '0', '+/-']
];

const alphaButtons = [
  ['A', 'B', 'C', 'D', 'E'],
  ['F', 'G', 'H', 'I', 'J'],
  ['K', 'L', 'M', 'N', 'O'],
  ['P', 'Q', 'R', 'S', 'T'],
  ['U', 'V', 'W', 'X', 'Y'],
  ['Z', '/', 'SP', 'EX', 'CLR']
];

const extraButtons = [
  ['PORT', 'EXEC'],
  ['←', '→'],
  ['UP', 'DOWN'],
  ['⌫'] // Added Backspace button
];

const twoSideButtons = [
  ['BRT'],
  ['DIM']
];

const App = () => {
  const [displayText, setDisplayText] = useState('A320-200\nMCDU READY');

  const handleButtonClick = (label) => {
    if (label === 'CLR') {
      setDisplayText('');
    } else if (label === '⌫') {
      setDisplayText((prev) => prev.slice(0, -1)); // Remove last character
    } else if (label !== '') {
      setDisplayText((prev) => (prev + ' ' + label).trim());
    }
  };

  return (
    <div className="mcdu-container">
      <div className="mcdu-layout">
        {/* Left side LSK buttons */}
        <div className="mcdu-left mcdu-side">
          {leftButtons.map((label, index) => (
            <button key={index} className="mcdu-lsk-button" onClick={() => handleButtonClick(label)}>
              {label}
            </button>
          ))}
        </div>

        {/* Center section */}
        <div className="mcdu-center">
          <div className="mcdu-screen">{displayText}</div>

          <div className="mcdu-function-panel">
            <div className="mcdu-function-panel-left">
              {functionButtons.map((row, rowIndex) => (
                <div key={rowIndex} className="mcdu-button-row">
                  {row.map((label, index) => (
                    <button key={index} className="mcdu-function-button" onClick={() => handleButtonClick(label)}>
                      {label}
                    </button>
                  ))}
                </div>
              ))}
            </div>
            <div className="mcdu-function-panel-right">
              {twoSideButtons.map((row, rowIndex) => (
                <div key={rowIndex} className="mcdu-two-side-button">
                  {row.map((label, index) => (
                    <button key={index} className="mcdu-two-side-button-1" onClick={() => handleButtonClick(label)}>
                      {label}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="mcdu-below-panel">
            <div className="mcdu-below-left-panel">
              <div className="mcdu-extras">
                {extraButtons.map((row, rowIndex) => (
                  <div key={rowIndex} className="mcdu-extras-row">
                    {row.map((label, index) => (
                      <button key={index} className="mcdu-extra-button" onClick={() => handleButtonClick(label)}>
                        {label}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
              <div className="mcdu-numpad">
                {numpadButtons.map((row, rowIndex) => (
                  <div key={rowIndex} className="mcdu-button-row">
                    {row.map((label, index) => (
                      <button key={index} className="mcdu-numpad-button" onClick={() => handleButtonClick(label)}>
                        {label}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="mcdu-below-right-panel">
              <div className="mcdu-alpha">
                {alphaButtons.map((row, rowIndex) => (
                  <div key={rowIndex} className="mcdu-button-row">
                    {row.map((label, index) => (
                      <button key={index} className="mcdu-alpha-button" onClick={() => handleButtonClick(label)}>
                        {label}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right side RSK buttons */}
        <div className="mcdu-right mcdu-side">
          {rightButtons.map((label, index) => (
            <button key={index} className="mcdu-rsk-button" onClick={() => handleButtonClick(label)}>
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
