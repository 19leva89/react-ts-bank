import { Reducer } from "react";

export enum REQUEST_ACTION_TYPE {
  PROGRESS = "progress",
  SUCCESS = "success",
  ERROR = "error",
  RESET = "reset",
}

interface RequestState {
  status: REQUEST_ACTION_TYPE;
  message: string | null;
}

type RequestAction =
  | { type: REQUEST_ACTION_TYPE.PROGRESS }
  | { type: REQUEST_ACTION_TYPE.SUCCESS; payload: string | null }
  | { type: REQUEST_ACTION_TYPE.ERROR; payload: string }
  | { type: REQUEST_ACTION_TYPE.RESET };

export const requestInitialState: RequestState = {
  status: REQUEST_ACTION_TYPE.PROGRESS,
  message: null,
};

export const requestReducer: Reducer<RequestState, RequestAction> = (
  state: RequestState,
  action: RequestAction
): RequestState => {
  switch (action.type) {
    case REQUEST_ACTION_TYPE.PROGRESS:
      return {
        ...state,
        status: action.type,
      };

    case REQUEST_ACTION_TYPE.SUCCESS:
      return {
        ...state,
        status: action.type,
        message: action.payload,
      };

    case REQUEST_ACTION_TYPE.ERROR:
      return {
        ...state,
        status: action.type,
        message: action.payload,
      };

    case REQUEST_ACTION_TYPE.RESET:
      return { ...requestInitialState };

    default:
      return state;
  }
};
