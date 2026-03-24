import styled from "styled-components";

export const SubTitle = styled.h2<{ $isDarkMode: boolean }>`
  color: ${(p) => (p.$isDarkMode ? "#e6e6eb" : "#1a1a1f")};
  font-weight: 700;
  margin-top: 4px;
  margin-bottom: 4px;
  font-size: 16px;
  text-align: center;
  transition: color 0.3s ease;
`;

export const CalendarStrip = styled.div<{ $isDarkMode?: boolean }>`
  height: 72px;
  overflow-x: auto;
  display: flex;
  gap: 12px;
  padding: 8px 0 12px;
  scrollbar-width: thin;
  scrollbar-color: ${(p) => 
    p.$isDarkMode ? "rgba(255, 255, 255, 0.1) transparent" : "rgba(0, 0, 0, 0.1) transparent"
  };
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${(p) => 
      p.$isDarkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)"
    };
    border-radius: 2px;
  }
`;

export const DayPill = styled.button<{ $selected?: boolean; $isDarkMode: boolean }>`
  height: 52px;
  width: 60px;
  min-width: 60px;
  border-radius: 16px;
  border: 1px solid ${(p) => (p.$selected 
    ? "transparent" 
    : (p.$isDarkMode ? "rgba(255, 255, 255, 0.38)" : "#e5e7eb")
  )};
  background: ${(p) => p.$selected 
    ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" 
    : (p.$isDarkMode ? "rgba(19, 19, 26, 0.6)" : "rgba(249, 250, 251, 0.8)")
  };
  backdrop-filter: ${(p) => p.$selected ? "none" : "blur(10px)"};
  -webkit-backdrop-filter: ${(p) => p.$selected ? "none" : "blur(10px)"};
  color: ${(p) => p.$selected ? "#ffffff" : (p.$isDarkMode ? "#e6e6eb" : "#1a1a1f")};
  font-weight: 700;
  white-space: pre-line;
  display: grid;
  place-items: center;
  cursor: pointer;
  box-shadow: ${(p) => p.$selected 
    ? "0 4px 12px rgba(99, 102, 241, 0.4), 0 2px 4px rgba(0, 0, 0, 0.1)" 
    : (p.$isDarkMode 
      ? "0 2px 8px rgba(0, 0, 0, 0.2)" 
      : "0 2px 8px rgba(0, 0, 0, 0.05)")
  };
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:active {
    transform: scale(0.95);
  }
  
  &:hover:not(:active) {
    transform: ${(p) => p.$selected ? "none" : "translateY(-2px)"};
    box-shadow: ${(p) => p.$selected 
      ? "0 4px 12px rgba(99, 102, 241, 0.4)" 
      : (p.$isDarkMode 
        ? "0 4px 12px rgba(0, 0, 0, 0.3)" 
        : "0 4px 12px rgba(0, 0, 0, 0.1)")
    };
  }
`;

export const Card = styled.div<{ $isDarkMode: boolean }>`
  margin-top: 2px;
  padding: 4px;
  border-radius: 16px;
  background-color: ${(p) => (p.$isDarkMode ? "#13131a" : "#f9fafb")};
  border: 1px solid ${(p) => (p.$isDarkMode ? "rgba(255, 255, 255, 0.32)" : "rgba(0, 0, 0, 0.08)")};
  box-shadow: ${(p) => p.$isDarkMode 
    ? "0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.02)" 
    : "0 4px 20px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.04)"
  };
  display: grid;
  gap: 6px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:active {
    transform: scale(0.98);
    box-shadow: ${(p) => p.$isDarkMode 
      ? "0 2px 10px rgba(0, 0, 0, 0.2)" 
      : "0 2px 10px rgba(0, 0, 0, 0.05)"
    };
  }
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
`;

export const ProductName = styled.div<{ $isDarkMode: boolean }>`
  color: ${(p) => (p.$isDarkMode ? "#c7c7d1" : "#1a1a1f")};
  font-size: 15px;
  font-weight: 600;
  line-height: 1.3;
  transition: color 0.3s ease;
`;

export const InlineHint = styled.span<{ $isDarkMode: boolean }>`
  color: ${(p) => (p.$isDarkMode ? "#6b7280" : "#9ca3af")};
  font-size: 12px;
  margin-left: 6px;
  transition: color 0.3s ease;
`;

export const Label = styled.span<{ $isDarkMode: boolean }>`
  color: ${(p) => (p.$isDarkMode ? "#9da3ae" : "#6b7280")};
  transition: color 0.3s ease;
`;

export const Value = styled.span<{ $isDarkMode: boolean }>`
  color: ${(p) => (p.$isDarkMode ? "#e6e6eb" : "#1a1a1f")};
  font-weight: 700;
  font-size: 16px;
  transition: color 0.3s ease;
`;

export const Hint = styled.p<{ $isDarkMode: boolean }>`
  color: ${(p) => (p.$isDarkMode ? "#6b7280" : "#9ca3af")};
  margin: 4px 0;
  font-size: 13px;
  transition: color 0.3s ease;
`;

export const IconButton = styled.button`
  padding: 8px;
  margin-left: 8px;
  border: 0;
  background: transparent;
  cursor: pointer;
`;

export const QtyInput = styled.input<{ $isDarkMode: boolean }>`
  width: 70px;
  height: 28px !important;
  min-height: 28px !important;
  padding: 0 6px;
  border-radius: 8px;
  background-color: ${(p) => (p.$isDarkMode ? "rgba(70, 70, 74, 0.6)" : "rgba(255, 255, 255, 0.9)")};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: ${(p) => (p.$isDarkMode ? "#f5f5f7" : "#1a1a1f")};
  text-align: center;
  border: 1px solid ${(p) => (p.$isDarkMode ? "rgba(255, 255, 255, 0.32)" : "#e5e7eb")};
  font-size: 13px;
  font-weight: 600;
  box-shadow: ${(p) => p.$isDarkMode 
    ? "0 2px 6px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)" 
    : "0 2px 6px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)"
  };
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:focus {
    outline: none;
    border-color: ${(p) => (p.$isDarkMode ? "#8b5cf6" : "#6366f1")};
    box-shadow: ${(p) => p.$isDarkMode 
      ? "0 0 0 3px rgba(139, 92, 246, 0.2), 0 4px 12px rgba(0, 0, 0, 0.3)" 
      : "0 0 0 3px rgba(99, 102, 241, 0.2), 0 4px 12px rgba(0, 0, 0, 0.1)"
    };
  }
`;

export const LeftRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const Trash = styled.span`
  color: #ef4444;
  font-weight: 900;
  font-size: 16px;
`;

export const ListScroll = styled.div`
  flex: 1;
  overflow-y: auto;
  max-height: calc(100vh - 260px);
  padding-right: 4px;
`;
// ----- Progress bars -----
export const ProgressWrap = styled.div`
  display: grid;
  gap: 8px;
  margin: 6px 0 10px;
`;

export const LegendRow = styled.div<{ $isDarkMode: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${(p) => (p.$isDarkMode ? "#9da3ae" : "#6b7280")};
  font-weight: 600;
  transition: color 0.3s ease;
`;

export const Pct = styled.span<{ $over?: boolean }>`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${(p) => (p.$over ? "#ef4444" : "white")};
  font-weight: 800;
`;

export const Track = styled.div<{ $isDarkMode: boolean }>`
  height: 24px;
  border-radius: 12px;
  background: ${(p) => (p.$isDarkMode ? "rgba(35, 35, 43, 0.6)" : "rgba(229, 231, 235, 0.8)")};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  overflow: hidden;
  position: relative;
  box-shadow: ${(p) => p.$isDarkMode 
    ? "inset 0 2px 4px rgba(0, 0, 0, 0.3)" 
    : "inset 0 2px 4px rgba(0, 0, 0, 0.1)"
  };
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
`;

export const Fill = styled.div<{ $pct: number; $color: string }>`
  width: ${(p) => Math.min(100, p.$pct)}%;
  height: 100%;
  background: ${(p) => p.$color};
  border-radius: 12px 0 0 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    animation: shimmer 2s infinite;
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

export const PctLeft = styled.span<{ $over?: boolean; $isDarkMode: boolean }>`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: ${(p) => (p.$over ? "#ef4444" : (p.$isDarkMode ? "white" : "#1a1a1f"))};
  font-weight: 800;
  font-size: 12px;
  pointer-events: none;
  transition: color 0.3s ease;
`;

export const RightInfo = styled.div<{ $isDarkMode: boolean }>`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 8px;
  align-items: center;
  color: ${(p) => (p.$isDarkMode ? "rgb(255, 255, 255)" : "#1a1a1f")};
  font-weight: 500;
  font-size: 12px;
  white-space: nowrap;
  pointer-events: none; /* pas cliquable */
  transition: color 0.3s ease;
`;
