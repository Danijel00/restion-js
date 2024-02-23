import View from './View';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _successMessage = 'Recipe created successfully!';
  _windowEl = document.querySelector('.add-recipe-window');
  _overlayEl = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    // To be able to use the this keyword
    super();
    this._addRecipeWindowHandler();
    this._closeRecipeWindowHandler();
  }

  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach((ev) =>
      window.addEventListener(ev, handler)
    );
  }

  toggleWindow() {
    this._overlayEl.classList.toggle('hidden');
    this._windowEl.classList.toggle('hidden');
  }

  _addRecipeWindowHandler() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  _closeRecipeWindowHandler() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlayEl.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const formData = [...new FormData(this)];
      const data = Object.fromEntries(formData);
      console.log(data);
      handler(data);
    });
  }

  _generateHTML() {
    return `
        <div class="upload__column">
          <h3 class="upload__heading">Recipe data</h3>
          <label>Title</label>
          <input value="TEST100" required name="title" type="text"/>
          <label>URL</label>
          <input value="TEST100" required name="sourceUrl" type="text"/>
          <label>Image URL</label>
          <input value="TEST100" required name="image" type="url" accept="image/*" />
          <label>Publisher</label>
          <input value="TEST100" required name="publisher" type="text" />
          <label>Prep time</label>
          <input value="23" required name="cookingTime" type="number" />
          <label>Servings</label>
          <input value="23" required name="servings" type="number" />
        </div>

        <div class="upload__column">
          <h3 class="upload__heading">Ingredients</h3>
          <label>Ingredient 1</label>
          <input
            value="0.5,kg,Rice"
            type="text"
            required
            name="ingredient-1"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 2</label>
          <input
            value="1,,Avocado"
            type="text"
            name="ingredient-2"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 3</label>
          <input
            value=",,salt"
            type="text"
            name="ingredient-3"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 4</label>
          <input
            type="text"
            name="ingredient-4"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 5</label>
          <input
            type="text"
            name="ingredient-5"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 6</label>
          <input
            type="text"
            name="ingredient-6"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
        </div>
        <button class="btn upload__btn">
          <svg>
            <use href="./src/img/icons.svg#icon-upload-cloud"></use>
          </svg>
          <span>Upload</span>
        </button>
      `;
  }
}

export default new AddRecipeView();
