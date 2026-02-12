import { Tool } from '../tool.js';
import { Color,ColorCard, ColorContext } from '../colorCard/colorCard.js';
import gradientIcon from './gradient.png';

class GradientTool extends Tool {
    constructor() {
        super(() => this.showTool());
        const inputSection = document.createElement('section');
        inputSection.className = 'toolInput';
        const colorFrom = new ColorCard(new Color(Color.genRandomColor()), ColorContext.ToolInput);
        const colorTo = new ColorCard(new Color(Color.genRandomColor()), ColorContext.ToolInput);
        inputSection.appendChild(colorFrom);
        inputSection.appendChild(colorTo);
        
        const outputSection = document.createElement('section');
        outputSection.className = 'toolOutput';
        outputSection.textContent = 'Gradient output';

        this.toolDiv.appendChild(inputSection);
        this.toolDiv.appendChild(outputSection);

    }
    addTool(aToolArea,aToolBar) {
        const img = document.createElement('img');
        img.src = gradientIcon;
        super.addTool( aToolArea,aToolBar, 'Generate Gradient', img);
    }

}

export { GradientTool };

