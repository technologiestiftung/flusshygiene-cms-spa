// import { DEFAULT_SPOT_ID } from '../lib/common/constants';
import { APIMountPoints, ApiResources, RouteNames } from '../lib/common/enums';
import { fetchSingleSpot } from '../lib/state/reducers/actions/fetch-get-single-spot';
import {
  IFetchSpotOptions,
  IOcpuStartAction,
  IObject,
} from '../lib/common/interfaces';
import { Link } from 'react-router-dom';
import { Measurement, MeasurementTableRow } from './spot/Spot-Measurement';
import { RootState } from '../lib/state/reducers/root-reducer';
import { RouteComponentProps } from 'react-router';
import { SpotBodyAddonTagGroup } from './spot/Spot-AddonTag-Group';
import { SpotHeader } from './spot/Spot-Header';
import { SpotImage } from './spot/Spot-Image';
import { SpotLocation } from './spot/Spot-Location';
import { useMapResizeEffect } from '../hooks/map-hooks';
import { useSelector, useDispatch } from 'react-redux';
import React, { useRef, useEffect, useState } from 'react';
import { SpotEditor } from './spot/SpotEditor';
import SpotsMap from './spot/Spot-Map';

// import '../assets/styles/spot-editor.scss';
import { useAuth0 } from '../lib/auth/react-auth0-wrapper';
import { REACT_APP_API_HOST } from '../lib/config';
import { Container } from './Container';
import { useOcpu, postOcpu } from '../contexts/opencpu';
const messageCalibratePredict = {
  calibrate:
    'Ihre Kalibrierung wurde gestartet. Abhängig von der Menge an Messwerten kann dies dauern. Bitte kommen Sie in einigen Minuten zurück.',
  predict:
    'Ihre Vorhersagegenerierung wurde gestartet. Abhängig von der Menge an Messwerten kann dies dauern. Bitte kommen Sie in einigen Minuten zurück.',
  model:
    'Ihre Modelierung wurde gestartet. Dies kann etwas dauern. Bitte kommen Sie in einigen Minuten zurück.',
};
type RouteProps = RouteComponentProps<{ id: string }>;

const Spot: React.FC<RouteProps> = ({ match }) => {
  const { user, isAuthenticated, getTokenSilently } = useAuth0();
  const [ocpuState, ocpuDispatch] = useOcpu();

  const handleEditModeClick = () => {
    setEditMode(!editMode);
  };
  const handleCalibratePredictClick = (event: React.ChangeEvent<any>) => {
    // console.log('Start calibration');
    console.log(event.currentTarget.id);
    console.log(ocpuState);

    switch (event.currentTarget.id) {
      case 'predict':
        {
          const action: IOcpuStartAction = {
            type: 'START_OCPU_REQUEST',
            payload: {
              url: `/middlelayer/predict`,
              config: {
                method: 'POST',
                headers: {},
                credentials: 'include',
                body: JSON.stringify({
                  spot_id: spot.id,
                  user_id: user.pgapiData.id,
                }),
              },
            },
          };
          postOcpu(ocpuDispatch, action);
          console.log('clicked predict');
        }
        break;
      case 'model':
        {
          const action: IOcpuStartAction = {
            type: 'START_OCPU_REQUEST',
            payload: {
              url: `/middlelayer/model`,
              config: {
                method: 'POST',
                headers: {},
                credentials: 'include',
                body: JSON.stringify({}),
                /*JSON.stringify({
                spot_id: spot.id,
                user_id: user.pgapiData.id,
              }),*/
              },
            },
          };
          postOcpu(ocpuDispatch, action);
          console.log('clicked model');
        }
        break;
      case 'calibrate':
        {
          const action: IOcpuStartAction = {
            type: 'START_OCPU_REQUEST',
            payload: {
              url: `/middlelayer/calibrate`,
              config: {
                method: 'POST',
                headers: {},
                credentials: 'include',
                body: JSON.stringify({}),
                /*JSON.stringify({
                  spot_id: spot.id,
                  user_id: user.pgapiData.id,
                }),*/
              },
            },
          };
          postOcpu(ocpuDispatch, action);

          console.log('clicked calibrate');
        }
        break;
      default:
        throw new Error('Target for button not defined');
    }
    setCalibratePredictSelector(event.currentTarget.id);
    setShowNotification((prevState) => !prevState);
  };
  const dispatch = useDispatch();
  const [formReadyToRender, setFormReadyToRender] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [token, setToken] = useState<string>();
  const [calibratePredictSelector, setCalibratePredictSelector] = useState<
    'calibrate' | 'predict' | 'model' | undefined
  >(undefined);
  const [showNotification, setShowNotification] = useState(false);
  const spot = useSelector((state: RootState) => state.detailSpot.spot);
  const isSingleSpotLoading = useSelector(
    (state: RootState) => state.detailSpot.loading,
  );
  const mapRef = useRef<HTMLDivElement>(null);
  const mapDims = useMapResizeEffect(mapRef);

  // const fetchOpts: IFetchSpotOptions = {
  //   method: 'GET',
  //   url: `${REACT_APP_API_HOST}/${APIMountPoints.v1}/${ApiResources.bathingspots}/${match.params.id}`,
  //   headers: {
  //     'content-type': 'application/json',
  //     Authorization: `Bearer ${token}`,
  //   },
  // };
  useEffect(() => {
    async function getToken() {
      try {
        const t = await getTokenSilently();
        setToken(t);
        // console.log('got token', t);
      } catch (error) {
        console.error(error);
      }
    }
    getToken();
  }, [getTokenSilently, setToken]);

  useEffect(() => {
    if (showNotification === false) return;
    setTimeout(() => {
      setShowNotification(false);
    }, 5000);
  }, [showNotification]);

  useEffect(() => {
    // if (spot.id === parseInt(match.params.id, 10)) {
    //   return;
    // }
    if (token === undefined) return;
    if (user.pgapiData === undefined) return;
    const url = `${REACT_APP_API_HOST}/${APIMountPoints.v1}/${ApiResources.users}/${user.pgapiData.id}/${ApiResources.bathingspots}/${match.params.id}`;
    const fetchOpts: IFetchSpotOptions = {
      method: 'GET',
      url,
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    dispatch(fetchSingleSpot(fetchOpts));
    // setFormReadyToRender(true);
  }, [dispatch, match.params.id, token, user, user.pgapiData]);

  // useEffect(() => {
  //   if (
  //     spot.id === parseInt(match.params.id!, 10) ||
  //     spot.id !== DEFAULT_SPOT_ID
  //   ) {
  //     return;
  //   }
  //   dispatch(fetchSingleSpot(fetchOpts));
  // }, [spot, dispatch, match.params.id, fetchOpts]);

  useEffect(() => {
    if (spot.id === parseInt(match.params.id!, 10)) {
      setFormReadyToRender(true);
    }
  }, [setFormReadyToRender, spot.id, match.params.id]);

  if (editMode === true) {
    console.log(spot);
    return (
      <div className='container'>
        <div className='columns is-centered'>
          <div className='column is-10'>
            {formReadyToRender === true && editMode === true && (
              <SpotEditor
                initialSpot={spot}
                handleEditModeClick={handleEditModeClick}
              />
            )}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <>
        {showNotification === true && (
          <Container>
            <div className='notification spot__calib-notification--on-top'>
              {calibratePredictSelector !== undefined
                ? messageCalibratePredict[calibratePredictSelector]
                : ''}
            </div>
          </Container>
        )}
        {isAuthenticated === true && (
          <Container>
            <div className='buttons'>
              <button className='button is-small' onClick={handleEditModeClick}>
                Badestelle Bearbeiten
              </button>
              <button
                className='button is-small'
                onClick={handleCalibratePredictClick}
                id='calibrate'
              >
                Regen/Messwert Kalibrierung Starten
              </button>
              <button
                className='button is-small'
                onClick={handleCalibratePredictClick}
                id='model'
              >
                VorhersageModell berechnen
              </button>
              <button
                className='button is-small'
                onClick={handleCalibratePredictClick}
                id='predict'
              >
                Heutige Vorhersage berechnen
              </button>
            </div>
          </Container>
        )}
        <Container>
          <SpotHeader
            name={spot.name}
            nameLong={spot.nameLong}
            water={spot.water}
            district={spot.district}
          />
        </Container>
        <Container>{'prediction'}</Container>
        <div className='container'>
          <div className='columns is-centered'>
            <div className='column is-5'>
              {spot !== undefined && (
                <div>
                  {/* <div className='column'> */}
                  <SpotLocation
                    name={spot.name}
                    nameLong={spot.nameLong}
                    street={spot.street}
                    location={spot.location}
                    postalCode={(() => {
                      if (
                        spot.postalCode !== undefined &&
                        spot.postalCode !== null
                      ) {
                        return spot.postalCode;
                      }
                      return '';
                    })()}
                    city={spot.city}
                    website={spot.website}
                  />
                  {/* </div> */}
                  {/* <div className='column'> */}
                  <SpotImage
                    image={spot.image}
                    nameLong={spot.nameLong}
                    name={spot.name}
                    imageAuthor={undefined}
                  />
                  {/* </div> */}
                </div>
              )}
            </div>
            <div className='column is-5'>
              {spot !== undefined && spot.measurements !== undefined && (
                <Measurement
                  measurements={spot.measurements}
                  hasPrediction={spot.hasPrediction}
                >
                  {(() => {
                    if (spot.hasPrediction === true) {
                      return (
                        <div className='bathingspot__body-prediction'>
                          <p>
                            {/*tslint:disable-next-line: max-line-length*/}
                            <span className='asteriks'>*</span> Die hier
                            angezeigte Bewertung wird unterstützt durch eine
                            neuartige tagesaktuelle Vorhersagemethode.{' '}
                            <Link to={`/${RouteNames.info}`}>
                              Erfahren Sie mehr&nbsp;&raquo;
                            </Link>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </Measurement>
              )}
            </div>
          </div>
        </div>
        <div className='container'>
          <div className='columns is-centered'>
            <div className='column is-5'>
              <div className='bathingspot__rain'>
                <h3 className='title is-3'>Durchs. Regen</h3>
              </div>
            </div>
            <div className='column is-5'>
              <div className='bathingspot__model'>
                <h3 className='title is-3'>Vorhersage Modelle</h3>
                {console.log(spot.model)}
                {console.log(spot)}
                {spot !== undefined && spot.models !== undefined && (
                  <table className='table'>
                    <tbody>
                      {(() => {
                        const dateOpts = {
                          day: 'numeric',
                          month: 'short',
                          weekday: 'short',
                          year: 'numeric',
                        };
                        const sortedModels = spot.models.sort(
                          (a: IObject, b: IObject) => {
                            return (
                              ((new Date(a.updatedAt) as unknown) as number) -
                              ((new Date(b.updatedAt) as unknown) as number)
                            );
                          },
                        );
                        const lastFive = sortedModels.slice(
                          Math.max(sortedModels.length - 5, 0),
                        );

                        const rows = lastFive
                          .reverse()
                          .map((ele, i) => (
                            <MeasurementTableRow
                              key={i}
                              rowKey={`ID: ${ele.id}`}
                              rowValue={`Generiert am: ${new Date(
                                ele.updatedAt,
                              ).toLocaleDateString('de-DE', dateOpts)}`}
                            />
                          ));
                        return rows;
                      })()}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
        <Container>
          {isSingleSpotLoading === false && (
            <div ref={mapRef} id='map__container'>
              <SpotsMap
                width={mapDims.width}
                height={mapDims.height}
                data={(() => {
                  return Array.isArray(spot) === true ? spot : [spot];
                })()}
                zoom={4}
              />
            </div>
          )}
        </Container>
        <Container>
          {spot !== undefined && (
            <div className='bathingspot__body-addon'>
              <h3>Weitere Angaben zur Badesstelle</h3>
              <SpotBodyAddonTagGroup
                cyanoPossible={spot.cyanoPossible}
                lifeguard={spot.lifeguard}
                disabilityAccess={spot.disabilityAccess}
                hasDisabilityAccesableEntrence={
                  spot.hasDisabilityAccesableEntrence
                }
                restaurant={spot.restaurant}
                snack={spot.snack}
                parkingSpots={spot.parkingSpots}
                bathrooms={spot.bathrooms}
                disabilityAccessBathrooms={spot.disabilityAccessBathrooms}
                bathroomsMobile={spot.bathroomsMobile}
                dogban={spot.dogban}
              />
            </div>
          )}
        </Container>
      </>
    );
  }
};

export default Spot;
