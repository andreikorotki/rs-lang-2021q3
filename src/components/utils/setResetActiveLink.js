export function setResetActiveLink(linkClass) {
  const links = document.querySelectorAll('.link');
  links.forEach((link) => {
    if (link.classList.contains('active')) {
      link.classList.remove('active');
    }
  });
  const linkActive = document.querySelector(`${linkClass}`);
  linkActive.classList.add('active');
}
