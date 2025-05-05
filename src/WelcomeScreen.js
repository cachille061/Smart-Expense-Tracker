import React, { useEffect } from "react";
import styled, { keyframes } from "styled-components";

const fadeInOut = keyframes`
  0% { opacity: 0; }
  15% { opacity: 1; }
  85% { opacity: 1; }
  100% { opacity: 0; }
`;

const WelcomeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  font-size: 2.2rem;
  font-weight: 700;
  color: #4f8cff;
  animation: ${fadeInOut} 4s;
`;

const WelcomeScreen = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 3500); // 3.5 seconds
    return () => clearTimeout(timer);
  }, [onFinish]);
  return <WelcomeContainer>Welcome to Smart Expense Tracker!</WelcomeContainer>;
};

export default WelcomeScreen; 