// const { response } = require('express');
import('babel-core/register');
import('babel-polyfill');
import * as model from './model';
import { MODAL_CLOSE_SEC } from './config';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView';
import resultView from './views/resultView';
import { getSearchResultsPage } from './model';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// if (module.hot) {
//   module.hot.accept();
// }
console.log(100);

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    console.log(id);
    recipeView.renderSpinner();

    // 0. Update the result view to mark the selected search result
    // debugger;
    resultView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);
    // 1. Loading recipe
    await model.loadRecipe(id);
    // const { recipe } = model.state;
    // 2. Rending recipe

    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.log(err);
    // alert(err);
    // console.log(err);
  }
};
// controlRecipes();

const controlSearchResults = async function () {
  try {
    resultView.renderSpinner();

    // 1. Get search query
    const query = searchView.getQuery();
    if (!query) return;
    console.log(4);

    // 2. Load search result
    await model.loadSearchResult(query);
    // 3. Render Result
    // resultView.render(model.state.search.results);
    resultView.render(getSearchResultsPage());

    // 4. REnder initial pagination
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};
const controlPagination = function (goToPage) {
  console.log('Pagination controlled');
  // 3. Render NEW Result
  // resultView.render(model.state.search.results);
  resultView.render(getSearchResultsPage(goToPage));

  // 4. REnder New pagination
  paginationView.render(model.state.search);
};

// controlSearchResults();
const controlServings = function (servings) {
  // Update the recipe servings (in state)
  model.updateServings(servings);

  // update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  console.log(model.state.recipe.bookmarked);
  //  1. Add/ remove bookmarks and update recipe view
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
    recipeView.update(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
    recipeView.update(model.state.recipe);
  }
  //  2. Render bookmark
  bookmarksView.render(model.state.bookmarks);
  console.log(model.state.recipe);
  console.log(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();
    console.log(newRecipe);

    // 1. Upload a new Recipe

    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // 2. Render uploaded recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change id in the url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close modal window
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err.message, `🤢`);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();

// console.log(33);

console.log(77);
