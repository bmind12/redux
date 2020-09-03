function createStore(reducer, preloadedState = {}) {
  // TODO: [enhancer]
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
        listeners.filter((l) => l !== listener);
      };
    },
    replaceReducer: (nextReducer) => {
      reduce = nextReducer;
    },
  };
}

function combineReducers(reducers) {
  return (store, action) => {
    Object.entries(reducers).forEach((reducer) => {
      const [name, reduce] = reducer;
      store[name] = reduce(store[name], action);
    });

    return store;
  };
}
// function applyMiddleware(...middlewares) {}
// function bindActionCreators(actionCreators, dispatch) {}
// function compose(...functions) {}

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

const { getState, dispatch, subscribe } = createStore(reducers);

const unsubscribe = subscribe(() => console.log(getState()));
dispatch({ type: "INCREMENT" });
dispatch({ type: "INCREMENT" });
dispatch({ type: "CHANGE", payload: "hello" });
unsubscribe();
dispatch({ type: "DECREMENT" });
dispatch({ type: "RESET" });
