/**
 * Created by 12 on 2017/6/1.
 */
function scroll(fn) {
  let beforeScrollTop = document.body.scrollTop
  fn = fn || function () {}
  window.addEventListener('scroll', function () {
    let afterScrollTop = document.body.scrollTop
    let delta = afterScrollTop - beforeScrollTop
    if (delta === 0) return false
    fn(delta > 0 ? 'down' : 'up')
    beforeScrollTop = afterScrollTop
  },false)
}

export default scroll
