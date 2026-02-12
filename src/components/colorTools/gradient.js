import { Tool } from '../tool.js';
import { Color,ColorCard, ColorContext } from '../colorCard/colorCard.js';
import gradientIcon from './gradient.png';

class GradientTool extends Tool {
    constructor() {
        super(() => this.showTool());
        this.inputSection = document.createElement('section');
        this.inputSection.className = 'toolInput';
        const colorFrom = new ColorCard(new Color(Color.genRandomColor()), ColorContext.ToolInput);
        this.colorFrom = colorFrom.color.hex;

        const colorTo = new ColorCard(new Color(Color.genRandomColor()), ColorContext.ToolInput);
        this.colorTo = colorTo.color.hex;

        const gradientSizeInput = document.createElement('input');
        gradientSizeInput.type = 'number';
        gradientSizeInput.min = '3';
        gradientSizeInput.max = '1023';
        gradientSizeInput.value = '5';
       this.gradientSize = parseInt(gradientSizeInput.value);



        this.inputSection.appendChild(colorFrom);
        this.inputSection.appendChild(colorTo);
        this.inputSection.appendChild(gradientSizeInput);
        
        this.outputSection = document.createElement('section');
        this.outputSection.className = 'toolOutput';
        this.outputSection.textContent = 'Gradient output';

        this.toolDiv.appendChild(this.inputSection);
        this.toolDiv.appendChild(this.outputSection);



        gradientSizeInput.addEventListener('input', () => {
            this.gradientSize = parseInt(gradientSizeInput.value);
            this.refreshGradient();
        });
        colorFrom.querySelector(".colorBloc").addEventListener('change', () => {
            this.colorFrom = colorFrom.querySelector(".colorBloc").value;
            this.refreshGradient();
        });
        colorTo.querySelector(".colorBloc").addEventListener('change', () => {
            this.colorTo = colorTo.querySelector(".colorBloc").value;
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

