import React, { useState } from 'react';
import './App.css';

function App() {
  const [view, setView] = useState('home');
  const [draggedItem, setDraggedItem] = useState(null);
  const [droppedItem, setDroppedItem] = useState(null);
  const [result, setResult] = useState('');
  const [arrayData, setArrayData] = useState(generateArrayWithValidTarget());
  const [highlighted, setHighlighted] = useState([]);
  const [algoActions, setAlgoActions] = useState([]);
  const [newArray, setNewArray] = useState(arrayData.newArray);
  const [target, setTarget] = useState(arrayData.target);

  // Function to generate array with valid target
  function generateArrayWithValidTarget() {
    const arraySize = Math.floor(Math.random() * 6) + 5; // Random size between 5 and 10
    const newArray = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 50) + 1);

    // Pick two random indices and create a valid target
    const randomIndex1 = Math.floor(Math.random() * arraySize);
    let randomIndex2;
    do {
      randomIndex2 = Math.floor(Math.random() * arraySize);
    } while (randomIndex1 === randomIndex2); // Ensure the two indices are distinct

    const target = newArray[randomIndex1] + newArray[randomIndex2];

    return { newArray, target };
  }

  const handleLevelClick = (level) => {
    if (level === 1) {
      setView('twosum');
    }
  };

  const handleDragStart = (item) => {
    setDraggedItem(item);
  };

  const handleDrop = () => {
    if (draggedItem) {
      setDroppedItem(draggedItem);
    }
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleActivate = async () => {
    setAlgoActions([]); // Clear previous actions
    setHighlighted([]); // Clear highlighted elements

    if (droppedItem === 'TwoSum') {
      const solution = await runTwoSum(newArray, target);
      if (solution.length > 0) {
        setResult(
          <span className="success">Success! Indices: {solution[0]} and {solution[1]}</span>
        );
      } else {
        setResult(<span className="error">No solution found. Try again!</span>);
      }
    } else if (!droppedItem) {
      setResult(<span className="error">Please drop an ability before activating.</span>);
    } else {
      setResult(<span className="error">This ability cannot solve this problem.</span>);
    }
  };

  const runTwoSum = async (nums, target) => {
    const map = {};
    for (let i = 0; i < nums.length; i++) {
      const complement = target - nums[i];
      setHighlighted([i]);
      setAlgoActions((prev) => [...prev, `Checking if ${nums[i]} has a complement.`]);
      await sleep(500);

      if (map[complement] !== undefined) {
        setHighlighted([map[complement], i]);
        setAlgoActions((prev) => [
          ...prev,
          `Found complement: ${nums[map[complement]]} and ${nums[i]}.`
        ]);
        await sleep(500);
        return [map[complement], i];
      }
      map[nums[i]] = i;
    }
    setHighlighted([]);
    setAlgoActions((prev) => [...prev, `No solution found.`]);
    return [];
  };

  const handleReset = () => {
    const { newArray, target } = generateArrayWithValidTarget();
    setNewArray(newArray);
    setTarget(target);
    setResult('');
    setDroppedItem(null);
    setHighlighted([]);
    setAlgoActions([]);
  };

  return (
    <div className="App">
      {view === 'home' && (
        <header className="App-header">
          <h1 className="title">Welcome to AlgoQuest!</h1>
          <div className="button-container">
            <button className="level-button" onClick={() => handleLevelClick(1)}>
              Level 1 (TwoSum)
            </button>
            <button className="level-button" onClick={() => alert('Coming Soon!')}>
              Level 2
            </button>
            <button className="level-button" onClick={() => alert('Coming Soon!')}>
              Level 3
            </button>
          </div>
        </header>
      )}

      {view === 'twosum' && (
        <div className="two-sum-game">
          <h2 className="game-title">TwoSum</h2>
          <p className="challenge-description">
            Find two numbers in the array that add up to the target value: {target}.
          </p>

          {/* Visual Array at the Top */}
          <div className="array-container">
            {newArray.map((num, index) => (
              <div
                className={`array-square ${highlighted.includes(index) ? 'highlight' : ''}`}
                key={index}
              >
                {num}
              </div>
            ))}
            <span className="refresh-icon" onClick={handleReset}>🔄</span>
          </div>

          {/* Blank Box for Dropping Ability */}
          <div className="drop-zone-container">
            <div
              className="drop-zone"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              {droppedItem ? `Dropped: ${droppedItem}` : 'Drop your ability here'}
            </div>
          </div>

          {/* Draggable Ability Buttons */}
          <div className="draggable-container">
            <div
              className="draggable-item"
              draggable
              onDragStart={() => handleDragStart('TwoSum')}
            >
              TwoSum Spell
            </div>
            <div
              className="draggable-item"
              draggable
              onDragStart={() => handleDragStart('BinarySearch')}
            >
              Binary Search
            </div>
          </div>

          {/* Visual representation of algorithm actions */}
          <div className="algo-actions">
            <h4>Algorithm Actions:</h4>
            <ul>
              {algoActions.map((action, index) => (
                <li key={index}>{action}</li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          {droppedItem && (
            <div className="action-buttons">
              <button className="activate-button" onClick={handleActivate}>
                Activate
              </button>
              <button className="reset-button" onClick={handleReset}>
                Reset Current Level
              </button>
            </div>
          )}

          {/* Result Display */}
          {result && <p className="result">{result}</p>}

          {/* Button to go back to level selection */}
          <div className="navigation-buttons">
            <button className="back-button" onClick={() => setView('home')}>
              Back to Level Selection
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
