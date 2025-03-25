import React, { useState } from 'react';
import styled from 'styled-components';

const Logobtn = () => {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive((prev) => !prev);
  };

  return (
    <StyledWrapper onClick={handleClick}>
      <div className={`button ${isActive ? 'active' : ''}`} data-text="Awesome">
        <span className="actual-text">&nbsp;DisCuss&nbsp;</span>
        <span aria-hidden="true" className="hover-text">&nbsp;DisCuss&nbsp;</span>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  /* Remove default button styling */
  .button {
    margin: 0;
    height: auto;
    background: transparent;
    padding: 0;
    border: none;
    cursor: pointer;
    --border-right: 6px;
    --text-stroke-color: rgba(255,255,255,0.6);
    --animation-color: #37FF8B;
    --fs-size: 2em;
    letter-spacing: 3px;
    text-decoration: none;
    font-size: var(--fs-size);
    font-family: "Arial", sans-serif;
    position: relative;
    text-transform: uppercase;
    color: transparent;
    -webkit-text-stroke: 1px var(--text-stroke-color);
  }

  .hover-text {
    position: absolute;
    box-sizing: border-box;
    content: attr(data-text);
    color: var(--animation-color);
    width: 0%;
    inset: 0;
    border-right: var(--border-right) solid var(--animation-color);
    overflow: hidden;
    transition: 0.5s;
    -webkit-text-stroke: 1px var(--animation-color);
  }

  /* Apply hover effect when active class is present */
  .button.active .hover-text {
    width: 100%;
    filter: drop-shadow(0 0 23px var(--animation-color));
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .button {
      --fs-size: 1.5em;
      letter-spacing: 2px;
    }
  }

  @media (max-width: 480px) {
    .button {
      --fs-size: 1.2em;
      letter-spacing: 1px;
    }
  }
`;

export default Logobtn;
