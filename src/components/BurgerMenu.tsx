import React from "react";
import styled from "styled-components";
import { Menu, Sun, Moon, Languages, X } from "lucide-react";
import { useI18n } from "../contexts/I18nContext";
import { storage } from "../utils/storage";
// import { storage } from "../../utils/storage";

const BurgerButton = styled.button<{ $isDarkMode: boolean }>`
  appearance: none;
  border: 0;
  background: transparent;
  cursor: pointer;
  color: ${(p) => (p.$isDarkMode ? "#9da3ae" : "#6b7280")};
  padding: 10px 8px;
  margin-left: auto;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    color: ${(p) => (p.$isDarkMode ? "#e6e6eb" : "#1a1a1f")};
    background: ${(p) => (p.$isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)")};
  }
  
  &:focus-visible {
    box-shadow: 0 0 0 2px #6366f1aa;
  }
`;

const MenuDropdown = styled.div<{ $open: boolean; $isDarkMode: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  background: ${(p) => (p.$isDarkMode ? "#1a1a1f" : "#ffffff")};
  border: 1px solid ${(p) => (p.$isDarkMode ? "#262631" : "#e5e7eb")};
  border-radius: 12px;
  box-shadow: ${(p) => p.$isDarkMode 
    ? "0 8px 32px rgba(0, 0, 0, 0.3)" 
    : "0 8px 32px rgba(0, 0, 0, 0.1)"
  };
  min-width: 200px;
  z-index: 1000;
  opacity: ${(p) => (p.$open ? 1 : 0)};
  visibility: ${(p) => (p.$open ? 'visible' : 'hidden')};
  transform: ${(p) => (p.$open ? 'translateY(0)' : 'translateY(-8px)')};
  transition: all 0.2s ease;
  margin-top: 8px;
`;

const MenuItem = styled.button<{ $isDarkMode: boolean }>`
  appearance: none;
  border: 0;
  background: transparent;
  cursor: pointer;
  color: ${(p) => (p.$isDarkMode ? "#e6e6eb" : "#1a1a1f")};
  padding: 12px 16px;
  width: 100%;
  text-align: left;
  font-size: 14px;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid ${(p) => (p.$isDarkMode ? "#262631" : "#e5e7eb")};
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: ${(p) => (p.$isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)")};
  }
  
  &:focus-visible {
    outline: 2px solid #6366f1aa;
    outline-offset: -2px;
  }
`;

const StorageSize = styled.span`
  color: #ef4444;
  font-weight: 600;
`;

const ModalOverlay = styled.div<{ $open: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: ${(p) => (p.$open ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
`;

const ModalContent = styled.div<{ $isDarkMode: boolean }>`
  position: relative;
  background: ${(p) => (p.$isDarkMode ? "#1a1a1f" : "#ffffff")};
  border-radius: 16px;
  max-width: 90vw;
  max-height: 90vh;
  overflow: hidden;
  transition: background-color 0.3s ease;
`;

const ModalImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  appearance: none;
  border: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  cursor: pointer;
  padding: 8px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.9);
  }
`;

type BurgerMenuProps = {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onToggleLanguage: () => void;
  storageSize: number;
};

export const BurgerMenu = ({ 
  isDarkMode, 
  onToggleDarkMode, 
  onToggleLanguage, 
  storageSize 
}: BurgerMenuProps) => {
  const { language, t } = useI18n();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [pwaModalOpen, setPwaModalOpen] = React.useState(false);
  const [demoModalOpen, setDemoModalOpen] = React.useState(false);

  // Effacer le localStorage
  const clearStorage = React.useCallback(async () => {
    try {
      await storage.removeItem("cal-history-v1");
      await storage.removeItem("cal-recents-v1");
      await storage.removeItem("cal-favorites-v1");
      // Effacer aussi le localStorage directement
      localStorage.clear();
      setMenuOpen(false);
      // Recharger la page pour mettre à jour l'interface
      window.location.reload();
    } catch (error) {
      console.error("Erreur lors de l'effacement des données:", error);
    }
  }, []);

  // Fermer le menu quand on clique ailleurs
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuOpen) {
        // Ne pas fermer si on clique dans le menu déroulant ou sur le bouton burger
        const target = event.target as Element;
        if (!target.closest('[data-menu-dropdown]') && !target.closest('[data-burger-button]')) {
          setMenuOpen(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  return (
    <>
      <BurgerButton
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menu"
        aria-expanded={menuOpen}
        data-burger-button
        $isDarkMode={isDarkMode}
      >
        <Menu size={20} />
      </BurgerButton>
      
      <MenuDropdown $open={menuOpen} $isDarkMode={isDarkMode} data-menu-dropdown onClick={(e) => e.stopPropagation()}>
        <MenuItem $isDarkMode={isDarkMode} onClick={(e) => {
          e.stopPropagation();
          onToggleDarkMode();
          setMenuOpen(false);
        }}>
          {isDarkMode ? <Sun size={16} style={{ marginRight: '8px' }} /> : <Moon size={16} style={{ marginRight: '8px' }} />}
          {isDarkMode ? t('app.menu.lightMode') : t('app.menu.darkMode')}
        </MenuItem>
        <MenuItem $isDarkMode={isDarkMode} onClick={(e) => {
          e.stopPropagation();
          onToggleLanguage();
          setMenuOpen(false);
        }}>
          <Languages size={16} style={{ marginRight: '8px' }} />
          {t('app.menu.language')} ({language === 'fr' ? 'FR 🇫🇷' : 'EN 🇺🇸'}) {'->'} {language === 'fr' ? 'EN 🇺🇸' : 'FR 🇫🇷'}
        </MenuItem>
        <MenuItem $isDarkMode={isDarkMode} onClick={(e) => {
          e.stopPropagation();
          setPwaModalOpen(true);
          setMenuOpen(false);
        }}>
          {t('app.menu.demo')}
        </MenuItem>
        <MenuItem $isDarkMode={isDarkMode} onClick={(e) => {
          e.stopPropagation();
          setDemoModalOpen(true);
          setMenuOpen(false);
        }}>
          {t('app.menu.installation')}
        </MenuItem>
        <MenuItem $isDarkMode={isDarkMode} onClick={(e) => {
          e.stopPropagation();
          clearStorage();
        }}>
          {t('app.menu.clearData')} (<StorageSize>{storageSize} Mo</StorageSize>)
        </MenuItem>
      </MenuDropdown>

      {/* Modal PWA */}
      <ModalOverlay $open={pwaModalOpen} onClick={() => setPwaModalOpen(false)}>
        <ModalContent $isDarkMode={isDarkMode} onClick={(e) => e.stopPropagation()}>
          <CloseButton onClick={() => setPwaModalOpen(false)}>
            {t('app.menu.close')}<X size={20} />
          </CloseButton>
          <ModalImage 
            src="/cal/pwa_ios.png" 
            alt={t('app.menu.installInstructions')}
          />
        </ModalContent>
      </ModalOverlay>
      
      {/* Modal Demo */}
      <ModalOverlay $open={demoModalOpen} onClick={() => setDemoModalOpen(false)}>
        <ModalContent $isDarkMode={isDarkMode} onClick={(e) => e.stopPropagation()}>
          <CloseButton onClick={() => setDemoModalOpen(false)}>
            {t('app.menu.close')}<X size={20} />
          </CloseButton>
          <ModalImage 
            src="/cal/demo.gif" 
            alt={t('app.menu.demoAlt')}
          />
        </ModalContent>
      </ModalOverlay>
    </>
  );
};
