import View from './View';
import previewView from './previewView';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage =
    "Sorry, couldn't find any recipes matching your search. Could you try a different dish or ingredient?";

  _generateHTML() {
    console.log(this._data);
    // ! The data is an array now, so we need to use map
    return this._data
      .map((result) => previewView.renderResults(result, false))
      .join('');
  }
}

export default new ResultsView();
