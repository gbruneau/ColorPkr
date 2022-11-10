
# ColorPkr

A handy color picker
Can pick colors outside of browser if chrome or edge

Base version in plain JS

TODO
* Use this library
  https://colorjs.io/docs/the-color-object
  And mix color using LAB color space instead of RGB
  
* add file upload/download including using drag and drop
* add copy to clipboard on hex, rgb, hsl, hsl 255
* quick fix: delta par defaut de 5% au lieu de 10% dans les tools

## add tool: Text against backgroud

| black        | color1 (input) | color2 (Input) | white        |
|--------------|----------------|----------------|--------------|
| black        | black/color1   | black/color2   | black/white  |
| color1/black | color1         | color1/color2  | color1/white |
| color2/black | color2/color1  | color2         | color2/white |
| white/black  | black/color1   | black/color1   | white        |
