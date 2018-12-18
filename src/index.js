import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { combineReducers } from "redux";
import { createAction } from "redux-actions";
import { handleActions } from "redux-actions";
import { createSelector } from 'Reselect'

import { call, put, takeEvery, /*take, ?*/ takeLatest /*,race*/ } from 'redux-saga/effects'
import { expectSaga } from 'redux-saga-test-plan';

//Redux-Saga has a reference to our store and it calls getState() on my behalf,
 //passing the state into the selector.
 //The result of the selector() gets deposited into the saga as
 //the return from the select() effect.


console.log("hello");

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
//
//  Actions
//
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

const gainXp = createAction(Actions.GAIN_XP);
const levelUp = createAction(Actions.LEVEL_UP);
/*was
const move = (x, y) => ({
  type: Actions.MOVE,
  payload: { x, y }
});
Now */
const move = createAction(Actions.MOVE, (x, y) => ({ x, y })); //diff because it takes 2 params and returns them in an OBJECT {}
const drinkPotion = createAction(Actions.DRINK_POTION);
const takeDamage = createAction(Actions.TAKE_DAMAGE);

//
//  Reducers
//

const levelReducer = handleActions(
  {
    [Actions.LEVEL_UP]: (state, action) => {
      return state + 1;
    }
  },
  1
);

const xpReducer = handleActions(
  {
    [Actions.GAIN_XP]: (state, action) => {
      return state + action.payload;
    }
  },
  0
);

const positionReducer = handleActions(
  {
    [Actions.MOVE]: (state, action) => {
      let { x, y } = action.payload;
      x += state.x;
      y += state.y;
      return { x, y };
    }
  },
  initialState.position
);

const statsReducer = handleActions(
  {
    [Actions.DRINK_POTION]: (state, action) => {
      let { health, maxHealth } = state;
      health = Math.min(health + 20, maxHealth);
      return { ...state, health, maxHealth };
    },
    [Actions.TAKE_DAMAGE]: (state, action) => {
      let { health, maxHealth } = state;

      health = Math.max(0, health - action.payload);
      return { ...state, health };
    }
  },
  initialState.stats
);

const inventoryReducer = handleActions(
  {
    [Actions.DRINK_POTION]: (state, action) => {
      let { potions } = state;
      potions = Math.max(0, potions - 1);
      return { ...state, potions };
    }
  },
  initialState.inventory
);

//Selectors
const getXp = state => state.hero.xp
const getHealth = state => state.hero.stats.health


const getLevel =
  state =>
    levels.filter(level =>
      getXp(state) >= level.xp
    ).length;

const getLevel = createSelector(
  getXp, //retrieves xp...
  xp => //..and passes it to the next => f(n) arg
    levels.filter(level => //getLevel() may be called once per frame but this calculation...
    xp => level.xp//...is only made everytime the Player's XP changes
  ).length //count the number of levels hero has More XP than (and that's hero's current level)
)

const getMaxHealth = createSelector(
  getLevel, //retieves current level from selector above and passes in to next => fn arg
  l => levels[l].maxHealth
);

const isHealthLow = createSelector(
  [getHealth, getMaxHealth], //uses two above selector to get health and maxHealth and pass them on
  (health, maxHealth) =>
  health < maxHealth * .15 //if health is less than 15% of maxHealth it's low
)




//
//  Bootstrapping
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
  console.log(JSON.stringify(store.getState()));
});
//
//  Run!
//
store.dispatch(move(1, 0));
store.dispatch(move(0, 1));
store.dispatch(takeDamage(13));
  console.log(isHealthLow(store.getState())) //1st call causes entire dependency chain to be evaluated
  console.log(isHealthLow(store.getState()))//game state hasn't change so only Root dep are eval-ed this time
store.dispatch(drinkPotion());
  console.log(isHealthLow(store.getState()))
store.dispatch(gainXp(100));
  console.log(isHealthLow(store.getState()))//entire chain should fire again.
store.dispatch(levelUp());





/***************** */
function App() {
  return <div className="App" />;
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
