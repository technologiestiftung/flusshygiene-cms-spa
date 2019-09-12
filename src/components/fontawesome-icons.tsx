import React from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInfo,
  faEdit,
  faMapMarker,
  faDrawPolygon,
  faAngleDown,
  faFileCsv,
  faFileUpload,
  faForward,
  faBackward,
  faSave,
  faWindowClose,
} from '@fortawesome/free-solid-svg-icons';
library.add(
  faInfo,
  faEdit,
  faMapMarker,
  faDrawPolygon,
  faAngleDown,
  faFileCsv,
  faFileUpload,
  faBackward,
  faForward,
  faSave,
  faWindowClose,
);
export const IconInfo: React.FC = () => <FontAwesomeIcon icon={'info'} />;
export const IconCloseWin: React.FC = () => (
  <FontAwesomeIcon icon={'window-close'} />
);
export const IconAngleDown: React.FC = () => (
  <FontAwesomeIcon icon={'angle-down'} />
);
export const IconEdit: React.FC = () => <FontAwesomeIcon icon={'edit'} />;
export const IconMapMarker: React.FC = () => (
  <FontAwesomeIcon icon={'map-marker'} />
);
export const IconPolygon: React.FC = () => (
  <FontAwesomeIcon icon={'draw-polygon'} />
);

export const IconCSV: React.FC = () => <FontAwesomeIcon icon={'file-csv'} />;
export const IconFileUplad: React.FC = () => (
  <FontAwesomeIcon icon={'file-upload'} />
);

export const IconPrev: React.FC = () => <FontAwesomeIcon icon={'backward'} />;
export const IconNext: React.FC = () => <FontAwesomeIcon icon={'forward'} />;
export const IconSave: React.FC = () => <FontAwesomeIcon icon={'save'} />;