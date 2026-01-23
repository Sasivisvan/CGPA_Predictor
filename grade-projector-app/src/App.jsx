import React, { useState, useRef } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import Header from './components/Header';
import HistoryCard from './components/HistoryCard';
import StrategyCard from './components/StrategyCard';
import Results from './components/Results';
import './App.css';

function App() {
  // Persisted State
  const [mode, setMode] = useLocalStorage('gradeProj_mode', 'detailed');
  const [semesters, setSemesters] = useLocalStorage('gradeProj_semesters', [{ sgpa: '', credits: '' }]);
  const [quickData, setQuickData] = useLocalStorage('gradeProj_quick', { cgpa: '', credits: '' });
  const [strategy, setStrategy] = useLocalStorage('gradeProj_strategy', 'next');
  const [futureCredits, setFutureCredits] = useLocalStorage('gradeProj_futureCredits', '');
  const [targetCGPA, setTargetCGPA] = useLocalStorage('gradeProj_target', '');

  // Local State
  const [results, setResults] = useState(null);
  const resultsRef = useRef(null);

  // Reset all data
  const handleReset = () => {
    setMode('detailed');
    setSemesters([{ sgpa: '', credits: '' }]);
    setQuickData({ cgpa: '', credits: '' });
    setStrategy('next');
    setFutureCredits('');
    setTargetCGPA('');
    setResults(null);
    localStorage.clear();
  };

  // Calculate projections
  const calculateProjections = () => {
    // 1. Get Past Data
    let pastPoints = 0;
    let pastCredits = 0;

    if (mode === 'detailed') {
      semesters.forEach(sem => {
        const sgpa = parseFloat(sem.sgpa);
        const credits = parseFloat(sem.credits);
        if (!isNaN(sgpa) && !isNaN(credits)) {
          pastPoints += sgpa * credits;
          pastCredits += credits;
        }
      });
    } else {
      const cgpa = parseFloat(quickData.cgpa);
      const credits = parseFloat(quickData.credits);
      if (!isNaN(cgpa) && !isNaN(credits)) {
        pastPoints = cgpa * credits;
        pastCredits = credits;
      }
    }

    if (pastCredits === 0) {
      alert('Please enter valid past grades.');
      return;
    }

    // 2. Get Future Data
    const futureCreditsVal = parseFloat(futureCredits);
    const target = parseFloat(targetCGPA);

    if (isNaN(futureCreditsVal)) {
      alert('Please enter future credit information.');
      return;
    }

    let creditsToEarn = 0;
    let totalCredits = 0;

    if (strategy === 'next') {
      creditsToEarn = futureCreditsVal;
      totalCredits = pastCredits + creditsToEarn;
    } else {
      totalCredits = futureCreditsVal;
      creditsToEarn = totalCredits - pastCredits;
      if (creditsToEarn <= 0) {
        alert('Total credits must be more than past credits.');
        return;
      }
    }

    const currentCGPA = pastPoints / pastCredits;
    const maxPossibleCGPA = (pastPoints + (10 * creditsToEarn)) / totalCredits;

    // 3. Calculate required SGPA and difficulty
    let requiredSGPA = null;
    let difficulty = '';
    let isGoalReachable = true;

    if (!isNaN(target)) {
      const requiredPoints = (target * totalCredits) - pastPoints;
      requiredSGPA = requiredPoints / creditsToEarn;
      const gap = requiredSGPA - currentCGPA;

      if (requiredSGPA > 10) {
        difficulty = 'IMPOSSIBLE';
        isGoalReachable = false;
      } else if (requiredSGPA <= currentCGPA) {
        difficulty = 'COMFORTABLE';
      } else if (gap < 0.5) {
        difficulty = 'EASY REACH';
      } else if (gap < 1.0) {
        difficulty = 'MODERATE';
      } else {
        difficulty = 'HARD GRIND';
      }
    }

    // 4. Generate scenarios
    const scenarios = [];
    for (let sgpa = 10; sgpa >= 4; sgpa -= 0.5) {
      const projectedCGPA = (pastPoints + (sgpa * creditsToEarn)) / totalCredits;
      const change = projectedCGPA - currentCGPA;
      scenarios.push({
        sgpa,
        newCGPA: projectedCGPA,
        change
      });
    }

    // 5. Set results
    setResults({
      currentCGPA,
      pastCredits,
      targetCGPA: !isNaN(target) ? target : null,
      requiredSGPA,
      maxPossibleCGPA,
      isGoalReachable,
      difficulty,
      scenarios
    });

    // Scroll to results
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <>
      {/* Decorative balloon background */}
      <div className="balloon-decoration" aria-hidden="true" />

      <div className="container">
        <Header onReset={handleReset} />

        <HistoryCard
          mode={mode}
          setMode={setMode}
          semesters={semesters}
          setSemesters={setSemesters}
          quickData={quickData}
          setQuickData={setQuickData}
        />

        <StrategyCard
          strategy={strategy}
          setStrategy={setStrategy}
          futureCredits={futureCredits}
          setFutureCredits={setFutureCredits}
          targetCGPA={targetCGPA}
          setTargetCGPA={setTargetCGPA}
        />

        <button className="btn-calculate" onClick={calculateProjections}>
          ✨ Calculate Projection
        </button>

        <div ref={resultsRef}>
          <Results results={results} />
        </div>
      </div>
    </>
  );
}

export default App;
