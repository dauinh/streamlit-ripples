import { Streamlit, RenderData } from "streamlit-component-lib"

class RippleComponent {
  public rippleColor: string;
  private rippleContainer: HTMLElement;

  constructor() {
    this.rippleContainer = document.createElement("div");
    this.rippleContainer.classList.add("ripple-container");
    this.rippleColor = "#050609";
    document.body.appendChild(this.rippleContainer);
  }

  public drawRipple(ev: MouseEvent) {
    const x = ev.clientX;
    const y = ev.clientY;

    const ripple = document.createElement("div");
    ripple.classList.add("ripple");
    ripple.style.left = x - this.rippleContainer.getBoundingClientRect().left + "px";
    ripple.style.top = y - this.rippleContainer.getBoundingClientRect().top + "px";
    ripple.style.background = this.rippleColor;
    console.log(this.rippleColor)
    ripple.classList.add("animate");

    this.rippleContainer.appendChild(ripple);

    setTimeout(() => {
      this.rippleContainer.removeChild(ripple);
    }, 1000);
  }
}

const rippleComponent = new RippleComponent();


/**
 * The component's render function. This will be called immediately after
 * the component is initially loaded, and then again every time the
 * component gets new data from Python.
 */
function onRender(event: Event): void {
  // Get the RenderData from the event
  const data = (event as CustomEvent<RenderData>).detail

  rippleComponent.rippleColor = data.theme?.base === 'light' ? "#050609" : "#ffffff"
  // RenderData.args is the JSON dictionary of arguments sent from the
  // Python script.
  let color = data.args["color"]
  if (color !== "#050609" || color !== "#ffffff") {
    rippleComponent.rippleColor = color;
  }
  window.addEventListener("click", rippleComponent.drawRipple.bind(rippleComponent));

  // We tell Streamlit to update our frameHeight after each render event, in
  // case it has changed. (This isn't strictly necessary for the example
  // because our height stays fixed, but this is a low-cost function, so
  // there's no harm in doing it redundantly.)
  Streamlit.setFrameHeight()
}

// Attach our `onRender` handler to Streamlit's render event.
Streamlit.events.addEventListener(Streamlit.RENDER_EVENT, onRender)

// Tell Streamlit we're ready to start receiving data. We won't get our
// first RENDER_EVENT until we call this function.
Streamlit.setComponentReady()

// Finally, tell Streamlit to update our initial height. We omit the
// `height` parameter here to have it default to our scrollHeight.
Streamlit.setFrameHeight()
