import React, { useEffect } from 'react';
import { useQuestions } from '../../contexts/questionaire';

import { useState } from 'react';
import { Formik, Form, FieldArray, Field } from 'formik';
import { Container } from '../Container';
import { QToolBar } from './QToolBar';
import { Pagination } from './Pagination';
interface IAnswer {
  text: string;
  colorText: 'grün' | 'gelb' | 'orange' | 'türkis' | 'rot';
  additionalText: string;
  id: string;
  weight: number;
  answer?: string;
  checked?: boolean;
}

export const Question: React.FC<{ qid: number }> = ({ qid }) => {
  const [title, setTitle] = useState('');
  const [qInfo, setQInfo] = useState('');
  const [question, setQuestion] = useState('');
  const [qAddInfo, setQAddInfo] = useState('');
  const [curAnswers, setCurAnswers] = useState<IAnswer[]>([]);

  const [aAddInfo, setAAddInfo] = useState('');
  // const state = useQuestionsState();
  // const dispatch = useQuestionsDispatch();
  const [state, dispatch] = useQuestions();
  const [formReadyToRender, setFormReadyToRender] = useState(false);
  const [answersIds, setAnswersIds] = useState<string[]>([]);
  useEffect(() => {
    if (state.questions === undefined) return;
    if (state.questions.length - 1 < qid) return;
    console.log('render');
    setTitle(state.questions[qid].default[1][1]);
    setQInfo(state.questions[qid].default[1][3]);
    // console.log('qInfo', questions[qid].default[1][3]);
    setQuestion(state.questions[qid].default[1][4]);
    setQAddInfo(state.questions[qid].default[1][5]);
    // console.log('qAddInfo', questions[qid].default[1][5]);

    const q = state.questions[qid].default;
    const localAnswers: IAnswer[] = [];
    // const a = answers[qid];

    for (let i = 1; i < q.length; i++) {
      // console.log(data[i][6]);
      // if (data[i][6] === null) {
      //   break;
      // }
      if (q[i][6] === null) {
        continue;
      }
      const answer: IAnswer = {
        additionalText: q[i][7],
        colorText: q[i][9],
        text: q[i][6],
        id: `${qid}-a${i - 1}-w${q[1][0]}`,
        weight: q[1][0],
        // checked: undefined,
      };
      if (answer.id === state.answers[qid]) {
        console.log('match for', answer.id, '===', state.answers[qid]);
        // answer.checked = true;
        setAnswersIds((_prevState) => {
          return [state.answers[qid]];
        });
      }
      localAnswers.push(answer);
    }
    setCurAnswers(localAnswers);
    setAAddInfo('');
    console.log('qid: answer in state', qid, state.answers[qid]);

    setFormReadyToRender(true);
  }, [state.questions, qid]);

  return (
    <>
      {formReadyToRender === true && (
        <Formik
          initialValues={{
            answersIds,
            answer: undefined,
          }}
          enableReinitialize={true}
          onSubmit={(values, { setSubmitting }) => {
            console.log('submitted', values);
            dispatch(
              {
                type: 'SET_ANSWER',
                payload: {
                  index: qid,
                  answer:
                    values.answersIds[0] === undefined
                      ? ''
                      : values.answersIds[0],
                },
              },
              // qid,
              // values.answer === undefined ? '' : values.answer!,
            );
            setSubmitting(false);
          }}
        >
          {({ values, isSubmitting, handleChange, isValid, submitForm }) => {
            return (
              <>
                <pre>
                  <code>{JSON.stringify(state.answers, null, 2)}</code>
                </pre>
                <Form>
                  <Container>
                    <QToolBar
                      isSubmitting={isSubmitting}
                      handleClick={(e: React.ChangeEvent<any>) => {
                        console.log(e.currentTarget.id);
                      }}
                    >
                      <Pagination
                        pages={state.questions.length - 1}
                        currentPage={qid}
                        isRounded={false}
                        isSmall={true}
                        isCentered={true}
                        onChange={(
                          event: React.ChangeEvent<any>,
                          page: number,
                        ) => {
                          console.log('Clicked button', event.currentTarget.id);
                          console.log('page', page);

                          switch (event.currentTarget.id) {
                            case 'fwd':
                              console.log('-->');
                              break;
                            case 'bwd':
                              console.log('<--');
                              break;
                            default:
                              console.log('default');
                              break;
                          }
                        }}
                      ></Pagination>
                    </QToolBar>
                  </Container>
                  <Container>
                    <h1 className='title is-1'>{title}</h1>
                    <div className='content'>
                      <p>{qInfo}</p>
                    </div>
                    <div className='content'>
                      <p className='title'>Frage:</p>

                      <p>{question}</p>
                      <p>
                        <em>{qAddInfo}</em>
                      </p>
                    </div>
                    <div className='content'>
                      <p className='title'>Antworten:</p>
                      <p>{aAddInfo}</p>
                      <div className='control'>
                        <FieldArray
                          name='answersIds'
                          render={(arrayHelpers) => {
                            console.log(arrayHelpers);
                            return (
                              <>
                                {curAnswers.map((ele, i) => {
                                  // console.log(ele);
                                  // if (ele === undefined) return null;
                                  // if (ele.text === null) return null;
                                  console.log(ele.id);
                                  return (
                                    <div key={i} className='field'>
                                      <Field
                                        type='radio'
                                        id={`answer--${i}`}
                                        name={`answers`}
                                        className={'answer'}
                                        onChange={(
                                          e: React.ChangeEvent<any>,
                                        ) => {
                                          handleChange(e);
                                          arrayHelpers.replace(0, ele.id);
                                          setAAddInfo(ele.additionalText);
                                        }}
                                        required
                                        value={ele.id}
                                        checked={values.answersIds.includes(
                                          ele.id,
                                        )}
                                      />
                                      <label
                                        htmlFor={`answer--${i}`}
                                        className={'radio label__answer'}
                                      >
                                        {ele.text} <em>{ele.colorText}</em>
                                      </label>
                                    </div>
                                  );
                                })}
                              </>
                            );
                          }}
                        ></FieldArray>
                      </div>
                    </div>
                  </Container>
                </Form>
              </>
            );
          }}
        </Formik>
      )}

      {/* <pre>
        <code>{JSON.stringify(curAnswers, null, 2)}</code>
      </pre>
      <pre>
        <code>{JSON.stringify(questions[qid], null, 2)}</code>
      </pre> */}
    </>
  );
};
