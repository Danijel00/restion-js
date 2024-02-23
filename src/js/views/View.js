// Svg icons
import icons from '../../img/icons.svg';
export default class View {
  _data;

  renderResults(data, render = true) {
    // ! If there is no data or if received data is empty array then return error message
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const renderHTML = this._generateHTML();

    if (!render) return renderHTML;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', renderHTML);
  }

  updateResults(data) {
    this._data = data;
    // The _generateHTML is just a string,
    // the current string needs to be compared with the updated DOM
    // So we need to convert the string to DOM
    const updateHTML = this._generateHTML();
    // Converting to DOM
    const newDOM = document.createRange().createContextualFragment(updateHTML);
    // Converting nodeList to real array with Array.from
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    // console.log(newElements, curElements);

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // Compare if the elements are equal
      if (!newEl.isEqualNode(curEl)) {
        // Update text content if it has changed
        if (newEl.firstChild?.nodeValue?.trim() !== '') {
          curEl.textContent = newEl.textContent;
        }

        // Update attributes if they have changed
        Array.from(newEl.attributes).forEach((attr) => {
          curEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  // Clear the html
  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const spinnerHTML = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>
  `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', spinnerHTML);
  }

  renderError(message = this._errorMessage) {
    const renderErrorHTML = `
      <div class="error">
          <div>
            <svg>
              <use href="${icons}#icon-alert-triangle"></use>
            </svg>
          </div>
          <p>${message}</p>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', renderErrorHTML);
  }

  renderSuccess(message = this._successMessage) {
    const renderSuccessHTML = `
      <div class="message">
          <div>
            <svg>
              <use href="${icons}#icon-smile"></use>
            </svg>
          </div>
          <p>${message}</p>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', renderSuccessHTML);
  }
}
