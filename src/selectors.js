// Given the game state, select the hero's experience points
const getXp = state => state.hero.xp;
// Given the game state, select the hero's current health
const getHealth = state => state.hero.stats.health;

// Given the game state, select the current level
// (count the number of levels that we have more XP than)
const getLevel =
  state =>
    levels.filter(level =>
      getXp(state) >= level.xp
    ).length;

    // Given the game state, select the max health
const getMaxHealth =
  state =>
    levels[getLevel(state)].maxHealth;

    const isHealthLow =
  state =>
    getHealth(state) < getMaxHealth(state) * .15;

//Using the reselect library write selector that recompute only when the dependencies change
/*'reselet' provides a createSelector, which takes an existing selector (or array of selectors)
and a function to evaluate. The function is Only evaluated when the input selectors change.
memoization*/
