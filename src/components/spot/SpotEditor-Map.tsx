import React, { useEffect, useState } from 'react';
import DeckGL from '@deck.gl/react';
import { StaticMap } from 'react-map-gl';
import { IMapsEditorProps } from '../../lib/common/interfaces';
import { EditableGeoJsonLayer } from '@nebula.gl/layers';
const initialViewState = {
  bearing: 0,
  latitude: 52,
  longitude: 13,
  pitch: 0,
  zoom: 4,
};

export const SpotEditorMap: React.FC<IMapsEditorProps> = ({
  width,
  height,
  data,
  zoom,
  lat,
  lon,
  areaMode,
  locationMode,
}) => {
  const [location, setLocation] = useState({});
  const [area, setArea] = useState({});
  useEffect(() => {
    if (data === undefined) return;
    if (data[0] === undefined) return;

    const geojsonLocation = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: data[0].location,
        },
      ],
    };
    const geojsonArea = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: data[0].area,
        },
      ],
    };
    setArea(geojsonArea);
    setLocation(geojsonLocation);

    return () => {
      // cleanup
    };
  }, []);

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

  console.log('Spot editr maps', data![0].location);
  const areaLayer = new EditableGeoJsonLayer({
    id: 'area',
    data: area,
    mode: areaMode,
    selectedFeatureIndexes: [0],
    onLayerClick: (event) => {
      console.log(event);
    },
    onEdit: ({ updatedData }) => {
      console.log('updated data from nebula');
      console.log(updatedData);
      setLocation(updatedData);
    },
  });
  const locationLayer = new EditableGeoJsonLayer({
    id: 'location',
    data: location,
    mode: locationMode,
    selectedFeatureIndexes: [0],
    onLayerClick: (event) => {
      console.log(event);
    },
    onEdit: ({ updatedData }) => {
      console.log('updated data from nebula');
      console.log(updatedData);
      setLocation(updatedData);
    },
  });
  return (
    <DeckGL
      width={width}
      height={height}
      initialViewState={initialViewState}
      controller={true}
      layers={[locationLayer, areaLayer]}
    >
      <StaticMap
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_API_TOKEN}
        width={width}
        height={height}
      />
    </DeckGL>
  );
};
