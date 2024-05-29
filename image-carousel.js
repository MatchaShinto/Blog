const style = new CSSStyleSheet();

style.replaceSync(`
.controls {
  grid-row: 2;
  grid-column: 1;
  display: flex;
  flex-direction: row;
  pointer-events: none;
  position: sticky;
  left: 0;
  align-items: center;
  justify-content: space-between;
  justify-content: center;

  button {
    pointer-events: auto;
    border: 1px solid currentcolor;
    border-radius: 100%;
    width: 24px;
    height: 24px;
    line-height: 24px;
    padding: 0;
    cursor: pointer;
  }

  .dots {
    display: flex;
    flex-direction: row;
    gap: 1ex;
  }

  .dot {
    pointer-events: auto;
    cursor: pointer;
    background: transparent;
    width: 12px;
    height: 12px;
    border: 1px solid black;
    border-radius: 100%;
    box-sizing: border-box;
    position: relative;
  }
}
`);

const chevronRight = `<svg height="21" viewBox="0 0 21 21" width="21" xmlns="http://www.w3.org/2000/svg"><path d="m.5 8.5 4-4-4-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" transform="translate(9 6)"/></svg>`;
const chevronLeft = `<svg height="21" viewBox="0 0 21 21" width="21" xmlns="http://www.w3.org/2000/svg"><path d="m4.5 8.5-4-4 4-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" transform="translate(7 6)"/></svg>`;

export class ImageCarousel extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    shadow.append(document.createElement("slot"), this.createControls());
    shadow.adoptedStyleSheets.push(style);
  }

  next() {
    this.scrollBy({ left: 10, behavior: "smooth" });
  }

  previous() {
    this.scrollBy({ left: -10, behavior: "smooth" });
  }

  createControls() {
    const controls = document.createElement("div");
    controls.classList.add("controls");
    const previousButton = document.createElement("button");
    previousButton.innerHTML = chevronLeft;
    const nextButton = document.createElement("button");
    nextButton.innerHTML = chevronRight;

    nextButton.addEventListener("click", () => {
      this.next();
    });
    previousButton.addEventListener("click", () => {
      this.previous();
    });

    //controls.append(previousButton, this.createDots(), nextButton);
    controls.append(this.createDots());

    return controls;
  }

  createDots() {
    const dotForPicture = new WeakMap();
    const thresholdMax = 0.75;
    const thresholdSteps = 10;
    const thresholds = [];
    for (let i = 0; i <= thresholdSteps; i++) {
      thresholds.push((i / thresholdSteps) * thresholdMax);
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const dot = dotForPicture.get(entry.target);
          if (!dot) return;
          const adjusted =
            Math.min(thresholdMax, entry.intersectionRatio) / thresholdMax;
          const pct = adjusted * 60;
          dot.style.backgroundImage = `radial-gradient(circle at center, black, black ${pct}%, transparent ${pct}%)`;
        }
      },
      {
        root: this,
        rootMargin: "-10px",
        threshold: thresholds,
      }
    );
    const dots = document.createElement("div");
    dots.classList.add("dots");
    const pictures = this.querySelectorAll("picture");
    for (const picture of pictures) {
      const dot = document.createElement("button");
      dotForPicture.set(picture, dot);
      io.observe(picture);
      dot.classList.add("dot");
      dot.addEventListener("click", () => {
        this.scrollTo({ left: picture.offsetLeft, behavior: "smooth" });
      });
      dots.append(dot);
    }
    return dots;
  }
}

customElements.define("image-carousel", ImageCarousel);
