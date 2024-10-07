import React, { useState } from 'react';
import './App.css';

function App() {
  const [view, setView] = useState('home');
  const [draggedItem, setDraggedItem] = useState(null);
  const [droppedCode, setDroppedCode] = useState('');
  const [result, setResult] = useState('');
  const [arrayData, setArrayData] = useState(generateArrayWithValidTarget());
  const [highlighted, setHighlighted] = useState([]);
  const [algoActions, setAlgoActions] = useState([]);
  const [newArray, setNewArray] = useState(arrayData.newArray);
  const [target, setTarget] = useState(arrayData.target);
  const [showTwoSumCode, setShowTwoSumCode] = useState(false); // Toggle state for showing TwoSum code

  const twoSumCode = `
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        map = {}
        for i, num in enumerate(nums):
            complement = target - num
            if complement in map:
                return [map[complement], i]
            map[num] = i
        return []`;

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
    if (item === 'TwoSum') {
      setDraggedItem(twoSumCode);
    }
  };

  const handleDrop = () => {
    if (draggedItem) {
      setDroppedCode(draggedItem);
      setDraggedItem(null);
    }
  };

  const handleCodeChange = (e) => {
    setDroppedCode(e.target.value);
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleRunCode = async () => {
    setAlgoActions([]); // Clear previous actions
    setHighlighted([]); // Clear highlighted elements
    setResult(''); // Clear previous result

    // Check for specific content to determine which algorithm to run
    if (droppedCode.trim() === twoSumCode.trim()) {
        const solution = await runTwoSum(newArray, target);
        if (solution.length > 0) {
            setResult(
                <span className="success">Success! Indices: {solution[0]} and {solution[1]}</span>
            );
        } else {
            setResult(<span className="error">No solution found. Try again!</span>);
        }
    } else if (!droppedCode.trim()) {
        setResult(<span className="error">Please enter or drop a valid code snippet to run.</span>);
    } else {
        setResult(<span className="error">This code cannot solve this problem.</span>);
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
          `Found complement: ${nums[map[complement]]} and ${nums[i]}.`,
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
    setDroppedCode('');
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
            <span className="refresh-icon" onClick={handleReset}>
              🔄
            </span>
          </div>

          {/* Boilerplate Code and Drop Zone */}
          <div className="code-and-dropzone">
            {/* Boilerplate Code */}
            <div className="boilerplate-code">
              <pre>
{`class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:`}
              </pre>
            </div>

            {/* Editable Drop Zone */}
            <div className="drop-zone-container">
              <textarea
                className="drop-zone"
                value={droppedCode}
                onChange={handleCodeChange}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                placeholder="Drop your code here"
              />
            </div>
          </div>

          {/* Draggable Ability Buttons */}
          <div className="draggable-container">
            <div className="draggable-item" draggable onDragStart={() => handleDragStart('TwoSum')}>
              <div>
                TwoSum Spell
              </div>
              <button
                className="expand-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTwoSumCode(!showTwoSumCode);
                }}
              >
                {showTwoSumCode ? 'Collapse' : 'Expand'}
              </button>

              {/* TwoSum Code Block */}
              {showTwoSumCode && (
                <div className="two-sum-code">
                  <pre>{twoSumCode}</pre>
                </div>
              )}
            </div>
            <div
              className="draggable-item"
              draggable
              onDragStart={() => handleDragStart('BinarySearch')}
            >
              Binary Search
            </div>
          </div>

          {/* Run Code Button */}
          {droppedCode && (
            <div className="action-buttons">
              <button className="activate-button" onClick={handleRunCode}>
                Run Code
              </button>
            </div>
          )}

          {/* Visual representation of algorithm actions */}
          <div className="algo-actions">
            <h4>Algorithm Actions:</h4>
            <ul>
              {algoActions.map((action, index) => (
                <li key={index}>{action}</li>
              ))}
            </ul>
          </div>

          {/* Result Display */}
          {result && <p className="result">{result}</p>}

          {/* Navigation Buttons */}
          <div className="navigation-buttons">
            <button className="reset-button" onClick={handleReset}>
              Reset Current Level
            </button>
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
