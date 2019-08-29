import React, { useRef, useState } from 'react';
import { Formik, Form } from 'formik';
// import SpotEditorInput from './SpotEditor-Input';
// import SpotEditorCheckbox from './SpotEditor-Checkbox';
import {
  IBathingspot,
  IFetchSpotOptions,
  MapEditModes,
} from '../../lib/common/interfaces';
import { editorSchema } from '../../lib/utils/spot-validation-schema';
import { nullValueTransform } from '../../lib/utils/spot-nullvalue-transformer';
import { SpotEditorButtons } from './SpotEditor-Buttons';
import { API_DOMAIN } from '../../lib/common/constants';
import { APIMountPoints, ApiResources } from '../../lib/common/enums';
import { useAuth0 } from '../../react-auth0-wrapper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../lib/state/reducers/root-reducer';
import { putSpot } from '../../lib/state/reducers/actions/fetch-post-spot';
// import { SpotEditorSelect } from './SpotEditor-Select';
import { SpotEditorBox } from './SpotEditor-Box';
import { formSectionBuilder } from './SpotEditor-form-section-builder';
import { patchValues } from './form-data/patch-values';
import { basisData } from './form-data/basis-data';
import { influenceData } from './form-data/influence-data';
import { additionalData } from './form-data/additional-data';
import { healthDepartmentData } from './form-data/healtdepartment-data';
import { useMapResizeEffect } from '../../hooks/map-hooks';
import FormikSpotEditorMap from './SpotEditor-Map';
import { SpotEditorMapToolbar } from './SpotEditorMapToolbar';
// const optionsYNU: IFormOptions[] = [
//   { text: 'Ja', value: 'yes' },
//   { text: 'Unbekannt', value: 'unknown' },
//   { text: 'Nein', value: 'no' },
// ];

export const SpotEditor: React.FC<{
  initialSpot: IBathingspot;
  handleEditModeClick: () => void;
}> = ({ initialSpot, handleEditModeClick }) => {
  const mapToolbarClickHandler: React.MouseEventHandler<HTMLDivElement> = (
    event,
  ) => {
    event.preventDefault();
    console.log(event.currentTarget.id);
    switch (event.currentTarget.id) {
      case 'info':
        console.log('info');
        break;
      case 'area':
        if (areaMode === 'modify') {
          // setAreaMode('view');
          setActiveEditor(undefined);
        } else {
          // setAreaMode('modify');
          // setLocationMode('view');
          setActiveEditor('area');
        }
        break;
      case 'location':
        if (locationMode === 'modify') {
          // setLocationMode('view');
          setActiveEditor(undefined);
        } else {
          // setLocationMode('modify');
          // setAreaMode('view');
          setActiveEditor('location');
        }
        break;
    }
  };
  const mapToolbarEditModeHandler: React.MouseEventHandler<HTMLDivElement> = (
    event,
  ) => {
    event.preventDefault();
    console.log(event.currentTarget.id);
    switch (event.currentTarget.id) {
      case 'view':
      case 'modify':
      case 'translate':
        setEditMode(event.currentTarget.id);
        break;
    }
  };

  const mapRef = useRef<HTMLDivElement>(null);
  const mapDims = useMapResizeEffect(mapRef);
  const [areaMode, setAreaMode] = useState<MapEditModes>('view');
  const [locationMode, setLocationMode] = useState<MapEditModes>('view');
  const [editMode, setEditMode] = useState<MapEditModes>('view');
  const [activeEditor, setActiveEditor] = useState<
    'area' | 'location' | undefined
  >(undefined);
  const { user } = useAuth0();
  const transformedSpot = nullValueTransform(initialSpot);
  console.log(transformedSpot);
  const { getTokenSilently } = useAuth0();

  const postDone = useSelector((state: RootState) => state.postSpot.loading);
  const dispatch = useDispatch();

  const callPutSpot = async (spot: IBathingspot) => {
    const token = await getTokenSilently();
    const { id, createdAt, version, updatedAt, ...body } = spot;
    console.log('unpatched body', body);
    for (const key in body) {
      // if (typeof body[key] === 'string') {
      //   if (body[key].length === 0) {
      //     delete body[key];
      //   }
      // }
      if (body[key] === null || body[key] === undefined) {
        delete body[key];
      }
      if (body[key] === transformedSpot[key]) {
        delete body[key];
      }
    }
    console.log('patched body', body);

    const postOpts: IFetchSpotOptions = {
      method: 'PUT',
      url: `${API_DOMAIN}/${APIMountPoints.v1}/${ApiResources.users}/${user.pgapiData.id}/${ApiResources.bathingspots}/${spot.id}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    };
    console.log('post options', postOpts);
    dispatch(putSpot(postOpts));
  };

  return (
    <div>
      <Formik
        enableReinitialize={true}
        initialValues={transformedSpot}
        validationSchema={editorSchema}
        onSubmit={(values, { setSubmitting }) => {
          console.log(values);
          callPutSpot(values).catch((err) => {
            console.error(err);
          });
          setSubmitting(postDone);
          handleEditModeClick();
        }}
      >
        {(props) => {
          const patchedAdditionalData = patchValues(
            props.values,
            additionalData,
          );

          const patchedInfluenceData = patchValues(
            props.values,
            influenceData,
            'unknown',
          );

          const patchedBasisData = patchValues(props.values, basisData);

          return (
            <div className='modal is-active'>
              <div className='modal-background'></div>
              <div className='modal-content'>
                <Form style={{ paddingTop: '10px' }}>
                  <SpotEditorButtons
                    isSubmitting={props.isSubmitting}
                    handleEditModeClick={handleEditModeClick}
                  />
                  {props.values !== undefined && (
                    <SpotEditorBox title={'Geo Daten'}>
                      <SpotEditorMapToolbar
                        handleClick={mapToolbarClickHandler}
                        activeEditor={activeEditor}
                        handleModeSwitch={mapToolbarEditModeHandler}
                        activeMode={editMode}
                      />
                      <div ref={mapRef} id='map__container'>
                        <FormikSpotEditorMap
                          width={mapDims.width}
                          height={mapDims.height}
                          data={[props.values]}
                          editMode={editMode}
                          activeEditor={activeEditor}
                          setFieldValue={props.setFieldValue}
                          setFieldTouched={props.setFieldTouched}
                          formik={props}
                          // areaMode={areaMode}
                          // locationMode={locationMode}
                        />
                      </div>
                    </SpotEditorBox>
                  )}
                  <SpotEditorBox title={'Basis Daten'}>
                    {formSectionBuilder(patchedBasisData)}
                  </SpotEditorBox>
                  <SpotEditorBox title={'Hygienische Beeinträchtigung durch:'}>
                    {formSectionBuilder(patchedInfluenceData)}
                  </SpotEditorBox>

                  <SpotEditorBox title={'Zuständiges Gesundheitsamt'}>
                    {formSectionBuilder(healthDepartmentData)}
                  </SpotEditorBox>

                  <SpotEditorBox title={'Zusatz Daten'}>
                    {formSectionBuilder(patchedAdditionalData)}
                  </SpotEditorBox>
                  {/* </fieldset>
                  </div> */}
                  <SpotEditorButtons
                    isSubmitting={props.isSubmitting}
                    handleEditModeClick={handleEditModeClick}
                  />
                </Form>
              </div>
              <button
                className='modal-close is-large'
                aria-label='close'
                onClick={handleEditModeClick}
              ></button>
            </div>
          );
        }}
      </Formik>
    </div>
  );
};
