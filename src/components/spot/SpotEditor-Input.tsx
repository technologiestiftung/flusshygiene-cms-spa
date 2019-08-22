import { Field, ErrorMessage } from 'formik';

// SpotEditorInput.tsx;
import React from 'react';
const SpotEditorInput: React.FC<{
  name: string;
  type: string;
  label: string;
}> = ({ name, label, type }) => {
  // console.log(name);
  return (
    <div className='field is-horizontal'>
      <div className='field-label is-normal'>
        <label htmlFor={name} className='label'>
          {label}
        </label>
      </div>
      <div className='field-body'>
        <div className='field'>
          <div className='control'>
            <Field type={type} name={name} className=' input' />
            <ErrorMessage
              name={name}
              component='div'
              className='help is-danger'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpotEditorInput;
