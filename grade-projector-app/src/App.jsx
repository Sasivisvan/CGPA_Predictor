import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import useLocalStorage from './hooks/useLocalStorage';
import Header from './components/Header';
import HistoryCard from './components/HistoryCard';
import StrategyCard from './components/StrategyCard';
import Results from './components/Results';
import AnimatedButton from './components/AnimatedButton';
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
  const [isCalculating, setIsCalculating] = useState(false);
  const resultsRef = useRef(null);

  // Load example data
  const loadExampleData = () => {
    setMode('detailed');
    setSemesters([
      { sgpa: '8.5', credits: '24' },
      { sgpa: '8.8', credits: '24' },
      { sgpa: '9.0', credits: '24' }
    ]);
    setStrategy('next');
    setFutureCredits('24');
    setTargetCGPA('9.0');
    toast.success('Example data loaded! Click Calculate to see results.', { duration: 3000 });
  };

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
    toast.success('All data cleared!');
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ctrl/Cmd + Enter to calculate
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!isCalculating) {
          calculateProjections();
        }
      }
      // Escape to clear results
      if (e.key === 'Escape' && results) {
        setResults(null);
        toast('Results cleared', { icon: '🗑️' });
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results, isCalculating]);

  // Calculate projections
  const calculateProjections = () => {
    setIsCalculating(true);
    
    // Simulate a small delay for better UX
    setTimeout(() => {
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
        toast.error('Please enter valid past grades.');
        setIsCalculating(false);
        return;
      }

      // 2. Get Future Data
      const futureCreditsVal = parseFloat(futureCredits);
      const target = parseFloat(targetCGPA);

      if (isNaN(futureCreditsVal)) {
        toast.error('Please enter future credit information.');
        setIsCalculating(false);
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
          toast.error('Total credits must be more than past credits.');
          setIsCalculating(false);
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

      setIsCalculating(false);
      
      // Success toast with context
      if (targetCGPA && isGoalReachable) {
        toast.success(`Goal is ${difficulty}! Required SGPA: ${requiredSGPA.toFixed(2)}`, {
          duration: 4000,
        });
      } else if (targetCGPA && !isGoalReachable) {
        toast.error(`Goal unreachable. Max possible: ${maxPossibleCGPA.toFixed(2)}`, {
          duration: 4000,
        });
      } else {
        toast.success('Calculation complete! 🎉', { icon: '✨' });
      }

      // Scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 300);
  };

  return (
    <>
      {/* Decorative gradient background */}
      <div className="balloon-decoration" aria-hidden="true" />

      <motion.div
        className="container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Header onReset={handleReset} onLoadExample={loadExampleData} />

        <div className="layout-grid">
          <section
            className="layout-main"
            aria-label="Enter your academic history and goals"
          >
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

            <AnimatedButton
              onClick={calculateProjections}
              isLoading={isCalculating}
            >
              ✨ Calculate Projection
            </AnimatedButton>
          </section>

          <aside
            className="layout-side"
            aria-label="Projection results"
            ref={resultsRef}
          >
            <Results results={results} />

            {!results && (
              <div className="results-empty">
                <h3 className="results-empty-title">
                  Your projection will appear here
                </h3>
                <p className="results-empty-text">
                  Add your grades and target, then run a projection to see
                  how your CGPA could evolve.
                </p>
              </div>
            )}
          </aside>
        </div>
      </motion.div>
    </>
  );
}

export default App;
