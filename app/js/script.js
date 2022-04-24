let sliderWidth = 0;
let imgListWidth = 0;
let addedDistancePerScroll = 0;
let scrollDistance = 0;
let scrollLeft = 0;
let addedDistancePerScrollInProgressBar = 0;
let scrollDistanceProgressBar = 0;
let ratio = 0;

let slider = document.querySelector(".img-list__slider");
let rect = slider.getBoundingClientRect();
let imgList = document.querySelector(".img-list--scrollble");
let itemImg = document.getElementById("img-list__item-img");
let nextButton = document.querySelector(".button--next");
let previousButton = document.querySelector(".button--previous");
let progressBar = document.querySelector(".img-list__progress-bar");
let progressBarCurrentPosition = document.querySelector(
  ".img-list__progress-bar--current-position"
);
let isMobile = false;

// BUTTON
const handleHideNextButton = () => {
  nextButton.style.display = "none";
};

const handleShowNextButton = () => {
  nextButton.style.display = "flex";
};

const handleHidePrevButton = () => {
  previousButton.style.display = "none";
};

const handleShowPrevButton = () => {
  previousButton.style.display = "flex";
};

const handleRenderButtonFirstTime = () => {
  if (
    progressBar?.getBoundingClientRect().width ===
    progressBarCurrentPosition?.getBoundingClientRect().width
  ) {
    handleHidePrevButton();
    handleHideNextButton();
  } else {
    handleShowNextButton();
  }
};

nextButton?.addEventListener("click", () => handleSlide("next"));

previousButton?.addEventListener("click", () => handleSlide("prev"));

handleRenderButtonFirstTime();

if (scrollDistance === 0) {
  handleHidePrevButton();
}

// PROGRESS BAR
const handleRenderProgressBar = () => {
  let __progressBarWidth = progressBar?.getBoundingClientRect().width;

  ratio = Math.ceil(
    (slider?.getBoundingClientRect().width -
      imgList?.getBoundingClientRect().width) /
      (itemImg?.getBoundingClientRect().width + 10) +
      1
  );

  progressBarCurrentPosition.style.width = `${__progressBarWidth / ratio}px`;

  handleRenderButtonFirstTime();
};

// first time render progress bar
handleRenderProgressBar();

// handle browser resize
window.addEventListener("resize", handleRenderProgressBar);

// SLIDE HANDLER
const handleSlide = (direction) => {
  sliderWidth = slider?.getBoundingClientRect().width;
  imgListWidth = imgList?.getBoundingClientRect().width;
  addedDistancePerScroll = itemImg?.getBoundingClientRect().width + 10;

  addedDistancePerScrollInProgressBar =
    progressBarCurrentPosition?.getBoundingClientRect().width;

  if (
    progressBar?.getBoundingClientRect().width ===
    progressBarCurrentPosition?.getBoundingClientRect().width
  ) {
    return;
  }

  if (direction === "next") {
    if (sliderWidth === imgListWidth + scrollDistance) {
      handleHidePrevButton();
      scrollDistance = 0;
      scrollDistanceProgressBar = 0;
    } else {
      if (
        scrollDistance + addedDistancePerScroll >
        sliderWidth - imgListWidth
      ) {
        let diff = sliderWidth - scrollDistance - imgListWidth;
        scrollDistance += diff;
      } else {
        scrollDistance += addedDistancePerScroll;
      }

      handleShowPrevButton();
      handleShowNextButton();
      scrollDistanceProgressBar += addedDistancePerScrollInProgressBar;
    }
  }

  if (direction === "prev") {
    if (scrollDistance < addedDistancePerScroll) {
      scrollDistance = 0;
    } else {
      scrollDistance -= addedDistancePerScroll;
    }

    if (scrollDistance === 0) {
      handleHidePrevButton();
    }

    scrollDistanceProgressBar -= addedDistancePerScrollInProgressBar;
  }

  if (!isMobile) {
    progressBarCurrentPosition.style.transform = `translateX(${scrollDistanceProgressBar}px)`;
  }
  imgList.scrollLeft = scrollDistance;
};

const handleScrollInMobile = (e) => {
  imgList.addEventListener("scroll", (e) => {
    let scrollLeft = e.target.scrollLeft;

    let ratioMobile = scrollLeft / slider?.getBoundingClientRect().width;

    progressBarCurrentPosition.style.transform = `translateX(${
      ratioMobile * progressBar.getBoundingClientRect().width
    }px)`;
  });
};

var x = window.matchMedia("(max-width: 425px)");

x.addListener((e) => {
  if (e.matches) {
    isMobile = true;
  } else {
    isMobile = false;
  }
});

imgList.addEventListener("scroll", (e) => {
  if (isMobile) {
    handleHideNextButton();
    handleHidePrevButton();
    handleScrollInMobile(e);
  }
});
