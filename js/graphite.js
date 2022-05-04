'use strict';

// back-to-top
window.onload = () => {
  let element = document.querySelector('#back_to_top');
  if(!element) return;
  var elevator = new Elevator({ 'element': element, 'duration': 800 });
  if (document.body.clientWidth > 480) {
    window.onscroll = () => {
      if(window.scrollY > 30) {
        element.style.display = 'block';
      } else {
        element.style.display = 'none';
      }
    }
  }
}

// Menu Toggle
document.querySelector("#menu_icon").onclick = () => {
  domSlider.slideToggle({'element': document.querySelector("#site_nav")})
};

// FancyBox
Fancybox.bind("[data-fancybox='gallery']", {
  arrows: false,
  infobar: false,
  buttons: [],
  clickContent: "close",
  autoFocus: false,
  backFocus: false,
  wheel: false,
  mobile: {
    clickContent: "close",
    clickSlide: "close",
    dblclickContent: false,
    dblclickSlide: false
  },
});
