import React from 'react';
import { IconInfo } from '../fa-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faInfo } from '@fortawesome/free-solid-svg-icons';
export const QToolBar: React.FC<{ handleClick: () => void }> = ({
  handleClick,
}) => {
  return (
    // <Container>
    <div className='buttons'>
      <button className='button is-small is-badge-small' onClick={handleClick}>
        <span className='icon is-small'>
          <IconInfo />
        </span>
        {/* <span>Info</span> */}
      </button>
    </div>
    // </Container>
  );
};