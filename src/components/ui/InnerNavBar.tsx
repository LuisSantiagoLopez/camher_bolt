import React, { useRef, useEffect } from 'react';

interface InnerNavProps {
  approveButton: () => void;
  currentButton: () => void;
  cancelButton: () => void;
  setIsExpanded: (value: boolean) => void;
  tabState?: string;
  leftButton?: string;
  rightButton?: string;
  middleButton?: string;
}

const Navigation = ({
  approveButton,
  currentButton,
  cancelButton,
  setIsExpanded,
  leftButton,
  rightButton,
  middleButton,
}: InnerNavProps) => {
  const navRef = useRef<HTMLButtonElement>(null);

  const rightButtonRef = useRef<HTMLButtonElement>(null);
  const leftButtonRef = useRef<HTMLButtonElement>(null);
  const middleButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const storedTab = sessionStorage.getItem('currentTab');
    if (storedTab === 'Left') {
      leftButtonRef.current?.focus();
    } else if (storedTab === 'Middle') {
      middleButtonRef.current?.focus();
    } else if (storedTab === 'Right') {
      rightButtonRef.current?.focus();
    } else {
      leftButtonRef.current?.focus();
    }
  }, []);

  const handleNavClick = (callback: () => void) => {
    setIsExpanded(false);
    callback();
  };

  return (
    <nav className="flex h-14 w-full justify-evenly">
      <button
        className="nvrButton hover:bg-green-100 focus:bg-camhergreen"
        onClick={() => handleNavClick(approveButton)}
        ref={leftButtonRef}
      >
        {leftButton ? leftButton : 'Aprobadas'}
      </button>
      <button
        className="nvrButton hover:bg-blue-100 focus:bg-blue-200"
        onClick={() => handleNavClick(currentButton)}
        ref={middleButtonRef}
      >
        {middleButton ? middleButton : 'Actuales'}
      </button>
      <button
        className="nvrButton hover:bg-red-100 focus:bg-red-200"
        onClick={() => handleNavClick(cancelButton)}
        ref={rightButtonRef}
      >
        {rightButton ? rightButton : 'Canceladas'}
      </button>
    </nav>
  );
};

export default Navigation;
