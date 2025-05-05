import React, { useEffect } from "react";
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

const fadeOut = keyframes`
  0% { opacity: 1; }
  100% { opacity: 0; }
`;

const WelcomeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  font-size: 2.2rem;
  font-weight: 700;
  color: #4B0082;
  opacity: 0;
  animation: ${fadeIn} 1.5s 0.5s forwards, ${fadeOut} 1.5s 1.5s forwards;
`;

const WelcomeScreen = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 3500); // 0.5s delay + 1.5s fade in + 1.0s visible + 1.5s fade out
    return () => clearTimeout(timer);
  }, [onFinish]);
  return <WelcomeContainer>Welcome to Smart Expense Tracker!</WelcomeContainer>;
};

export default WelcomeScreen; 