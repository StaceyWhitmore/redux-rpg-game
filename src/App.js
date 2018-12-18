//import Redux from 'redux'
import { Component } from 'react'
import { createStore, combineReducers } from "redux";


  const initialState = {
    hero: {
      xp: 0,
      level: 1,
      position: {
        x: 0,
        y: 0
      },
      stats: {
        health: 50,
        maxHealth: 50
      },
      inventory: {
        potions: 1
      }
     },
    monster: {}
  };

  const Actions = {
    GAIN_XP: "GAIN_XP",
    LEVEL_UP: "LEVEL_UP",
    MOVE: "MOVE",
    DRINK_POTION: "DRINK_POTION",
    TAKE_DAMAGE: "TAKE_DAMAGE"
  };
  //
  //  Action Creators
  //

  const gainXP = xp => ({
    type: Actions.GAIN_XP,
    payload: xp
  });

  const levelUp = () => ({
    type: Actions.LEVEL_UP
  });

  const move = (x, y) => ({
    type: Actions.MOVE,
    payload: { x, y }
  });

  const drinkPotion = () => ({
    type: Actions.DRINK_POTION
  });

  const takeDamage = amount => ({
    type: Actions.TAKE_DAMAGE,
    payload: amount
  });
  //
  //  Reducers
  //

  const xpReducer = (state = 0, action) => {
    // eslint-disable-next-line
    switch (action.type) {
      case Actions.GAIN_XP:
        return state + action.payload;
    }
    return state;
  };

  const levelReducer = (state = 1, action) => {
    // eslint-disable-next-line
    switch (action.type) {
      case Actions.LEVEL_UP:
        return state + 1;
    }
    return state;
  };
  const positionReducer = (state = initialState.position, action) => {
    // eslint-disable-next-line
    switch (action.type) {
      case Actions.MOVE:
        let { x, y } = action.payload;
        x += state.x;
        y += state.y;
        return { x, y };
    }
    return state;
  };

  const statsReducer = (state = initialState.stats, action) => {
    let { health, maxHealth } = state;
 // eslint-disable-next-line
    switch (action.type) {
      case Actions.DRINK_POTION:
        health = Math.min(health + 20, maxHealth); //takes whichever is less (can't go up higher than max)
        return { ...state, health, maxHealth };
      case Actions.TAKE_DAMAGE:
        health = Math.max(0, health - action.payload);
        return { ...state, health };
    } //close switch
    return state;
  };

  const inventoryReducer = (state = initialState.inventory, action) => {
    let { potions } = state;
    // eslint-disable-next-line
    switch (action.type) {
      case Actions.DRINK_POTION:
        potions = Math.max(0, potions - 1); //whichever is greater. can never go into negative
        return { ...state, potions }; //return a new object w/ a copy of state (only now potions: potions -1)
    } //close switch
    return state;
  };
  //
  //  Bootstrapping: combine all reducers into 1 & create a store with them
  //

  const reducer = combineReducers({
    xp: xpReducer,
    level: levelReducer,
    position: positionReducer,
    stats: statsReducer,
    inventory: inventoryReducer
  });

  const store = createStore(reducer);
  store.subscribe(() => {
    //called e/ time an action is .dispatch()ed
    console.log(JSON.stringify(store.getState()));
  });
  //
  //  Dispatch the Actions!
  //
  store.dispatch(move(1, 0)); //1 right
  store.dispatch(move(0, 1)); //up 1
  store.dispatch(takeDamage(13));
  store.dispatch(drinkPotion()); // + 20 to health
  store.dispatch(gainXP(100)); //+ 100 to XP
  store.dispatch(levelUp()); //100XP ---> level up



  class App extends Component {


}//close App

export default App
