import { IGeoJson, IBathingspot } from './interfaces';
import { FormikProps, FormikHelpers } from 'formik';

export interface IObject {
  [key: string]: any;
}

export interface IFetchHeaders {
  'content-type': 'application/json';
  Authorization: string;
}
export interface IFetchOptions {
  headers: IObject;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: string;
  signal?: AbortSignal;
}
export interface IFetchSpotOptions extends IFetchOptions {
  url: string;
  update?: boolean;
}

export interface IBathingspot {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  version?: number;
  hasPrediction?: boolean;
  detailId?: number;
  oldId?: number;
  measuringPoint?: string;
  name: string;
  nameLong?: string;
  nameLong2?: string;
  water?: string;
  district?: string;
  street?: string;
  postalCode?: number;
  isPublic: boolean;
  city?: string;
  website?: string;
  cyanoPossible?: boolean;
  healthDepartment?: string;
  healthDepartmentAddition?: string;
  healthDepartmentStreet?: string;
  healthDepartmentPostalCode?: number;
  healthDepartmentCity?: string;
  healthDepartmentMail?: string;
  healthDepartmentPhone?: string;
  waterRescueThroughDLRGorASB?: boolean;
  waterRescue?: string;
  lifeguard?: boolean;
  hasDisabilityAccesableEntrence?: boolean;
  disabilityAccess?: boolean;
  disabilityAccessBathrooms?: boolean;
  restaurant?: boolean;
  snack?: boolean;
  parkingSpots?: boolean;
  bathrooms?: boolean;
  bathroomsMobile?: boolean;
  dogban?: boolean;
  lastClassification?: string;
  image?: string;
  apiEndpoints?: string;
  state?: string;
  location?: IGeoJsonGeometry;
  area?: IGeoJsonGeometry;
  latitude?: number;
  longitude?: number;
  elevation?: number;
  user?: IObject;
  userId?: number;
  predictions?: IObject[];
  models?: IObject[];
  measurements?: IObject[];
  rawModelData?: IObject[];
  region?: IObject;
  influencePurificationPlant?: 'yes' | 'no' | 'unknown';
  influenceCombinedSewerSystem?: 'yes' | 'no' | 'unknown';
  influenceRainwater?: 'yes' | 'no' | 'unknown';
  influenceAgriculture?: 'yes' | 'no' | 'unknown';
}

export interface IBathingspotExtend extends IBathingspot {
  csvFile?: File;
}

export interface ICSVValidationErrorRes {
  row: number;
  message: string;
}

export interface IBathingspotMeasurement {
  date: Date;
  conc_ec: number;
  conc_ec_txt?: string;
  oldId?: number;
  detailId?: number;
  conc_ie: number;
  conc_ie_txt?: string;
  temp?: number;
  algen?: boolean;
  cb?: number;
  sichtTxt?: string;
  tempTxt?: string;
  algenTxt?: string;
  bsl?: string;
  state?: string;
  wasserqualitaet?: number;
  wasserqualitaetTxt?: string;
}

// redux state

export interface IAction {
  type: string;
  payload?: any;
}

// Forms

export interface IFormBuildData {
  type: 'text' | 'number' | 'checkbox' | 'select' | 'email';
  name: string;
  label: string;
  value?: boolean | string;
  options?: IFormOptions[];
  handleChange?: (event: any) => void;
}

export interface IFormOptions {
  text: string;
  value: string;
}

export interface IGeoJsonGeometry {
  coordinates: any[];
  type: 'Point' | 'Polygon';
}
export interface IGeoJsonFeature {
  type: 'Feature';
  geometry: IGeoJsonGeometry;
  properties?: {
    [key: string]: any;
  };
}
export interface IGeoJson {
  type: 'FeatureCollection';
  features: IGeoJsonFeature[];
}

export interface IMapsProps {
  width: number;
  height: number;
  data: IBathingspot | (IBathingspot | undefined)[] | undefined;
  zoom?: number;
  lat?: number;
  lon?: number;
  selectedIndex?: number;
}

export interface IMapsEditorProps extends IMapsProps {
  editMode: MapEditModes;
  activeEditor?: MapEditors;
  defaultFormikSetFieldValues: FormikHelpers<
    IBathingspotExtend
  >['setFieldValue'];
  handleUpdates: (
    e: React.ChangeEvent<any>,
    location?: IGeoJsonGeometry,
    area?: IGeoJsonGeometry,
  ) => void;
}
// ╔╦╗┬ ┬┌─┐┌─┐┌─┐
//  ║ └┬┘├─┘├┤ └─┐
//  ╩  ┴ ┴  └─┘└─┘

export type MapEditors = 'area' | 'location';
export type MapEditModes =
  | 'modify'
  | 'view'
  | 'drawPoint'
  | 'drawPolygon'
  | 'translate';
export type MapActiveEditor = 'area' | 'location' | undefined;
