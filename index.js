function createStore(reducer) {
  // TODO: , [preloadedState], [enhancer]
  const store = {
    reducer: 0, // TODO: change
  };

  return {
    getState: () => store,
    dispatch: (action) => {
      store.reducer = reducer(store.reducer, action);
    },
    // subscribe, // subscribe(listener)
    // replaceReducer, // replaceReducer(nextReducer)
  };
}
// function combineReducers(reducers) {}
// function applyMiddleware(...middlewares) {}
// function bindActionCreators(actionCreators, dispatch) {}
// function compose(...functions) {}

const { getState, dispatch } = createStore(counter);

console.log(getState());
dispatch({ type: "INCREMENT" });
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
