import { Tool } from '../tool.js';
import { Color,ColorCard, ColorContext } from '../colorCard/colorCard.js';
import gradientIcon from './gradient.png';

import './gradient.css';

const GradientTypes = Object.freeze({
    HSL: 'HSL',
    RGB: 'RGB'
});

const DEFAULT_GRADIENT_SIZE = 7;
const DEFAULT_GRADIENT_TYPE = GradientTypes.RGB;



class GradientTool extends Tool {
    constructor() {
        super(() => this.showTool());
        this.inputSection = document.createElement('section');
        this.inputSection.className = 'toolInput';
        const colorFromCard = new ColorCard(new Color(Color.genRandomColor()), ColorContext.ToolInput);
        this.colorFrom = colorFromCard.color.hex;

        const colorToCard = new ColorCard(new Color(Color.genRandomColor()), ColorContext.ToolInput);
        this.colorTo = colorToCard.color.hex;

        const toolName = document.createElement('h2');
        toolName.textContent = 'Gradient Tool';
        this.inputSection.appendChild(toolName);
        const gradientSizeInput = document.createElement('input');

        const gradientInput = document.createElement('div');
        gradientInput.className = 'gradientInput';

        gradientSizeInput.type = 'number';
        gradientSizeInput.min = '3';
        gradientSizeInput.max = '1023';
        gradientSizeInput.value = DEFAULT_GRADIENT_SIZE;
        gradientSizeInput.id = 'gradientSize';
        this.gradientSize = parseInt(gradientSizeInput.value);
        const gradientSizeLabel = document.createElement('label');
        gradientSizeLabel.htmlFor = 'gradientSize';
        gradientSizeLabel.textContent = 'Size';

        const gradientTypeSelect = document.createElement('select');
        gradientTypeSelect.id = 'gradientType';
        gradientTypeSelect.innerHTML = `
            <option value="${GradientTypes.HSL}">${GradientTypes.HSL}</option>
            <option value="${GradientTypes.RGB}">${GradientTypes.RGB}</option>
        `;
        this.gradientType = DEFAULT_GRADIENT_TYPE;
        gradientTypeSelect.value = this.gradientType;
        const gradientTypeLabel = document.createElement('label');
        gradientTypeLabel.htmlFor = 'gradientType';
        gradientTypeLabel.textContent = 'Type';

        this.inputSection.appendChild(colorFromCard);
        this.inputSection.appendChild(colorToCard);



        gradientInput.appendChild(gradientSizeLabel);
        gradientInput.appendChild(gradientSizeInput);
        gradientInput.appendChild(gradientTypeLabel);
        gradientInput.appendChild(gradientTypeSelect);
        this.inputSection.appendChild(gradientInput);



        
        this.outputSection = document.createElement('section');
        this.outputSection.className = 'toolOutput';
        this.outputSection.textContent = 'Gradient output';

        this.toolDiv.appendChild(this.inputSection);
        this.toolDiv.appendChild(this.outputSection);
        this.toolDiv.id = 'gradientTool';



        gradientSizeInput.addEventListener('input', () => {
            this.gradientSize = parseInt(gradientSizeInput.value);
            this.refreshGradient();
        });

        colorFromCard.addEventListener('colorCardChange', () => {
            this.colorFrom = colorFromCard.color.hex;
            this.refreshGradient();
        });
        colorToCard.addEventListener('colorCardChange', () => {
            this.colorTo = colorToCard.color.hex;
            this.refreshGradient();
        });
        gradientTypeSelect.addEventListener('change', () => {
            this.gradientType = gradientTypeSelect.value  ;
            this.refreshGradient();
        });



        this.refreshGradient();

    }
    addTool(aToolArea,aToolBar) {
        const img = document.createElement('img');
        img.src = gradientIcon;
        super.addTool( aToolArea,aToolBar, 'Generate Gradient', img);
    }
    refreshGradient() {
        /** cleat output section */
        this.toolDiv.querySelector('.toolOutput').innerHTML = '';
        /** create gradient */
        let gradientArray;
        if (this.gradientType === GradientTypes.HSL) {
            gradientArray= Color.genHSLGradient(this.colorFrom,this.colorTo,this.gradientSize);
        } else {
            gradientArray= Color.genRGBGradient(this.colorFrom,this.colorTo,this.gradientSize);
        }
        /** create gradient cards */
        gradientArray.forEach((colorHex) => {
            this.outputSection.appendChild(new ColorCard(new Color(colorHex), ColorContext.ToolOutput));
        });
    }

}

export { GradientTool };

