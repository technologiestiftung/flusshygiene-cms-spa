import React from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInfo,
  faEdit,
  faMapMarker,
  faDrawPolygon,
} from '@fortawesome/free-solid-svg-icons';
library.add(faInfo, faEdit, faMapMarker, faDrawPolygon);

export const IconInfo: React.FC = () => <FontAwesomeIcon icon={'info'} />;
export const IconEdit: React.FC = () => <FontAwesomeIcon icon={'edit'} />;
export const IconMapMarker: React.FC = () => (
  <FontAwesomeIcon icon={'map-marker'} />
);
export const IconPolygon: React.FC = () => (
  <FontAwesomeIcon icon={'draw-polygon'} />
);
