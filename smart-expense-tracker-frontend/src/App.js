import React, { useState, useEffect, useRef, useMemo } from "react";
import styled, { keyframes } from "styled-components";
import axios from "axios";
import WelcomeScreen from "./WelcomeScreen";
import ExpenseForm from "./ExpenseForm";

const CATEGORY_URL = "http://localhost:5251/api/expenses/categories";

const AppBackground = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', Arial, sans-serif;
  overflow: hidden;
  position: relative;
`;

const RevealMask = styled.div`
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 10;
  background: transparent;
`;

const radialReveal = keyframes`
  0% {
    clip-path: circle(0% at 50% 50%);
  }
  100% {
    clip-path: circle(150% at 50% 50%);
  }
`;

const RevealContent = styled.div`
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 5;
  clip-path: circle(0% at 50% 50%);
  animation: ${radialReveal} 1.0s cubic-bezier(0.77,0,0.175,1) forwards;
  text-align: center;
`;

const Prompt = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #2d1e6b;
  margin-bottom: 2.5rem;
  margin-top: 0;
  text-align: center;
`;

const bubbleFadeIn = keyframes`
  from { opacity: 0; transform: scale(0.7); }
  to { opacity: 1; transform: scale(1); }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0) scale(1); }
  25% { transform: translateY(-15px) scale(1.05); }
  50% { transform: translateY(0) scale(1); }
  75% { transform: translateY(-8px) scale(1.02); }
`;

const moveBubble = keyframes`
  0% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-30px) scale(1.08); }
  100% { transform: translateY(0) scale(1); }
`;

const BubblesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const Bubble = styled.div`
  background: linear-gradient(135deg, #8ec5fc 0%, #e0c3fc 100%);
  color: #2d1e6b;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 24px rgba(31, 38, 135, 0.10);
  opacity: 0;
  animation: ${bubbleFadeIn} 0.7s forwards, ${bounce} 3s infinite ease-in-out;
  animation-delay: ${props => props.index * 0.15 + 1.2}s, ${props => props.index * 0.15 + 2.0}s;
  padding: 0.5rem;
  text-align: center;
  word-break: break-word;
  white-space: normal;
  line-height: 1.2;
  margin: 0.5rem;
  cursor: pointer;
  transition: transform 0.2s ease;
  ${({ children }) => {
    const len = String(children).length;
    if (len <= 6) return `
      width: 90px;
      height: 90px;
      font-size: 1.1rem;
    `;
    if (len <= 10) return `
      width: 110px;
      height: 110px;
      font-size: 1.05rem;
    `;
    if (len <= 14) return `
      width: 130px;
      height: 130px;
      font-size: 1rem;
    `;
    return `
      width: 150px;
      height: 150px;
      font-size: 0.95rem;
    `;
  }}
  border-radius: 50%;
  &:hover {
    transform: scale(1.05);
  }
`;

const SurroundContainer = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%);
  overflow: hidden;
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const CenterPrompt = styled(Prompt)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
  z-index: 2;
  animation: ${fadeOut} 0.8s forwards;
  animation-delay: 1.2s;
`;

const popIn = keyframes`
  from { opacity: 0; transform: scale(0.5); }
  to { opacity: 1; transform: scale(1); }
`;

const AnimatedBubble = styled(Bubble)`
  opacity: 0;
  animation: ${bubbleFadeIn} 0.7s forwards, ${bounce} 3s infinite ease-in-out;
  animation-delay: ${props => 2.0 + props.index * 0.12}s, ${props => 2.0 + props.index * 0.12}s;
`;

const generateRandomPositions = (count, containerWidth, containerHeight, bubbleSize) => {
  const positions = [];
  const margin = bubbleSize * 0.75; // 75% of bubble size for margin
  const minDistance = bubbleSize * 1.2; // 20% more than bubble size for spacing
  const maxAttempts = 500; // Increased attempts for better positioning
  const centerMargin = bubbleSize * 1.5; // Distance to keep from center
  const edgeMargin = 30; // Define an edge margin (e.g., 30 pixels)

  // Helper function to check if a position is valid
  const isValidPosition = (newPos, existingPositions) => {
    // Check if position is within container bounds with edge margin
    if (newPos.x < margin + edgeMargin || newPos.x > containerWidth - margin - edgeMargin ||
        newPos.y < margin + edgeMargin || newPos.y > containerHeight - margin - edgeMargin) {
      return false;
    }

    // Check distance from center
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;
    const dx = newPos.x - centerX;
    const dy = newPos.y - centerY;
    const distanceFromCenter = Math.sqrt(dx * dx + dy * dy);
    if (distanceFromCenter < centerMargin) {
      return false;
    }

    // Check distance from all existing positions
    return existingPositions.every(pos => {
      const dx = pos.x - newPos.x;
      const dy = pos.y - newPos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance >= minDistance;
    });
  };

  // Helper function to generate a random position
  const generateRandomPosition = () => ({
    x: margin + Math.random() * (containerWidth - 2 * margin),
    y: margin + Math.random() * (containerHeight - 2 * margin)
  });

  // Try to position each bubble
  for (let i = 0; i < count; i++) {
    let position;
    let attempts = 0;
    let valid = false;

    while (!valid && attempts < maxAttempts) {
      position = generateRandomPosition();
      valid = isValidPosition(position, positions);
      attempts++;
    }

    // If we couldn't find a valid position after max attempts,
    // try to find the best possible position
    if (!valid) {
      let bestPosition = null;
      let bestDistance = 0;

      // Try a few more positions and pick the one with the most space
      for (let j = 0; j < 50; j++) {
        const testPos = generateRandomPosition();
        const minDist = Math.min(
          ...positions.map(pos => {
            const dx = pos.x - testPos.x;
            const dy = pos.y - testPos.y;
            return Math.sqrt(dx * dx + dy * dy);
          })
        );

        if (minDist > bestDistance) {
          bestDistance = minDist;
          bestPosition = testPos;
        }
      }

      position = bestPosition || generateRandomPosition();
    }

    positions.push(position);
  }

  return positions;
};

function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showReveal, setShowReveal] = useState(false);
  const [categories, setCategories] = useState(["Food", "Transport", "Utilities", "Investments"]);
  const [revealStarted, setRevealStarted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  const surroundRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      setContainerSize({ width: window.innerWidth, height: window.innerHeight });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const bubblePositions = useMemo(() => {
    if (
      Array.isArray(categories) &&
      categories.length > 0 &&
      containerSize.width > 0 &&
      containerSize.height > 0
    ) {
      return generateRandomPositions(categories.length, containerSize.width, containerSize.height, 180);
    }
    return [];
  }, [categories, containerSize.width, containerSize.height]);

  // Fetch predefined categories from the API
  useEffect(() => {
    axios.get(CATEGORY_URL)
      .then(response => {
        const cats = Array.isArray(response.data) ? response.data : [];
        if (!cats.includes("Investments")) {
          cats.push("Investments");
        }
        setCategories(cats);
      })
      .catch(error => {
        console.error("Error fetching categories:", error);
        setCategories(["Food", "Transport", "Utilities", "Investments"]);
      });
  }, []);

  // After welcome, show reveal screen
  useEffect(() => {
    if (!showWelcome) {
      setTimeout(() => setRevealStarted(true), 50);
      setTimeout(() => setShowReveal(true), 1250);
    }
  }, [showWelcome]);

  const handleBubbleClick = (category, position) => {
    setSelectedCategory(category);
    setClickPosition(position);
  };

  const handleFormClose = () => {
    setSelectedCategory(null);
  };

  return (
    <AppBackground>
      {showWelcome && (
        <WelcomeScreen onFinish={() => setShowWelcome(false)} />
      )}
      {(!showWelcome && revealStarted) && (
        <RevealContent as={SurroundContainer} ref={surroundRef}>
          <CenterPrompt>What would you like to budget today?</CenterPrompt>
          {(Array.isArray(categories) && Array.isArray(bubblePositions) &&
            categories.length > 0 &&
            bubblePositions.length === categories.length) &&
            categories.map((cat, idx) => {
              const position = bubblePositions[idx];
              return (
                <AnimatedBubble
                  key={cat}
                  index={idx}
                  onClick={() => handleBubbleClick(cat, position)}
                  style={{
                    position: 'absolute',
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    zIndex: 1,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  {cat}
                </AnimatedBubble>
              );
            })}
        </RevealContent>
      )}
      {selectedCategory && (
        <ExpenseForm
          category={selectedCategory}
          position={clickPosition}
          onClose={handleFormClose}
        />
      )}
    </AppBackground>
  );
}

export default App;
