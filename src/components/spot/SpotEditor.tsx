import React from 'react';
import { Formik, Form } from 'formik';
import SpotEditorInput from './SpotEditor-Input';
import SpotEditorCheckbox from './SpotEditor-Checkbox';
import { IBathingspot, IFetchSpotOptions } from '../../lib/common/interfaces';
import { editorSchema } from '../../lib/utils/spot-validation-schema';
import { nullValueTransform } from '../../lib/utils/spot-nullvalue-transformer';
import { SpotEditorButons } from './SpotEditor-Buttons';
import { API_DOMAIN } from '../../lib/common/constants';
import { APIMountPoints, ApiResources } from '../../lib/common/enums';
import { useAuth0 } from '../../react-auth0-wrapper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../lib/state/reducers/root-reducer';
import { putSpot } from '../../lib/state/reducers/actions/fetch-post-spot';
import { SpotEditorSelect } from './SpotEditor-Select';
import { SpotEditorBox } from './SpotEditor-Box';

interface IFormBuildData {
  type: 'text' | 'number' | 'checkbox' | 'select' | 'email';
  name: string;
  label: string;
  value?: boolean | string;
  options?: IOptions[];
}

interface IOptions {
  text: string;
  value: string;
}

const optionsYNU: IOptions[] = [
  { text: 'Ja', value: 'yes' },
  { text: 'Unbekannt', value: 'unknown' },
  { text: 'Nein', value: 'no' },
];

const formSectionBuilder: (data: IFormBuildData[]) => (JSX.Element | null)[] = (
  data,
) => {
  const res = data.map((datum, i) => {
    switch (datum.type) {
      case 'text':
      case 'number':
      case 'email':
        return (
          <SpotEditorInput
            key={i}
            name={datum.name}
            type={datum.type}
            label={datum.label}
          />
        );
      case 'checkbox':
        return (
          <SpotEditorCheckbox
            key={i}
            name={datum.name}
            type={datum.type}
            label={datum.label}
            value={datum.value! as boolean}
          />
        );
      case 'select':
        return (
          <SpotEditorSelect
            key={i}
            name={datum.name}
            label={datum.label}
            value={datum.value! as string}
            options={datum.options!}
          />
        );
    }
    return null;
  });
  return res;
};
const SpotEditor: React.FC<{
  initialSpot: IBathingspot;
  handleEditModeClick: () => void;
}> = ({ initialSpot, handleEditModeClick }) => {
  const { user } = useAuth0();
  const transformedSpot = nullValueTransform(initialSpot);
  const { getTokenSilently } = useAuth0();

  const postDone = useSelector((state: RootState) => state.postSpot.loading);
  const dispatch = useDispatch();

  const callPutSpot = async (spot: IBathingspot) => {
    const token = await getTokenSilently();
    const { id, createdAt, version, updatedAt, ...body } = spot;
    for (const key in body) {
      // if (typeof body[key] === 'string') {
      //   if (body[key].length === 0) {
      //     delete body[key];
      //   }
      // }
      if (body[key] === null) {
        delete body[key];
      }
      if (body[key] === transformedSpot[key]) {
        delete body[key];
      }
    }
    const postOpts: IFetchSpotOptions = {
      method: 'PUT',
      url: `${API_DOMAIN}/${APIMountPoints.v1}/${ApiResources.users}/${user.pgapiData.id}/${ApiResources.bathingspots}/${spot.id}`,
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    };
    console.log(postOpts);
    dispatch(putSpot(postOpts));
  };

  return (
    <div>
      <Formik
        initialValues={transformedSpot}
        validationSchema={editorSchema}
        onSubmit={(values, { setSubmitting }) => {
          console.log(values);
          callPutSpot(values).catch((err) => {
            console.error(err);
          });
          // console.log(postDone);
          setSubmitting(postDone);
          handleEditModeClick();
          // setTimeout(() => {
          //   console.log(JSON.stringify(values, null, 2));
          //   setSubmitting(false);
          // }, 500);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => {
          const additionalData: IFormBuildData[] = [
            { name: 'waterRescue', type: 'text', label: 'Wasserrettung' },
            {
              name: 'waterRescueThroughDLRGorASB',
              type: 'checkbox',
              label: 'Wasserrettung durch DLRG oder ASB?',
              value:
                values.waterRescueThroughDLRGorASB === undefined
                  ? false
                  : values.waterRescueThroughDLRGorASB,
            },
            {
              name: 'lifeguard',
              type: 'checkbox',
              label: 'Rettungschwimmer vor Ort',
              value: values.lifeguard === undefined ? false : values.lifeguard,
            },
            {
              name: 'disabilityAccess',
              type: 'checkbox',
              label: 'Barrierefreie',
              value:
                values.disabilityAccess === undefined
                  ? false
                  : values.disabilityAccess,
            },
            {
              name: 'disabilityAccessBathrooms',
              type: 'checkbox',
              label: 'Barrierefreie Waschräume',
              value:
                values.disabilityAccessBathrooms === undefined
                  ? false
                  : values.disabilityAccessBathrooms,
            },
            {
              name: 'hasDisabilityAccesableEntrence',
              type: 'checkbox',
              label: 'Barrierefreier Eingang',
              value:
                values.hasDisabilityAccesableEntrence === undefined
                  ? false
                  : values.hasDisabilityAccesableEntrence,
            },
            {
              name: 'restaurant',
              type: 'checkbox',
              label: 'Restaurant',
              value:
                values.restaurant === undefined ? false : values.restaurant,
            },
            {
              name: 'snack',
              type: 'checkbox',
              label: 'Snack',
              value: values.snack === undefined ? false : values.snack,
            },
            {
              name: 'parkingSpots',
              type: 'checkbox',
              label: 'Parkplätze',
              value:
                values.parkingSpots === undefined ? false : values.parkingSpots,
            },
            {
              name: 'bathrooms',
              type: 'checkbox',
              label: 'Waschräume',
              value: values.bathrooms === undefined ? false : values.bathrooms,
            },

            {
              name: 'bathroomsMobile',
              type: 'checkbox',
              label: 'Mobile Toiletten',
              value:
                values.bathroomsMobile === undefined
                  ? false
                  : values.bathroomsMobile,
            },
            {
              name: 'dogban',
              type: 'checkbox',
              label: 'Hundeverbot',
              value: values.dogban === undefined ? false : values.dogban,
            },
          ];
          const influenceData: IFormBuildData[] = [
            {
              type: 'select',
              name: 'influencePurificationPlant',
              label: 'kommunale Klärwerke',
              value:
                values.influencePurificationPlant === undefined
                  ? 'unknown'
                  : values.influencePurificationPlant,
              options: optionsYNU,
            },
            {
              type: 'select',
              name: 'influenceCombinedSewerSystem',
              label: 'Mischwassereinleitungen aus urbanen Gebieten',
              value:
                values.influenceCombinedSewerSystem === undefined
                  ? 'unknown'
                  : values.influenceCombinedSewerSystem,

              options: optionsYNU,
            },
            {
              type: 'select',

              name: 'influenceRainwater',
              label: 'Regenwassereileitung aus urbanen Gebieten',
              value:
                values.influenceRainwater === undefined
                  ? 'unknown'
                  : values.influenceRainwater,

              options: optionsYNU,
            },
            {
              type: 'select',
              name: 'influenceAgriculture',
              label: 'Einleitungen aus der Landwirtschaft',
              value:
                values.influenceAgriculture === undefined
                  ? 'unknown'
                  : values.influenceAgriculture,
              options: optionsYNU,
            },
          ];

          const healthDepartmentData: IFormBuildData[] = [
            {
              name: 'healthDepartment',
              type: 'text',
              label: 'Name',
            },
            {
              name: 'healthDepartmentAddition',
              type: 'text',
              label: 'Zusatz',
            },
            {
              name: 'healthDepartmentStreet',
              type: 'text',
              label: 'Straße',
            },
            {
              name: 'healthDepartmentPostalCode',
              type: 'number',
              label: 'Postleitzahl',
            },
            {
              name: 'healthDepartmentCity',
              type: 'text',
              label: 'Stadt',
            },
            {
              name: 'healthDepartmentMail',
              type: 'email',
              label: 'E-Mail',
            },
            {
              name: 'healthDepartmentPhone',
              type: 'email',
              label: 'Telefonnummer',
            },
          ];
          const basisData: IFormBuildData[] = [
            { name: 'name', type: 'text', label: 'Name' },
            { name: 'nameLong', type: 'text', label: 'Langer Name' },
            {
              name: 'water',
              type: 'text',
              label: 'Gewässer',
            },
            { name: 'district', type: 'text', label: 'Distrikt' },
            { name: 'street', type: 'text', label: 'Straße' },
            { name: 'postalCode', type: 'number', label: 'Postleitzahl' },
            { name: 'city', type: 'text', label: 'Stadt' },
            { name: 'website', type: 'text', label: 'Website URL' },
            {
              name: 'lastClassification',
              type: 'text',
              label: 'Letzte Klassifizierung',
            },
            { name: 'image', type: 'text', label: 'Bild URL' },
            {
              name: 'latitude',
              type: 'number',
              label: 'Latitude',
            },
            { name: 'longitude', type: 'number', label: 'Longitude' },
            { name: 'elevation', type: 'number', label: 'Höhe über NN' },
            { name: 'apiEndpoints', type: 'text', label: 'API Endpoints' },
            {
              name: 'cyanoPossible',
              type: 'checkbox',
              label: 'Cyanobakterien möglich',
              value:
                values.cyanoPossible === undefined
                  ? true
                  : values.cyanoPossible,
            },
          ];
          return (
            <div className='modal is-active'>
              <div className='modal-background'></div>
              <div className='modal-content'>
                <Form style={{ paddingTop: '10px' }}>
                  <SpotEditorButons
                    isSubmitting={isSubmitting}
                    handleEditModeClick={handleEditModeClick}
                  />

                  <SpotEditorBox title={'Basis Daten'}>
                    {formSectionBuilder(basisData)}
                    {/* {basisData.map((data, i) => {
                      switch (data.type) {
                        case 'text' || 'number':
                          return (
                            <SpotEditorInput
                              key={i}
                              name={data.name}
                              type={data.type}
                              label={data.label}
                            />
                          );
                        case 'checkbox':
                          return (
                            <SpotEditorCheckbox
                              key={i}
                              name={data.name}
                              type={data.type}
                              label={data.label}
                              value={data.value! as boolean}
                            />
                          );
                        case 'select':
                          return (
                            <SpotEditorSelect
                              name={data.name}
                              label={data.label}
                              value={data.value! as string}
                              options={data.options!}
                            />
                          );
                      }
                      return null;
                    })} */}
                    {/*
                    <SpotEditorInput
                      name={'name'}
                      type={'text'}
                      label={'Name'}
                    />
                    <SpotEditorInput
                      name={'nameLong'}
                      type={'text'}
                      label={'Langer Name'}
                    />
                    <SpotEditorInput
                      name={'water'}
                      type={'text'}
                      label={'Gewässer'}
                    />
                    <SpotEditorInput
                      name={'district'}
                      type={'text'}
                      label={'Distrikt'}
                    />
                    <SpotEditorInput
                      name={'street'}
                      type={'text'}
                      label={'Straße'}
                    />
                    <SpotEditorInput
                      name={'postalCode'}
                      type={'number'}
                      label={'Postleitzahl'}
                    />
                    <SpotEditorInput
                      name={'city'}
                      type={'text'}
                      label={'Stadt'}
                    />
                    <SpotEditorInput
                      name={'website'}
                      type={'text'}
                      label={'Website URL'}
                    />
                    <SpotEditorInput
                      name={'lastClassification'}
                      type={'text'}
                      label={'Letzte Klassifizierung'}
                    />
                    <SpotEditorInput
                      name={'image'}
                      type={'text'}
                      label={'Bild URL'}
                    />
                    <SpotEditorInput
                      name={'latitude'}
                      type={'number'}
                      label={'Latitude'}
                    />
                    <SpotEditorInput
                      name={'longitude'}
                      type={'number'}
                      label={'Longitude'}
                    />
                    <SpotEditorInput
                      name={'elevation'}
                      type={'number'}
                      label={'Höhe über NN'}
                    />
                    <SpotEditorInput
                      name={'apiEndpoints'}
                      type={'text'}
                      label={'API Endpoints'}
                    />
                    <SpotEditorCheckbox
                      name={'cyanoPossible'}
                      type={'checkbox'}
                      label={'Cyanobakterien möglich'}
                      value={
                        values.cyanoPossible === undefined
                          ? true
                          : values.cyanoPossible
                      }
                    /> */}
                  </SpotEditorBox>
                  <SpotEditorBox title={'Hygienische Beeinträchtigung durch:'}>
                    {formSectionBuilder(influenceData)}
                    {/* <div className='box'>
                    <fieldset>
                      <legend className='title is-5'>
                        Hygienische Beeinträchtigung durch:
                      </legend> */}
                    {/* <SpotEditorSelect
                      name={'influencePurificationPlant'}
                      label={'kommunale Klärwerke'}
                      value={
                        values.influencePurificationPlant === undefined
                          ? 'unknown'
                          : values.influencePurificationPlant
                      }
                      options={options}
                    />
                    <SpotEditorSelect
                      name={'influenceCombinedSewerSystem'}
                      label={'Mischwassereinleitungen aus urbanen Gebieten'}
                      value={
                        values.influenceCombinedSewerSystem === undefined
                          ? 'unknown'
                          : values.influenceCombinedSewerSystem
                      }
                      options={options}
                    />
                    <SpotEditorSelect
                      name={'influenceRainwater'}
                      label={'Regenwassereileitung aus urbanen Gebieten'}
                      value={
                        values.influenceRainwater === undefined
                          ? 'unknown'
                          : values.influenceRainwater
                      }
                      options={options}
                    />
                    <SpotEditorSelect
                      name={'influenceAgriculture'}
                      label={'Einleitungen aus der Landwirtschaft'}
                      value={
                        values.influenceAgriculture === undefined
                          ? 'unknown'
                          : values.influenceAgriculture
                      }
                      options={options}
                    /> */}
                  </SpotEditorBox>

                  <SpotEditorBox title={'Zuständiges Gesundheitsamt'}>
                    {formSectionBuilder(healthDepartmentData)}
                    {/* <SpotEditorInput
                      name={'healthDepartment'}
                      type={'text'}
                      label={'Name'}
                    />
                    <SpotEditorInput
                      name={'healthDepartmentAddition'}
                      type={'text'}
                      label={'Zusatz'}
                    />
                    <SpotEditorInput
                      name={'healthDepartmentStreet'}
                      type={'text'}
                      label={'Straße'}
                    />
                    <SpotEditorInput
                      name={'healthDepartmentPostalCode'}
                      type={'number'}
                      label={'Postleitzahl'}
                    />
                    <SpotEditorInput
                      name={'healthDepartmentCity'}
                      type={'text'}
                      label={'Stadt'}
                    />
                    <SpotEditorInput
                      name={'healthDepartmentMail'}
                      type={'email'}
                      label={'E-Mail'}
                    />
                    <SpotEditorInput
                      name={'healthDepartmentPhone'}
                      type={'email'}
                      label={'Telefonnummer'}
                    /> */}
                  </SpotEditorBox>

                  <SpotEditorBox title={'Zusatz Daten'}>
                    {formSectionBuilder(additionalData)}
                    {/* <SpotEditorInput
                      name={'waterRescue'}
                      type={'text'}
                      label={'Wasserrettung'}
                    />
                    <SpotEditorCheckbox
                      name={'waterRescueThroughDLRGorASB'}
                      type={'checkbox'}
                      label={'Wasserrettung durch DLRG oder ASB?'}
                      value={
                        values.waterRescueThroughDLRGorASB === undefined
                          ? false
                          : values.waterRescueThroughDLRGorASB
                      }
                    />
                    <SpotEditorCheckbox
                      name={'lifeguard'}
                      type={'checkbox'}
                      label={'Rettungschwimmer vor Ort'}
                      value={
                        values.lifeguard === undefined
                          ? false
                          : values.lifeguard
                      }
                    />
                    <SpotEditorCheckbox
                      name={'disabilityAccess'}
                      type={'checkbox'}
                      label={'Barrierefreie'}
                      value={
                        values.disabilityAccess === undefined
                          ? false
                          : values.disabilityAccess
                      }
                    />
                    <SpotEditorCheckbox
                      name={'disabilityAccessBathrooms'}
                      type={'checkbox'}
                      label={'Barrierefreie Waschräume'}
                      value={
                        values.disabilityAccessBathrooms === undefined
                          ? false
                          : values.disabilityAccessBathrooms
                      }
                    />
                    <SpotEditorCheckbox
                      name={'hasDisabilityAccesableEntrence'}
                      type={'checkbox'}
                      label={'Barrierefreier Eingang'}
                      value={
                        values.hasDisabilityAccesableEntrence === undefined
                          ? false
                          : values.hasDisabilityAccesableEntrence
                      }
                    />
                    <SpotEditorCheckbox
                      name={'restaurant'}
                      type={'checkbox'}
                      label={'Restaurant'}
                      value={
                        values.restaurant === undefined
                          ? false
                          : values.restaurant
                      }
                    />
                    <SpotEditorCheckbox
                      name={'snack'}
                      type={'checkbox'}
                      label={'Snack'}
                      value={values.snack === undefined ? false : values.snack}
                    />
                    <SpotEditorCheckbox
                      name={'parkingSpots'}
                      type={'checkbox'}
                      label={'Parkplätze'}
                      value={
                        values.parkingSpots === undefined
                          ? false
                          : values.parkingSpots
                      }
                    />
                    <SpotEditorCheckbox
                      name={'bathrooms'}
                      type={'checkbox'}
                      label={'Waschräume'}
                      value={
                        values.bathrooms === undefined
                          ? false
                          : values.bathrooms
                      }
                    />

                    <SpotEditorCheckbox
                      name={'bathroomsMobile'}
                      type={'checkbox'}
                      label={'Mobile Toiletten'}
                      value={
                        values.bathroomsMobile === undefined
                          ? false
                          : values.bathroomsMobile
                      }
                    />
                    <SpotEditorCheckbox
                      name={'dogban'}
                      type={'checkbox'}
                      label={'Hundeverbot'}
                      value={
                        values.dogban === undefined ? false : values.dogban
                      }
                    /> */}
                  </SpotEditorBox>
                  {/* </fieldset>
                  </div> */}
                  <SpotEditorButons
                    isSubmitting={isSubmitting}
                    handleEditModeClick={handleEditModeClick}
                  />
                  {/* <div className='field is-grouped is-grouped-right'>
                    <p className='control'>
                      <button
                        className='button is-primary'
                        type='submit'
                        disabled={isSubmitting}
                      >
                        Speichern
                      </button>
                    </p>
                    <p className='control'>
                      <button
                        className='button is-is-light'
                        type='button'
                        disabled={isSubmitting}
                        onClick={handleEditModeClick}
                      >
                        Abbrechen
                      </button>
                    </p>
                  </div> */}
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

export default SpotEditor;
