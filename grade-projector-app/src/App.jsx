import React, { useState, useRef, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiActivity, FiTrash2, FiCheck, FiInfo } from 'react-icons/fi';
import useLocalStorage from './hooks/useLocalStorage';
import Header from './components/Header';
import HistoryCard from './components/HistoryCard';
import StrategyCard from './components/StrategyCard';
import Results from './components/Results';
import AnimatedButton from './components/AnimatedButton';
import FloatingLines from './components/FloatingLines';
import Galaxy from './components/Galaxy';
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

  // --- Helper: Fixes Floating Point Math (e.g. 24.30000004 -> 24.3) ---
  const sanitize = (num) => Math.round(num * 10000) / 10000;

  // Load example data
  const loadExampleData = () => {
    toast.dismiss();
    setMode('detailed');
    setSemesters([
      { sgpa: '8.5', credits: '24' },
      { sgpa: '8.8', credits: '24' },
      { sgpa: '9.0', credits: '24' }
    ]);
    setStrategy('next');
    setFutureCredits('24');
    setTargetCGPA('9.0');
    toast.success('Example data loaded!', { icon: <FiCheck />, id: 'load-example' });
  };

  // Reset all data
  const handleReset = () => {
    toast.dismiss();
    setMode('detailed');
    setSemesters([{ sgpa: '', credits: '' }]);
    setQuickData({ cgpa: '', credits: '' });
    setStrategy('next');
    setFutureCredits('');
    setTargetCGPA('');
    setResults(null);
    localStorage.clear();
    toast.success('All data cleared!', { icon: <FiTrash2 />, id: 'reset-data' });
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
        toast('Results cleared', { icon: <FiTrash2 />, id: 'clear-results' });
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
            // Fix: Sanitize immediately to prevent error accumulation
            pastPoints += sanitize(sgpa * credits);
            pastCredits += credits;
          }
        });
      } else {
        const cgpa = parseFloat(quickData.cgpa);
        const credits = parseFloat(quickData.credits);
        if (!isNaN(cgpa) && !isNaN(credits)) {
          pastPoints = sanitize(cgpa * credits);
          pastCredits = credits;
        }
      }

      if (pastCredits === 0) {
        toast.error('Please enter valid past grades.', { icon: <FiInfo />, id: 'err-past-grades' });
        setIsCalculating(false);
        return;
      }

      // 2. Get Future Data
      const futureCreditsVal = parseFloat(futureCredits);
      const target = parseFloat(targetCGPA);

      if (isNaN(futureCreditsVal)) {
        toast.error('Please enter future credit information.', { icon: <FiInfo />, id: 'err-future-credits' });
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
          toast.error('Total credits must be more than past credits.', { icon: <FiInfo />, id: 'err-total-credits' });
          setIsCalculating(false);
          return;
        }
      }

      // Fix: Sanitize divisions for current stats
      const currentCGPA = sanitize(pastPoints / pastCredits);
      const maxPossibleCGPA = sanitize((pastPoints + (10 * creditsToEarn)) / totalCredits);

      // 3. Calculate required SGPA and difficulty
      let requiredSGPA = null;
      let difficulty = '';
      let isGoalReachable = true;

      if (!isNaN(target)) {
        const requiredPoints = (target * totalCredits) - pastPoints;
        requiredSGPA = requiredPoints / creditsToEarn;
        
        // Fix: Sanitize required SGPA result
        requiredSGPA = sanitize(requiredSGPA);
        
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
      // Fix: Use integer-based loop (0 to 30 steps) to avoid floating point errors like 9.6000001
      for (let i = 0; i <= 30; i++) {
        const sgpa = 10 - (i * 0.2);
        
        // Safety break if we go below 0 (unlikely with this loop but good practice)
        if (sgpa < 0) break;

        const projectedTotalPoints = pastPoints + sanitize(sgpa * creditsToEarn);
        const projectedCGPA = sanitize(projectedTotalPoints / totalCredits);
        const change = sanitize(projectedCGPA - currentCGPA);

        scenarios.push({
          sgpa: parseFloat(sgpa.toFixed(1)), // Ensure clean display (e.g. "9.8")
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
          icon: <FiCheck />,
          id: 'calc-success'
        });
      } else if (targetCGPA && !isGoalReachable) {
        toast.error(`Goal unreachable. Max possible: ${maxPossibleCGPA.toFixed(2)}`, {
          duration: 4000,
          icon: <FiInfo />,
          id: 'calc-unreachable'
        });
      } else {
        toast.success('Calculation complete!', { icon: <FiCheck />, id: 'calc-complete' });
      }

      // Scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 300);
  };

  return (
    <>
      <Toaster
        toastOptions={{
          style: {
            background: '#1e1e2e',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)'
          }
        }}
        limit={1}
      />

      {/* Background Effect */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
        <div className="desktop-bg">
          <FloatingLines
            enabledWaves={["top", "middle", "bottom"]}
            lineCount={10}
            lineDistance={89.5}
            bendRadius={25}
            bendStrength={-1}
            interactive={true}
            parallax={true}
            linesGradient={['#6366f1', '#8b5cf6', '#06b6d4']}
          />
        </div>
        <div className="mobile-bg">
          <Galaxy
            mouseRepulsion={true}
            mouseInteraction={true}
            density={1}
            glowIntensity={0.3}
            saturation={0}
            hueShift={140}
            twinkleIntensity={0.3}
            rotationSpeed={0.1}
            repulsionStrength={2}
            autoCenterRepulsion={0}
            starSpeed={0.5}
            speed={1}
          />
        </div>
      </div>

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
              <FiActivity style={{ marginRight: '8px' }} /> Calculate Projection
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
