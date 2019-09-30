import React, { createContext, useContext, useReducer } from 'react';

type OcpuDispatchTypes =
  | 'START_OCPU_REQUEST'
  | 'FINISH_OCPU_REQUEST'
  | 'FAIL_OCPU_REQUEST';

interface IOcpuAction {
  type: OcpuDispatchTypes;
  payload?: {
    [key: string]: any;
  };
}
interface IOcpuFetchAction extends IOcpuAction {
  payload: {
    url: string;
    config: {
      method: string;
      headers: { [key: string]: any };
      body: string;
    };
  };
}

interface IOcpuFinishAction extends IOcpuAction {
  payload: {
    response: Response;
  };
}

interface IOcpuFailAction extends IOcpuAction {
  payload: {
    error: {
      [key: string]: any;
    };
  };
}
interface IOcpuState {
  [key: string]: any;
  sessionId: string;
  responses: any[];
  errors: any[];
}
type Dispatch = (action: IOcpuAction) => void;
type OcpuProviderProps = { children: React.ReactNode };

const OcpuStateContext = createContext<IOcpuState | undefined>(undefined);

const OcpuDispatchContext = createContext<Dispatch | undefined>(undefined);

const ocpuReducer: (
  state: IOcpuState,
  action: IOcpuAction | IOcpuFetchAction | IOcpuFinishAction | IOcpuFailAction,
) => IOcpuState = (state, action) => {
  switch (action.type) {
    case 'START_OCPU_REQUEST': {
      return state;
    }
    case 'FINISH_OCPU_REQUEST': {
      return state;
    }
    case 'FAIL_OCPU_REQUEST': {
      return state;
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

const OcpuProvider = ({ children }: OcpuProviderProps) => {
  const [state, dispatch] = useReducer(ocpuReducer, {
    sessionId: '',
    responses: [],
    errors: [],
  });
  return (
    <OcpuStateContext.Provider value={state}>
      <OcpuDispatchContext.Provider value={dispatch}>
        {children}
      </OcpuDispatchContext.Provider>
    </OcpuStateContext.Provider>
  );
};

const useOcpuState = () => {
  const stateContext = useContext(OcpuStateContext);
  if (stateContext === undefined) {
    throw new Error(
      'useQuestionsState must be used within a QuestionsProvider',
    );
  }

  return stateContext;
};

const postOcpu = async (dispatch: Dispatch, action: IOcpuAction) => {
  dispatch(action);
  let response: Response;
  const fetchAction = action as IOcpuFetchAction;
  try {
    response = await fetch(fetchAction.payload.url, fetchAction.payload.config);
    if (response.ok === true) {
      const json = await response.json();
      const finishPayload: IOcpuFinishAction = {
        type: 'FINISH_OCPU_REQUEST',
        payload: { response: json },
      };
      dispatch(finishPayload);
    } else {
      throw new Error('Network fetch response not ok');
    }
  } catch (error) {
    const failPayload: IOcpuFailAction = {
      type: 'FAIL_OCPU_REQUEST',
      payload: { error: response! },
    };
    dispatch(failPayload);
  }
};
const useOcpuDispatch = () => {
  const dispatchContext = useContext(OcpuDispatchContext);
  if (dispatchContext === undefined) {
    throw new Error(
      'useQuestionsDispatch must be used within a QuestionsProvider',
    );
  }
  return dispatchContext;
};

const useOcpu: () => [IOcpuState, Dispatch] = () => {
  return [useOcpuState(), useOcpuDispatch()];
};

export { useOcpu, OcpuProvider, postOcpu };
