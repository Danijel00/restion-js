import View from './View';
import previewView from './previewView';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks found. Please add a recipe of your liking ;-)';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateHTML() {
    console.log(this._data);
    // ! The data is an array now, so we need to use map
    return this._data
      .map((bookmark) => previewView.renderResults(bookmark, false))
      .join('');
  }
}

export default new BookmarksView();
