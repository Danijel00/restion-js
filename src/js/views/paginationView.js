import View from './View';
import icons from '../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  // Implementing Publisher Subscriber Pattern
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      e.preventDefault();
      // Search for parent element class using closest
      const btn = e.target.closest('.btn--inline');

      if (!btn) return;

      console.log(btn);
      const goToPage = +btn.dataset.goto;
      // console.log(goToPage);
      handler(goToPage);
    });
  }

  _generateButtonHTML(curPage, isNextButton) {
    const arrowIcon = isNextButton ? 'icon-arrow-right' : 'icon-arrow-left';
    const buttonText = isNextButton
      ? `Page ${curPage + 1}`
      : `Page ${curPage - 1}`;
    const buttonClass = isNextButton
      ? 'pagination__btn--next'
      : 'pagination__btn--prev';
    const goToPage = isNextButton ? curPage + 1 : curPage - 1;

    return `
    <button data-goto='${goToPage}' class="btn--inline ${buttonClass}">
      ${isNextButton ? `<span>${buttonText}</span>` : ''}
      <svg class="search__icon">
        <use href="${icons}#${arrowIcon}"></use>
      </svg>
      ${isNextButton ? '' : `<span>${buttonText}</span>`}
    </button>
  `;
  }

  _generateHTML() {
    const curPage = this._data.page;
    // Rounding up the number
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    console.log(Number(numPages));
    // Page 1, and there are other pages
    if (curPage === 1 && numPages > 1) {
      return this._generateButtonHTML(curPage, true);
    }

    if (curPage === numPages && numPages > 1) {
      return this._generateButtonHTML(curPage, false);
    }

    if (curPage < numPages) {
      return (
        this._generateButtonHTML(curPage, true) +
        this._generateButtonHTML(curPage, false)
      );
    }

    // return 'Only 1 page';
  }
}

export default new PaginationView();
