import React from 'react';
import { IconInfo, IconPolygon, IconMapMarker } from '../fa-icons';

const Button = (props) => {
  return (
    <button
      data-testid='map-toolbar-i-button'
      className={`button is-small is-badge-small ${
        props.isActive ? 'is-active' : ''
      }`}
      onClick={props.handleClick}
      id={props.id}
    >
      <span className='icon is-small'>{props.children}</span>
    </button>
  );
};
export const SpotEditorMapToolbar: React.FC<{
  handleClick: (event: any) => void;
  activeEditor: 'location' | 'area' | undefined;
}> = ({ handleClick, activeEditor }) => {
  return (
    <div className='buttons'>
      <Button handleClick={handleClick} id={'info'} isActive={false}>
        <IconInfo />
      </Button>
      <Button
        handleClick={handleClick}
        id={'area'}
        isActive={activeEditor === 'area' ? true : false}
      >
        <IconPolygon />
      </Button>
      <Button
        handleClick={handleClick}
        id={'location'}
        isActive={activeEditor === 'location' ? true : false}
      >
        <IconMapMarker />
      </Button>
    </div>
  );
};
