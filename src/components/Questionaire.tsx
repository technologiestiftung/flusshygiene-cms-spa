import React, { useEffect, useState } from 'react';
import { Container } from './Container';
import { getQuestions } from '../questionnaire-data';
import { QIntro } from './questionnaire/QIntro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfo } from '@fortawesome/free-solid-svg-icons';
// interface IInfo {
//   [key:string]: any;
// }

const QToolBar: React.FC<{ handleClick: () => void }> = ({ handleClick }) => {
  return (
    <Container>
      <div className='columns'>
        <div className='column is-is-fullwidth'>
          <div className='buttons'>
            <button
              className='button is-small is-badge-small'
              onClick={handleClick}
            >
              <span className='icon is-small'>
                <FontAwesomeIcon icon={faInfo} />
              </span>
              {/* <span>Info</span> */}
            </button>
          </div>
        </div>
      </div>
    </Container>
  );
};
export const Questionaire: React.FC<{}> = () => {
  const [modalIsActive, setmodalIsActive] = useState(true);
  const [questions, setQuestions] = useState();
  useEffect(() => {
    getQuestions()
      .then((data) => {
        console.log(data[0][0]);
        setQuestions(data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        console.log('questions', questions);
      });
    return () => {};
  }, []);
  return (
    <Container>
      <QToolBar
        handleClick={() => {
          setmodalIsActive(true);
        }}
      ></QToolBar>
      <div className={`modal ${modalIsActive === true ? 'is-active' : ''}`}>
        <div className='modal-background'></div>
        <div className='modal-content'>
          <div className='box'>
            <QIntro />
          </div>
          <button
            className='modal-close is-large'
            aria-label='close'
            onClick={() => {
              setmodalIsActive(false);
            }}
          ></button>
        </div>
      </div>
    </Container>
  );
};
