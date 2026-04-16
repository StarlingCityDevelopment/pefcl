import React from 'react';
import styled from '@emotion/styled';
import theme from '@utils/theme';
import Sidebar from '../Sidebar';

const AppShell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background-color: transparent;
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  pointer-events: none; /* Let clicks through to child container or game background */
`;

const MainContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 1400px;
  height: 800px;
  max-width: 95vw;
  max-height: 90vh;
  overflow: hidden;
  border-radius: 20px;
  color: ${theme.palette.text.primary};
  background-color: ${theme.palette.background.paper};
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.06), 0 24px 80px -16px rgba(0, 0, 0, 0.65),
    0 0 120px -40px rgba(59, 130, 246, 0.06);
  position: relative;
  pointer-events: all; /* Ensure clicks are captured by the main UI */
`;

const ContentArea = styled.main`
  flex: 1;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  background-color: ${theme.palette.background.paper};
  padding: 0;
`;

interface ShellProps {
  children: React.ReactNode;
}

/**
 * The core layout shell for the desktop bank application.
 * Provides the centered container, sidebar, and main content area.
 */
const Shell: React.FC<ShellProps> = ({ children }) => {
  return (
    <AppShell>
      <MainContainer>
        <Sidebar />
        <ContentArea id="main-content">{children}</ContentArea>
      </MainContainer>
    </AppShell>
  );
};

export default Shell;
