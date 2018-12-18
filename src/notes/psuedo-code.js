import { call, put, takeEvery, /*take, ?*/ takeLatest /*,race*/ } from 'redux-saga/effects'
//see https://github.com/redux-saga/redux-saga




//# psuedocode for core game functionality

/*
1. loop while player is still alive
    2. wait for player to move
    3. are we in a safe place?
    4. randomly decide if there is a monster
    5. fight the monster
6. end loop
*/
// Keep single-responsibility principle in mind when developing sagas.

//1. loop while player is still alive
export function* gameSaga() {
  //loop while player is still alive
  let playerAlive = true
  while (playerAlive) {
    //2. Wait for player to move
    //The take() effect causes the saga to block until the specified action gets dispatched...
    yield take(Actions.MOVE)//(yield* everthing rather than calling things directlty)
    //...this does not block your UI or any other processing on your page..
    //A saga acts almost like a background process.

    //3. are we in a safe place(i.e. A sanctuary or friend's house)?
    const location = yield select(getLocation)//select() effect allows access to state from redux store
    if (location.safe) continue;

    //4. Decide randomly if there is a monster
    const monsterProbability = yield call(Math.random)//redux-saga middleware makes Math.random call so there are no side-effects
    if (monsterProbability < location.encounterThreshold) continue

    //5. Fight the monster
    playerAlive = yield call(fightSaga)


  //## PsuedoCode for new for new fight saga
  //1. begin loop
    //2. monster's turn to attack
    //3. is player dead? return false
    //4. player fight options
    //5. is monster dead? return true
//6. end loop

/*FIGHT saga responsible for the Order of fight */
export function* fightSaga() {//begin loop
  //save Ref to monster DRY
  const monster = yield select(getMonster)

  while (true) {
    //1. monst attack seq
    yield call(monsterAttackSaga, monster)//pass monster obj. as param to monsterAttackSaga()

    //2. If player is  dead?  return false
    const playerHealth = yield select(getHealth)
    if (playerHealth <= 0) return false

    //3. player fight options
    yield call(playerFightOptionsSaga)

    //4. is monster dead? return true
    const monsterHealth = yield select(getMonsterHealth)
    if (monsterHealth <= 0) return true
  }
} //close fightSaga()




  }
}

export const getLocation = state => {
  const { x, y } = state.hero.position
  return worldMap[ y, x ]
}

//Redux-saga

//## Monster's turn to attack
//1. wait a small delay (SO it doesn't strike back awkwardly fast )
//2. generate random damage amount
//3. play an attack animation
//4. apply damage to the player

export fuction *monsterAttackSaga() {
  //1. Wait a sml delay
  yield call(delay, 1000)

  //2. generate random damage acct
  let damage = monster.strength
  const critProbability = yield call(Math.random)
  if (critProbability >= monster.critThreshold) damage *= 2 //double dmg on critical hit

  //play an attach animation
  yield put(animateMonsterAttack(damage)) //FOR NOW pretend animateMonster exists
  yield call(delay, 1000)

  //apply damage to the player
  yield put(takeDamage(damage))//redux-sage uses put() for dispatching actions
}

//## Player Fight Options Sequence (more involved)
//1. wait for player to select an action
//2. if attack, run the attack sequence
//3. if potion, run the heal sequence
//4. if run away, run the escape sequence

export function* playerFightOptionsSaga() {
  //In redux-saga, the race() effect blocks the saga until one of the specified actions occurs.
  //It returns an object that contains the fired action.
  const {attack, heal, escape } = yield race({
    //wait for player to select an action
    attack: take(Actions.ATTACK),
    heal: take(Action.DRINK_POTION),
    escape: take(Action.RUN_AWAY)

  //2. if attack, run the attack sequence
  if (attack) yield call(playerAttackSaga)
  //3. if potion, run the heal sequence
  if (heal) yield call(playerHealSaga)
  //4. if run away, run the escape sequence
  if (escape) yiel call(playerEscapeSaga)
}

// use the race effect to allow the player to abandon the current game state to load from a saved game.
export function* metaSaga() {
  // wait for assets to load
 // show intro screen
 // wait for player to start the game

 // play the game and also watch for load game
 while (true) {
   yield race({
     play: call(gameSaga),
     load: take(actions.LOAD_GAME)
   })
 }
}
