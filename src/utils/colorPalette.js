import { Color } from "./color.js";

class ColorPalette {
  constructor() {
    this.paletteColors = [];
  }
  /**
   * Add a color to the palette
   * @param {Color} color 
   */
  addColorToPalette(color = this.defaultColor) {
    this.paletteColors.push(color);
  }
  get paletteSize() {
    return this.paletteColors.length;
  }
  clearPalette() {
    this.paletteColors = [];
  }
  /** resize the palette, if the new size is greater, add default color */
  resisePalette(newSize) {
    if (newSize > this.paletteColors.length) {
      for (let i = this.paletteColors.length; i < newSize; i++) {
        this.paletteColors.push(new Color());
      }
    } else {
      this.paletteColors = this.paletteColors.slice(0, newSize);
    }
  }
}

export default ColorPalette;
export { ColorPalette };