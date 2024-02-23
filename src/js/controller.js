import * as model from './model';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView';
// Dependencies
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { MODAL_CLOSE_WINDOW } from './config';

// Recipes control
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    // Guard clause for id
    if (!id) return;

    // * 0) Later in project, update results based on selected search recipe
    resultsView.updateResults(model.getSearchResultsPage());

    // * 1) Updating bookmarks view
    bookmarksView.updateResults(model.state.bookmarks);

    // * 2) Loading the recipe, along with a spinner
    recipeView.renderSpinner();

    // ! Await is needed because it's an async request
    await model.loadRecipe(id);

    // * 3) Displaying the recipe using the render method
    recipeView.renderResults(model.state.recipe);
  } catch (err) {
    console.log('Error fetching', err);
    // recipeView.renderError(`${err} ⚠️⚠️⚠️`);
    recipeView.renderError();
  }
};

// Search control
const controlSearchResults = async function () {
  try {
    // Displaying the spinner
    resultsView.renderSpinner();
    // * 1) Get search query
    const query = searchView.getQuery();

    if (!query) return;

    // * 2) Load search results
    await model.loadSearchResults(query);

    // * 3) Render results
    // resultsView.renderResults(model.state.search.results);
    // resultsView.renderResults(model.getSearchResultsPage(1));
    resultsView.renderResults(model.getSearchResultsPage());

    // * 4) Render initial pagination buttons
    paginationView.renderResults(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

// Pagination control
const controlPagination = function (goToPage) {
  console.log(goToPage);

  // * 3) Render new results after clicking next or previous
  resultsView.renderResults(model.getSearchResultsPage(goToPage));

  // * 4) Render new pagination buttons
  paginationView.renderResults(model.state.search);
};

// Servings control
const controlServings = function (newServings) {
  // Update servings (in state)
  model.updateServings(newServings);

  // Update recipe view
  // recipeView.renderResults(model.state.recipe);
  recipeView.updateResults(model.state.recipe);
};

// Bookmarks control
const controlAddBookmark = function () {
  // Add/remove bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }

  // Update recipe view
  recipeView.updateResults(model.state.recipe);

  // Render bookmarks
  bookmarksView.renderResults(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.renderResults(model.state.bookmarks);
};

const controlAddRecipeForm = function () {
  addRecipeView.renderResults(model.state.recipe);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();
    // Upload new recipe
    await model.uploadRecipe(newRecipe);
    // Render the recipe
    recipeView.renderResults(model.state.recipe);
    // Render Success message
    addRecipeView.renderSuccess();
    // Render bookmarks view
    bookmarksView.renderResults(model.state.bookmarks);
    // Change ID into URL using history API
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // Close form window
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_WINDOW * 1000);
    setTimeout(() => {
      addRecipeView.renderResults(model.state.recipe);
    }, MODAL_CLOSE_WINDOW * 1100);
  } catch (err) {
    console.error('Control Add Recipe', err);
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
  addRecipeView.addHandlerRender(controlAddRecipeForm);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
