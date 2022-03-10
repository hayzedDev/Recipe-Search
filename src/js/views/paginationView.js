import View from './View';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      e.preventDefault();
      const btn = e.target.closest('.btn--inline');
      console.log(btn);

      if (!btn) return;
      const goTo = +btn.dataset.goto;
      console.log(goTo);
      handler(goTo);
    });
  }

  _generateMarkupButton(curPage, cur, arrow) {
    return `
                <button data-goto="${curPage}" class="btn--inline pagination__btn--${cur}">
                    <span>Page ${curPage}</span>
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-${arrow}"></use>
                    </svg>
                </button>
            `;
  }
  _generateTotalPages(numPages) {
    return `
    <div class=" pagination__btn--center">
        <span>${numPages} pages</span>
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
        </svg>
    </div>
`;
  }

  //   _generateTotalPages(numPages) {
  //     return `
  //     <button class="btn--inline pagination__btn--center">
  //         <span>Page ${numPages}</span>
  //         <svg class="search__icon">
  //             <use href="${icons}#icon-arrow-${arrow}"></use>
  //         </svg>
  //     </button>
  // `;
  //   }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultPerPage
    );
    console.log(numPages);
    //   Page 1 and there are other pages
    if (curPage === 1 && curPage < numPages) {
      return this._generateMarkupButton(curPage + 1, 'next', 'right');
      // this._generateTotalPages(numPages)
    }
    // last page
    if (curPage === numPages && numPages > 1) {
      console.log(12);
      return this._generateMarkupButton(curPage - 1, 'prev', 'left');
      // this._generateTotalPages(numPages)
    }
    // Some other pages
    if (curPage < numPages) {
      return (
        this._generateMarkupButton(curPage + 1, 'next', 'right') +
        this._generateMarkupButton(curPage - 1, 'prev', 'left')
        // this._generateTotalPages(numPages)
      );
    }
    //   Page 1 and there are NO other pages
    return '';
  }
}

export default new PaginationView();
