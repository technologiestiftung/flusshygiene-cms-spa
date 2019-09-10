import React, { useEffect, useState, useRef } from 'react';
import DeckGL from '@deck.gl/react';
import { MapController } from '@deck.gl/core';
import {
  IMapsEditorProps,
  IGeoJson,
  MapEditModes,
  IGeoJsonFeature,
} from '../../lib/common/interfaces';
import { EditableGeoJsonLayer } from '@nebula.gl/layers';
import { useMapResizeEffect } from '../../hooks/map-hooks';

import { StaticMap } from 'react-map-gl';
import { REACT_APP_MAPBOX_API_TOKEN } from '../../lib/config';
import { IconAngleDown } from '../fontawesome-icons';
const initialViewState = {
  bearing: 0,
  latitude: 52,
  longitude: 13,
  pitch: 0,
  zoom: 4,
};

const dropdownTexts = {
  view: { text: ' Anzeige' },
  modify: { text: 'Modifizieren' },
  translate: { text: 'Bewegen' },
  drawPoint: { text: 'Position Zeichnen' },
  drawPolygon: { text: 'Regeneinzugsgebiet Zeichnen' },
};

const FormikSpotEditorMap: React.FC<IMapsEditorProps> = ({
  width,
  height,
  data,
  zoom,
  lat,
  lon,
  activeEditor,
  defaultFormikSetFieldValues,
  handleUpdates,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapDims = useMapResizeEffect(mapRef);
  const [editMode, setEditMode] = useState<MapEditModes>('view');
  const mapToolbarEditModeHandler: React.MouseEventHandler<HTMLDivElement> = (
    event,
  ) => {
    event.preventDefault();
    console.log(event.currentTarget.id);
    switch (event.currentTarget.id) {
      case 'view':
      case 'modify':
      case 'translate':
      case 'drawPoint':
      case 'drawPolygon':
        if (['modify', 'translate'].includes(event.currentTarget.id)) {
          setSelectedIndex([0]);
        }
        setEditMode(event.currentTarget.id);
        break;
    }
  };
  // console.log(formik);
  // const { values /*, setValues*/ } = useFormikContext<IBathingspot>();
  // const [location, setLocation] = useState<IGeoJson>();
  // const [area, setArea] = useState<IGeoJson>();
  const [geoData, setGeoData] = useState<IGeoJson>();
  // useEffect(() => {
  //   console.log(values);
  //   return () => {};
  // }, [values]);
  const [selectedIndex, setSelectedIndex] = useState<number[]>([]);
  // const [locationMode, setLocationMode] = useState<MapEditModes>('view');
  // const [areaMode, setAreaMode] = useState<MapEditModes>('view');

  useEffect(() => {
    if (data === undefined) return;
    if (data[0] === undefined) return;
    if (geoData === undefined) return;
    const points = geoData.features.filter(
      (ele) => ele.geometry.type === 'Point',
    );
    const polies = geoData.features.filter(
      (ele) => ele.geometry.type === 'Polygon',
    );
    if (polies.length > 0) {
      data[0].area = polies[0].geometry;
    }
    if (points.length > 0) {
      data[0].location = points[0].geometry; // geoData.features[0].geometry;
      // defaultFormikSetFieldValues(
      //   'latitude',
      //   points[0].geometry.coordinates[1],
      // );
      // defaultFormikSetFieldValues(
      //   'longitude',
      //   points[0].geometry.coordinates[0],
      // );
    }
  }, [geoData, data, defaultFormikSetFieldValues]);
  // useEffect(() => {
  //   if (data !== undefined) {
  //     if (data[0] !== undefined) {
  //       setLocationMode(editMode);
  //       setAreaMode(editMode);
  //     }
  //   }
  // }, [data, editMode]);
  useEffect(() => {
    if (data === undefined) return;
    if (data[0] === undefined) return;
    if (data[0].location === undefined) return;
    if (data[0].area === undefined) return;
    // const geojsonLocation: IGeoJson = {
    //   type: 'FeatureCollection',
    //   features: [
    //     {
    //       type: 'Feature',
    //       geometry: data[0].location,
    //     },
    //   ],
    // };
    const loc: IGeoJsonFeature = {
      type: 'Feature',
      geometry: data[0].location,
      properties: {
        fhType: 'primary',
      },
    };
    const area: IGeoJsonFeature = {
      type: 'Feature',
      geometry: data[0].area,
      properties: {
        fhType: 'primary',
        // guideType: 'tentative',
        // editHandleType: 'existing',
      },
    };
    // const geojsonArea: IGeoJson = {
    //   type: 'FeatureCollection',
    //   features: [
    //     {
    //       type: 'Feature',
    //       geometry: data[0].area,
    //       properties: {
    //         guideType: 'tentative',
    //         editHandleType: 'existing',
    //       },
    //     },
    //   ],
    // };
    const geo: IGeoJson = {
      type: 'FeatureCollection',
      features: [loc, area],
    };
    // setArea(geojsonArea);
    // setLocation(geojsonLocation);
    setGeoData(geo);

    return () => {
      // cleanup
    };
  }, [data]);

  if (zoom !== undefined) {
    initialViewState.zoom = zoom;
    if (
      data !== undefined &&
      data[0] !== undefined &&
      lat !== undefined &&
      lon !== undefined
    ) {
      initialViewState.latitude = data[0].latitude;
      initialViewState.longitude = data[0].longitude;
    }
  }

  // const locationMode = activeEditor === 'location' ? editMode : 'view';
  // const areaMode = activeEditor === 'area' ? editMode : 'view';
  const commonProps = {
    lineWidthMinPixels: 2,
    editHandlePointRadiusMinPixels: 4,
    editHandlePointRadiusScale: 200,
    lineDashJustified: true,
    // modeConfig: {
    //   // enableSnapping: true,
    //   cursor: 'crosshair',
    // },
    pickingRadius: 20,
    pickingDepth: 1,
    // onLayerClick: (event) => {
    //   console.log('layer click event', event);
    // },
  };
  // const areaLayer = new EditableGeoJsonLayer({
  //   id: 'area',
  //   data: area,
  //   mode: areaMode,
  //   onStopDragging: () => {
  //     if (area === undefined) return;

  //     // setIn(formik.values, 'area', area.features[0].geometry);

  //     // setFieldValue('area', area.features[0].geometry, false);
  //     // setFieldTouched('area', true, false);

  //     // setFieldValue('location', location.features[0].geometry, false);
  //   },
  //   onEdit: ({ updatedData, editContext, editType }) => {
  //     console.log('updated data from nebula area');
  //     console.log(updatedData);
  //     console.log(editContext);
  //     console.log(editType);
  //     setArea(updatedData);
  //   },
  //   ...commonProps,
  // });
  const geoLayer = new EditableGeoJsonLayer({
    ...commonProps,
    selectedFeatureIndexes: selectedIndex,
    id: 'location',
    data: geoData,
    mode: editMode,
    onStopDragging: () => {
      // if (location === undefined) return;
      // const event: React.ChangeEvent<any> = {
      //   bubbles: true,
      //   cancelable: false,
      //   currentTarget: {},
      //   nativeEvent: new Event('location'),
      //   target: {},
      //   defaultPrevented: true,
      //   eventPhase: 0,
      //   isTrusted: true,
      //   preventDefault: () => {},
      //   isDefaultPrevented: () => true,
      //   stopPropagation: () => {},
      //   isPropagationStopped: () => true,
      //   persist: () => {},
      //   timeStamp: Date.now(),
      //   type: 'location',
      // };
      // // var ev2 = new Event('input', { bubbles: true });
      // console.log('stop dragging');
      // defaultFormikSetFieldValues(
      //   'latitude',
      //   location.features[0].geometry.coordinates[1],
      // );
      // defaultFormikSetFieldValues(
      //   'longitude',
      //   location.features[0].geometry.coordinates[0],
      // );
      // handleUpdates(event, location.features[0].geometry);
      // setValues({ ...values, location: location.features[0].geometry });
      // formik.setFieldValue('location', location.features[0].geometry);
      // formik.setValues({
      //   ...formik.values,
      //   ...setIn(formik.values, 'location', location.features[0].geometry),
      // });
      // formik.setFieldTouched('location', true, false);
      // formik.setFormikState((prevState: FormikState<IBathingspot>) => {
      //   return {
      //     ...prevState,
      //     values: setIn(
      //       prevState.values,
      //       'location',
      //       location.features[0].geometry,
      //     ),
      //     touched: setIn(prevState.touched, 'location', true),
      //   };
      // });
      // formik.values = setIn(
      //   formik.values,
      //   'location',
      //   location.features[0].geometry,
      // );
      // formik.dirty = true;
      // formik. setIn(formik.errors, 'location', undefined);
      // formik.touched = setIn(formik.touched, 'location', true);
      // setFieldValue('location', location.features[0].geometry, false);
      // setFieldTouched('location', true, false);
      // setFieldValue('location', location.features[0].geometry, false);
      // if (geoData !== undefined) {
      //   defaultFormikSetFieldValues(
      //     'latitude',
      //     geoData.features[0].geometry.coordinates[1],
      //   );
      //   defaultFormikSetFieldValues(
      //     'longitude',
      //     geoData.features[0].geometry.coordinates[0],
      //   );
      // }
    },
    onEdit: ({ updatedData, editContext }) => {
      console.log('updated data from nebula');
      console.log(editContext);

      // console.log(updatedData);
      const pointFeatures = updatedData.features.filter(
        (ele: IGeoJsonFeature) => ele.geometry.type === 'Point',
      );
      const polyFeatures = updatedData.features.filter(
        (ele: IGeoJsonFeature) => ele.geometry.type === 'Polygon',
      );
      // console.log('point', pointFeatures);
      // console.log('poly', polyFeatures);

      const geo: IGeoJson = {
        type: 'FeatureCollection',
        features: [
          pointFeatures[pointFeatures.length - 1],
          polyFeatures[polyFeatures.length - 1],
        ],
      };

      setGeoData(geo);
    },
    ...commonProps,
  });
  const [isActive, setIsActive] = useState(false);
  const handleClick = (event) => {
    mapToolbarEditModeHandler(event);
    setIsActive(false);
  };
  const setActiveMode = (mode: string) =>
    editMode === mode ? 'is-active' : '';
  return (
    <>
      <div className={`dropdown ${isActive ? 'is-active' : ''} is-small`}>
        <div
          className='dropdown-trigger'
          aria-haspopup='true'
          aria-controls='dropdown-menu'
        >
          <button
            className='button is-small'
            aria-haspopup='true'
            aria-controls='dropdown-menu'
            // disabled={isDisabled}
            onClick={(event) => {
              event.preventDefault();
              setIsActive(!isActive);
            }}
          >
            <span style={{ paddingRight: '0.5em' }}>{`Bearbeitungs Modus: ${
              dropdownTexts[editMode] !== undefined
                ? dropdownTexts[editMode].text
                : ''
            }`}</span>
            <span>
              <IconAngleDown />
            </span>
          </button>
        </div>
        <div className='dropdown-menu' id='dropdown-menu' role='menu'>
          <div className='dropdown-content'>
            <a
              href='#/'
              className={`dropdown-item ${setActiveMode('view')}`}
              onClick={handleClick}
              id={'view'}
            >
              anzeigen
            </a>

            <a
              href='#/'
              className={`dropdown-item ${setActiveMode('modify')}`}
              onClick={handleClick}
              id={'modify'}
            >
              modifizieren
            </a>
            <a
              // dirty hack to keep bulma working
              href='#/'
              className={`dropdown-item ${setActiveMode('translate')}`}
              onClick={handleClick}
              id={'translate'}
            >
              bewegen
            </a>
            <a
              // dirty hack to keep bulma working
              href='#/'
              className={`dropdown-item ${setActiveMode('drawPoint')}`}
              onClick={handleClick}
              id={'drawPoint'}
            >
              Punkt zeichnen
            </a>
            <a
              // dirty hack to keep bulma working
              href='#/'
              className={`dropdown-item ${setActiveMode('drawPolygon')}`}
              onClick={handleClick}
              id={'drawPolygon'}
            >
              Polygon zeichnen
            </a>
          </div>
        </div>
      </div>
      <div ref={mapRef} id='map__container'>
        <DeckGL
          width={mapDims.width}
          height={mapDims.height}
          initialViewState={initialViewState}
          // controller={true}
          layers={[geoLayer]}
          getCursor={(() => {
            if (activeEditor === 'location') {
              return geoLayer.getCursor.bind(geoLayer);
            } else {
              return;
            }
          })()}
          onClick={(info: any) => {
            // console.log('onLayerClick', info);
            if (editMode === 'view' || editMode === 'drawPolygon') {
              return;
            }
            if (info) {
              console.log(`select editing feature ${info.index}`);
              if (info.index >= 0) {
                setSelectedIndex([info.index]);
              }
            } else {
              setSelectedIndex([]);
            }
          }}
          controller={{ type: MapController, doubleClickZoom: false }}
        >
          <StaticMap
            width={width}
            height={height}
            mapboxApiAccessToken={REACT_APP_MAPBOX_API_TOKEN}
          />
        </DeckGL>
      </div>
    </>
  );
};

export default FormikSpotEditorMap;
