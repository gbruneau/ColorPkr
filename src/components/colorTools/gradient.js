import { Tool } from '../tool.js';
import { Color,ColorCard, ColorContext } from '../colorCard/colorCard.js';
import gradientIcon from './gradient.png';

import './gradient.css';

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
        gradientSizeInput.type = 'number';
        gradientSizeInput.min = '3';
        gradientSizeInput.max = '1023';
        gradientSizeInput.value = '6';
        gradientSizeInput.id = 'gradientSize';
        this.gradientSize = parseInt(gradientSizeInput.value);
        const gradientSizeLabel = document.createElement('label');
        gradientSizeLabel.htmlFor = 'gradientSize';
        gradientSizeLabel.textContent = 'Size';




        this.inputSection.appendChild(colorFromCard);
        this.inputSection.appendChild(colorToCard);
        this.inputSection.appendChild(gradientSizeLabel);
        this.inputSection.appendChild(gradientSizeInput);
        
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
        const gradientArray= Color.genGradient(this.colorFrom,this.colorTo,this.gradientSize);
        /** create gradient cards */
        gradientArray.forEach((color) => {
            this.outputSection.appendChild(new ColorCard(new Color(color), ColorContext.ToolOutput));
        });
    }

}

export { GradientTool };

