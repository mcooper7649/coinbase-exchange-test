import { useState } from 'react';
import './Tooltip.styles.css';

export const Tooltip = ({ children, text, ...rest }) => {
  const [show, setShow] = useState(false);
  const [delayHandler, setDelayHandler] = useState(null);

  const handleMouseEnter = (event) => {
    setDelayHandler(
      setTimeout(() => {
        setShow(true);
      }, 100)
    );
  };

  const handleMouseLeave = () => {
    setShow(false);
    clearTimeout(delayHandler);
  };

  return (
    <div className="tooltip-container">
      <div className={show ? 'tooltip-box visible' : 'tooltip-box'}>
        {text}
        <span className="tooltip-arrow" />
      </div>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...rest}
      >
        {children}
      </div>
    </div>
  );
};
