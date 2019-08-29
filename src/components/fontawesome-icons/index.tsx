import React from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInfo,
  faEdit,
  faMapMarker,
  faDrawPolygon,
  faAngleDown,
} from '@fortawesome/free-solid-svg-icons';
library.add(faInfo, faEdit, faMapMarker, faDrawPolygon, faAngleDown);
export const IconInfo: React.FC = () => <FontAwesomeIcon icon={'info'} />;
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