import { IBathingspot } from './interfaces';
export const API_DOMAIN =
  'http://flsshygn-dev.eu-central-1.elasticbeanstalk.com';
export const DEFAULT_SPOT_ID = 999999999;

export const DEFAULT_SPOT: IBathingspot = {
  id: DEFAULT_SPOT_ID,
  createdAt: new Date(2525),
  updatedAt: new Date(2525),
  name: 'Lade Daten ',
};
