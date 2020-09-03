function createStore(reducer, preloadedState = {}) {
  // TODO: [enhancer]
  const store = preloadedState;
  const reducers = reducer;

  return {
    getState: () => store,
    dispatch: (action) => {
      Object.entries(reducers).forEach((reducer) => {
        store[reducer[0]] = reducer[1](store[reducer[0]], action);
      });
    },
    // subscribe, // subscribe(listener)
    // replaceReducer, // replaceReducer(nextReducer)
  };
}

function combineReducers(reducers) {
  return reducers;
}
// function applyMiddleware(...middlewares) {}
// function bindActionCreators(actionCreators, dispatch) {}
// function compose(...functions) {}

const reducers = combineReducers({
  counter,
  input,
});

const { getState, dispatch } = createStore(reducers);

dispatch({ type: "INCREMENT" });
console.log(getState());
dispatch({ type: "INCREMENT" });
dispatch({ type: "CHANGE", payload: "hello" });
console.log(getState());
dispatch({ type: "DECREMENT" });
dispatch({ type: "RESET" });
console.log(getState());

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
