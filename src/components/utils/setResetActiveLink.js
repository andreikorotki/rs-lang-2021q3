export function setResetActiveLink(linkClass) {
  const links = document.querySelectorAll('.link');
  links.forEach((link) => {
    if (link.classList.contains('active')) {
      link.classList.remove('active');
    }
  });
  const [linkActiveMenu, linkActiveBurger] = document.querySelectorAll(`${linkClass}`);
  if (linkActiveMenu) {
    linkActiveMenu.classList.add('active');
    linkActiveBurger.classList.add('active');
  }
}
