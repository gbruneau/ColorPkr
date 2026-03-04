import { Color } from "./color.js";

/**
 * ColorPalette class for handling color palette operations
 * @class ColorPalette
 * 
 * @property {Color[]} paletteColors - The array of colors in the palette
 * @method constructor - Create a ColorPalette instance.
 * @method addColorToPalette - Add a color to the palette.
 * @method paletteSize - Get the size of the palette.
 * @method clearPalette - Clear the palette.
 * @method resisePalette - Resize the palette.
 * @method sortPalette - Sort the palette.
 * 
 *
 */
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
  /**
   * Sort the palette 
   * @param {string} attr1 color attribute (R,G,B, H,S,L)
   * @param {boolean} asc1 sort in ascending order,default to true
   * @param {string} attr2 color attribute (R,G,B, H,S,L)
   * @param {boolean} asc2 sort in ascending order,default to true
   */
  sortPalette(attr1, asc1 = true, attr2=attr1, asc2 = true,attr3=attr1,asc3=true) {
    this.paletteColors.sort((a, b) => {
      const aVal = a[attr1];
      const bVal = b[attr1];
      if (aVal === bVal) {
        const aVal2 = a[attr2];
        const bVal2 = b[attr2];
        if (aVal2 === bVal2) {
          const aVal3 = a[attr3];
          const bVal3 = b[attr3];
          return asc3 ? aVal3 - bVal3 : bVal3 - aVal3;
        }
        return asc2 ? aVal2 - bVal2 : bVal2 - aVal2;
      }
      return asc1 ? aVal - bVal : bVal - aVal;
    });
  }
}

export default ColorPalette;
export { ColorPalette };