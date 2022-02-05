import BaseElement from '../../common/base-element';

export class Header extends BaseElement {
  constructor() {
    super('header', ['header']);
    this.headerContainer = new BaseElement('div', ['header-container']);
    this.navContainer = new BaseElement('nav', ['nav-container']);
    /*     this.headerHeading = new BaseElement('h3', ['app-heading']);
    this.headerHeading.element.innerText = 'RS Lang'; */
    this.logoLink = new BaseElement('a', ['link', 'link-logo', 'active'], 'RS-LANG');
    // this.logoContainer = new BaseElement('div', ['logo', 'link', 'active'], 'RS-LANG');
    // this.logoContainer.element.innerHTML = '';
    // this.headerContainer.element.append(this.headerHeading.element);
    // this.logoLink.element.append(this.logoContainer.element);
    this.headerContainer.element.append(this.logoLink.element);
    this.ul = new BaseElement('ul', ['nav-menu']);
    this.liAbout = new BaseElement('li', ['menu-item']);
    this.liBook = new BaseElement('li', ['menu-item']);
    this.aboutLink = new BaseElement('a', ['link-about', 'link'], 'About');
    this.bookLink = new BaseElement('a', ['link-book', 'link'], 'Book');
    this.aboutLink.element.setAttribute('href', '/#/about');
    this.bookLink.element.setAttribute('href', '/#/book');
    this.navContainer.element.append(this.ul.element);
    this.headerContainer.element.append(this.logoLink.element);
    this.ul.element.append(this.aboutLink.element);
    this.ul.element.append(this.bookLink.element);
    // this.aboutLink.element.append(this.liAbout.element);
    // this.bookLink.element.append(this.liBook.element);
    this.element.append(this.headerContainer.element);
    this.logoLink.element.after(this.navContainer.element);
    this.logoLink.element.setAttribute('href', '#');
  }

  render() {
    this.run();
    return this.element;
  }

  run() {
    this.handleClicks();
  }

  handleClicks() {
    this.logoLink.element.addEventListener('click', this.handleEvents);
    this.aboutLink.element.addEventListener('click', this.handleEvents);
    this.bookLink.element.addEventListener('click', this.handleEvents);
  }

  handleEvents() {
    const links = document.querySelectorAll('.link');
    links.forEach((link) => {
      if (link.classList.contains('active')) {
        link.classList.remove('active');
      }
    });
    if (this.classList.contains('link')) {
      this.classList.add('active');
    }
  }
}
