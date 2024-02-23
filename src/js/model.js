import { API_URL, RESULTS_PER_PAGE, UNIQUE_KEY } from './config';
// * Helper functions
import { AJAX } from './helpers';
// Similar to interfaces in typescript
export const state = {
  recipe: {
    ingredients: [],
  },
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RESULTS_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  // structure: data {recipe: {…}}
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    publisher: recipe.publisher,
    cookingTime: recipe.cooking_time,
    servings: recipe.servings,
    ingredients: recipe.ingredients,
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${UNIQUE_KEY}`);
    state.recipe = createRecipeObject(data);

    // If bookmarked id matches with current selected recipe id, set to true
    if (state.bookmarks.some((bookmark) => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
      console.log(state.recipe);
    }
  } catch (err) {
    // alert('Error: ' + err);
    console.log(`${err} 🌋🌋🌋`);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const searchResult = await AJAX(
      `${API_URL}?search=${query}&key=${UNIQUE_KEY}`
    );
    console.log(searchResult);

    state.search.results = searchResult.data.recipes.map((recipe) => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        // If key doesn't exist, nothing will happen
        // If it does the spread operator will apply on the object on the right
        ...(recipe.key && { key: recipe.key }),
      };
    });
    // Reset the page number to 1
    state.search.page = 1;
    // console.log(state.search.results);
  } catch (err) {
    console.log(`${err} 🌋🌋🌋`);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  // * What page are we on currently
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage; // 0;
  const end = page * state.search.resultsPerPage; // 9;
  console.log(start, end);
  // 0 -> 10, 10 -> 20 etc...
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  // ingredients array from json object
  state.recipe.ingredients.forEach((ingredient) => {
    // newQty = oldQty * newServings / oldServings
    ingredient.quantity =
      (ingredient.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

// Setting the bookmarks
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmark, adding new bookmarked property
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  // Delete bookmark
  // const index = state.bookmarks.findIndex((el) => el.id === id);
  // state.bookmarks.splice(index, 1);
  state.bookmarks.splice(state.bookmarks.indexOf(id), 1);

  // Mark current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

// Getting the bookmarks
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
    // Converting recipe object to array
    // Filter values that start with ingredient, and if second element is not empty string
    const ingredients = Object.entries(newRecipe)
      .filter((entry) => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map((ing) => {
        console.log(ing);
        const ingArr = ing[1].split(',').map((el) => el.trim());
        // const ingArr = ing[1].replaceAll(' ', '').split(',');
        // Required all 3 values as input
        if (ingArr.length !== 3) {
          // throw new Error('All three values are needed!');
        }

        // Replace first value with second
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${UNIQUE_KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
