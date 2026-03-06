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
   * @param {string} attr3 color attribute (R,G,B, H,S,L)
   * @param {boolean} asc3 sort in ascending order,default to true
   * @parem {string} hexColor color to exclude from sorting,put at very end of the palette 
   */
  sortPalette(attr1, asc1 = true, attr2 = attr1, asc2 = true, attr3 = attr1, asc3 = true) {
    const sortedColors = this.paletteColors.sort((a, b) => {
      /** use getter to obtain the attribute value */
      /** attribute value my be numeric or string */
      const aVal = a.getSortProperty(attr1);
      const bVal = b.getSortProperty(attr1);
      if (aVal === bVal) {
        const aVal2 = a.getSortProperty(attr2);
        const bVal2 = b.getSortProperty(attr2);
        if (aVal2 === bVal2) {
          const aVal3 = a.getSortProperty(attr3);
          const bVal3 = b.getSortProperty(attr3);
          if (typeof aVal3==="string")
            return aVal3.localeCompare(bVal3,undefined,{ sensitivity : "base"});
          else
            return asc3 ? aVal3 - bVal3 : bVal3 - aVal3;
        }
        if (typeof aVal2==="string")
          return aVal2.localeCompare(bVal2,undefined,{ sensitivity : "base"});
        else
          return asc2 ? aVal2 - bVal2 : bVal2 - aVal2;
      }
      if (typeof aVal==="string")
        return aVal.localeCompare(bVal,undefined,{ sensitivity : "base"});
      else
        return asc1 ? aVal - bVal : bVal - aVal;
    });
    /** dump  paletcolor hex to console   */
    //   console.log(sortedColors.map(color => color.hex));
    this.paletteColors = sortedColors;
  }


}

export default ColorPalette;
export { ColorPalette };