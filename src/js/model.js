// import { async } from 'regenerator-runtime';
import { API_URL } from './config';
// import { getJSON, sendJSON } from './helpers';
import { AJAX } from './helpers';
import { PAGE_PER_VIEW, apiKey } from './config';
// import { filter } from 'core-js/core/array';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultPerPage: PAGE_PER_VIEW,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;

  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${apiKey}`);
    state.recipe = createRecipeObject(data);
    console.log(data);

    console.log(state);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
    alert(err);
  }
};

export const loadSearchResult = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${apiKey}`);
    console.log(data);
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    console.log(state.search.results, state.search.query);
    state.search.page = 1;
  } catch (err) {
    console.log(err);
    alert(err);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultPerPage; //0
  const end = page * state.search.resultPerPage; //10
  return state.search.results.slice(start, end);
};
export const updateServings = function (servings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = ing.quantity * (servings / state.recipe.servings);
  });
  state.recipe.servings = servings;
};

const persistBookmark = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // Add bookmarks
  state.bookmarks.push(recipe);
  persistBookmark();

  // MArk current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
};
export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(recipe => recipe.id === id);
  state.bookmarks.splice(index, 1);
  persistBookmark();
  if (id === state.recipe.id) state.recipe.bookmarked = false;
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');

  if (storage) state.bookmarks = JSON.parse(storage);
};

init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

// clearBookmarks();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(
        entry => entry.at(0).startsWith('ingredient') && entry.at(1) !== ''
      )
      .map(entry => {
        const ingArr = entry[1].split(',').map(cur => cur.trim());
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format. Please enter the correct format!'
          );

        const [quantity, unit, description] = ingArr;
        return {
          quantity: quantity ? +quantity : null,
          unit,
          description,
        };
      });
    console.log(ingredients);

    const recipe = {
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      image_url: newRecipe.image,
      source_url: newRecipe.sourceUrl,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    console.log(recipe);
    console.log(recipe.cooking_time, recipe.servings);
    const data = await AJAX(`${API_URL}?key=${apiKey}`, recipe);
    console.log(data);
    state.recipe = createRecipeObject(data);

    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
