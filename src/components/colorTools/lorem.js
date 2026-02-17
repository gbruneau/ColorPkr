import { Tool } from '../tool.js';
import { Color, ColorCard, ColorContext } from '../colorCard/colorCard.js';
import loremIcon from './lorem.png';
import './lorem.css';

class LoremTool extends Tool {
    constructor() {
        super(() => this.showTool());
        this.inputSection = document.createElement('section');
        this.inputSection.className = 'toolInput';
        const colorC1Card = new ColorCard(new Color(Color.genRandomColor()), ColorContext.ToolInput);
        this.colorC1 = colorC1Card.color.hex;

        const colorC2Card = new ColorCard(new Color(Color.genRandomColor()), ColorContext.ToolInput);
        this.colorC2 = colorC2Card.color.hex;

        const toolName = document.createElement('h2');
        toolName.textContent = 'Color Test';
        this.inputSection.appendChild(toolName);

        this.inputSection.appendChild(colorC1Card);
        this.inputSection.appendChild(colorC2Card);
        this.toolDiv.appendChild(this.inputSection);

        this.outputSection = document.createElement('section');
        this.outputSection.className = 'toolOutput';

        this.toolDiv.appendChild(this.outputSection);
        this.toolDiv.id = 'loremTool';

        this.ColorTest = Color.genColorTest(this.colorC1, this.colorC2);
        for (let i = 0; i < this.ColorTest.length; i++) {
            this.addLoremCard(`loremCard${i}`, this.ColorTest[i][0], this.ColorTest[i][1]);
        }
        /** if ColorC1 or C2 changed (colorCardChange) , trigger testChanged */
        colorC1Card.addEventListener('colorCardChange', () => {
            this.colorTestChanged(colorC1Card.color.hex, this.colorC2)
        });
        colorC2Card.addEventListener('colorCardChange', () => {
            this.colorTestChanged(this.colorC1, colorC2Card.color.hex)
        });


    }
    addTool(aToolArea, aToolBar) {
        const img = document.createElement('img');
        img.src = loremIcon;
        super.addTool(aToolArea, aToolBar, 'Lorem Tool', img);
    }
    addLoremCard(loremCardID, fgColor, bgColor) {
        const loremCard = document.createElement('div');
        loremCard.classList.add('loremCard');
        loremCard.id = loremCardID;
        loremCard.innerHTML = `
            <div class="loremText"></div>
            <div class="loremBlock"></div>
        `;

        loremCard.querySelector(`#${loremCardID} .loremText`).textContent = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
        this.outputSection.appendChild(loremCard);
        this.setLoremCardColor(loremCardID, fgColor, bgColor);
    }
    setLoremCardColor(loremCardID, fgColor, bgColor) {
        this.outputSection.querySelector(`#${loremCardID}`).style.color = fgColor;
        this.outputSection.querySelector(`#${loremCardID}`).style.backgroundColor = bgColor;
        this.outputSection.querySelector(`#${loremCardID} .loremBlock`).style.backgroundColor = fgColor;
    }
    colorTestChanged(newHexColor1, newHexColor2) {
        this.ColorTest = Color.genColorTest(newHexColor1, newHexColor2);
        for (let i = 0; i < this.ColorTest.length; i++) {
            this.setLoremCardColor(`loremCard${i}`, this.ColorTest[i][0], this.ColorTest[i][1]);
        }
    }

}

export { LoremTool };