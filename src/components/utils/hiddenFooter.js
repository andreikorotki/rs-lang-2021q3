export function hiddenFooter(currentPageHash) {
  if (currentPageHash === '#/games') {
    document.querySelector('footer').style.display = 'none';
  }
}
