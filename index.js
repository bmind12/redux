function createStore(reducer, preloadedState = {}, enhancer) {
  if (enhancer) {
    return enhancer(createStore)(reducer, preloadedState);
  }

  let state = preloadedState;
  let reduce = reducer;
  let listeners = [];

  return {
    getState: () => state,
    dispatch: (action) => {
      state = reduce(state, action);
      listeners.forEach((listener) => listener());
    },
    subscribe: (listener) => {
      listeners.push(listener);

      return () => {
        listeners = listeners.filter((l) => l !== listener);
      };
    },
    replaceReducer: (nextReducer) => {
      reduce = nextReducer;
    },
  };
}

function combineReducers(reducers) {
  return (state = {}, action) => {
    return Object.keys(reducers).reduce((nextState, key) => {
      nextState[key] = reducers[key](state[key], action);

      return nextState;
    }, {});
  };
}

function applyMiddleware(...middlewares) {
  return (createStore) => (reducer, preloadedState) => {
    const store = createStore(reducer, preloadedState);
    let dispatch;

    const middlewareAPI = {
      getState: store.getState,
      dispatch: (action) => dispatch(action),
    };
    const chain = middlewares.map((middleware) => middleware(middlewareAPI));

    dispatch = compose(...chain)(store.dispatch);

    return {
      ...store,
      dispatch,
    };
  };
}

function bindActionCreators(actionCreators, dispatch) {
  return Object.keys(actionCreators).reduce((boundActionCreators, key) => {
    const actionCreator = actionCreators[key];

    boundActionCreators[key] = (...args) => {
      return dispatch(actionCreator.apply(null, args));
    };

    return boundActionCreators;
  }, {});
}

function compose(...functions) {
  return (arg) => {
    return functions.reduceRight((result, fn) => fn(result), arg);
  };
}

function counter(state = 0, action) {
  switch (action.type) {
    case "INCREMENT":
      return state + 1;
    case "DECREMENT":
      return state - 1;
    default:
      return state;
  }
}

function input(state = "", action) {
  switch (action.type) {
    case "CHANGE":
      return action.payload;
    case "RESET":
      return "";
    default:
      return state;
  }
}

const reducers = combineReducers({
  counter,
  input,
});

const { getState, dispatch, subscribe } = createStore(
  reducers,
  {},
  applyMiddleware(logger)
);

function logger({ getState }) {
  return (next) => (action) => {
    console.log("will dispatch", action);

    // Call the next dispatch method in the middleware chain.
    const returnValue = next(action);

    console.log("state after dispatch", getState());

    // This will likely be the action itself, unless
    // a middleware further in chain changed it.
    return returnValue;
  };
}

const increment = () => ({ type: "INCREMENT" });
const decrement = () => ({ type: "DECREMENT" });
const reset = () => ({ type: "RESET" });
const change = (value) => ({ type: "CHANGE", payload: value });

const unsubscribe = subscribe(() => console.log(getState()));
const boundAC = bindActionCreators(
  {
    increment,
    decrement,
    reset,
    change,
  },
  dispatch
);

boundAC.increment();
boundAC.increment();
boundAC.change("HEhtLLOo");
unsubscribe();
boundAC.decrement();
boundAC.reset();
