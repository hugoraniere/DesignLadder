import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface ContextMenuProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement>;
  children: React.ReactNode;
}

export const ContextMenu = ({ isOpen, onClose, triggerRef, children }: ContextMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isOpen || !triggerRef.current || !menuRef.current) return;

    if (isMobile) {
      return;
    }

    const trigger = triggerRef.current.getBoundingClientRect();
    const menu = menuRef.current.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    let top = trigger.bottom + 4;
    let left = trigger.right - menu.width;

    if (left < 8) {
      left = trigger.left;
    }

    if (left + menu.width > viewport.width - 8) {
      left = viewport.width - menu.width - 8;
    }

    if (top + menu.height > viewport.height - 8) {
      top = trigger.top - menu.height - 4;
    }

    if (top < 8) {
      top = 8;
    }

    setPosition({ top, left });
  }, [isOpen, triggerRef, isMobile]);

  if (!isOpen) return null;

  if (isMobile) {
    return createPortal(
      <>
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[100]"
          onClick={onClose}
        />
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-black z-[101] animate-slide-up">
          <div className="p-4">
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
            {children}
          </div>
        </div>
      </>,
      document.body
    );
  }

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-[100]"
        onClick={onClose}
      />
      <div
        ref={menuRef}
        className="fixed bg-white border-2 border-black shadow-lg z-[101]"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
        }}
      >
        {children}
      </div>
    </>,
    document.body
  );
};
