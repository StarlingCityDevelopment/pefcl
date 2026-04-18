import styled from '@emotion/styled';
import { Close } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import theme from '@utils/theme';
import { AnimatePresence, motion } from 'motion/react';
import type React from 'react';

const Overlay = styled(motion.div)<{ zIndex: number }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: ${({ zIndex }) => zIndex};
`;

const Panel = styled(motion.div)<{ width?: string; zIndex: number }>`
  padding: 2rem 2.5rem;
  position: absolute;
  width: ${({ width }) => width || 'calc(100% - 5rem)'};
  height: 100%;
  top: 0;
  right: 0;
  background-color: ${theme.palette.background.paper};
  border-left: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: -16px 0 48px rgba(0, 0, 0, 0.3);
  z-index: ${({ zIndex }) => zIndex};
  overflow-y: auto;
`;

const CloseButton = styled(IconButton)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  color: ${theme.palette.text.secondary};
  transition: all 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: ${theme.palette.text.primary};
  }

  svg {
    font-size: 1rem;
  }
`;

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  width?: string;
  children: React.ReactNode;
  zIndex?: number;
}

const SidePanel: React.FC<SidePanelProps> = ({ isOpen, onClose, width, children, zIndex = 100 }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Overlay
            key='side-panel-overlay'
            zIndex={zIndex - 1}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
          />
          <Panel
            key='side-panel-content'
            width={width}
            zIndex={zIndex}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
          >
            <CloseButton
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
            >
              <Close />
            </CloseButton>
            {children}
          </Panel>
        </>
      )}
    </AnimatePresence>
  );
};

export default SidePanel;
