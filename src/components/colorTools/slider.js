import { Tool } from '../tool.js';
import { Color,ColorCard, ColorContext } from '../colorCard/colorCard.js';
import sliderIcon from './slide.png';

import './slider.css';

class SliderTool extends Tool {
    constructor() {
        super(() => this.showTool());
        this.inputSection = document.createElement('section');
        this.inputSection.className = 'toolInput';
        const baseColorCard = new ColorCard(new Color(Color.genRandomColor()), ColorContext.ToolInput);
        this.baseColor = baseColorCard.color;

        const toolName = document.createElement('h2');
        toolName.textContent = 'Slider Tool';
        this.inputSection.appendChild(toolName);

        this.sliderInputs = document.createElement('div');
        this.sliderInputs.className = 'sliderInputs';

        this.sliderSizeInput = document.createElement('input');
        this.sliderSizeInput.type = 'number';
        this.sliderSizeInput.min = '3';
        this.sliderSizeInput.max = '1023';
        this.sliderSizeInput.value = '5';
        this.sliderSizeInput.id = 'sliderSize';
        this.sliderSize = parseInt(this.sliderSizeInput.value);
        this.sliderSizeLabel = document.createElement('label');
        this.sliderSizeLabel.htmlFor = 'sliderSize';
        this.sliderSizeLabel.textContent = 'Size';

        this.deltaHInput = document.createElement('input');
        this.deltaHInput.type = 'number';
        this.deltaHInput.min = '-360';
        this.deltaHInput.max = '360';
        this.deltaHInput.value = '30';
        this.deltaHInput.id = 'deltaH';
        this.deltaHInput.step = '15';
        this.deltaH = parseInt(this.deltaHInput.value);
        this.deltaHLabel = document.createElement('label');
        this.deltaHLabel.htmlFor = 'deltaH';
        this.deltaHLabel.textContent = 'ΔH';

        this.deltaSInput = document.createElement('input'); 
        this.deltaSInput.type = 'number';
        this.deltaSInput.min = '-100';
        this.deltaSInput.max = '100';
        this.deltaSInput.value = '0';
        this.deltaSInput.id = 'deltaS';
        this.deltaSInput.step = '5';
        this.deltaS = parseInt(this.deltaSInput.value);
        this.deltaSLabel = document.createElement('label');
        this.deltaSLabel.htmlFor = 'deltaS';
        this.deltaSLabel.textContent = 'ΔS';

        this.deltaLInput = document.createElement('input');
        this.deltaLInput.type = 'number';
        this.deltaLInput.min = '-100';
        this.deltaLInput.max = '100';
        this.deltaLInput.value = '0';
        this.deltaLInput.id = 'deltaL';
        this.deltaLInput.step = '5';
        this.deltaL = parseInt(this.deltaLInput.value);
        this.deltaLLabel = document.createElement('label');
        this.deltaLLabel.htmlFor = 'deltaL'; 
        this.deltaLLabel.textContent = 'ΔL';

        this.sliderInputs.appendChild(this.sliderSizeLabel);
        this.sliderInputs.appendChild(this.sliderSizeInput);
        this.sliderInputs.appendChild(this.deltaHLabel);
        this.sliderInputs.appendChild(this.deltaHInput);
        this.sliderInputs.appendChild(this.deltaSLabel);
        this.sliderInputs.appendChild(this.deltaSInput);
        this.sliderInputs.appendChild(this.deltaLLabel);
        this.sliderInputs.appendChild(this.deltaLInput);
        

        this.inputSection.appendChild(baseColorCard);
        this.inputSection.appendChild(this.sliderInputs);


        
        this.outputSection = document.createElement('section');
        this.outputSection.className = 'toolOutput';
        this.outputSection.textContent = 'Slider output';

        this.toolDiv.appendChild(this.inputSection);
        this.toolDiv.appendChild(this.outputSection);
        this.toolDiv.id = 'sliderTool';

        this.sliderSizeInput.addEventListener('input', () => {
            this.sliderSize = parseInt(this.sliderSizeInput.value);
            this.refreshSlider();
        });

        this.deltaHInput.addEventListener('input', () => {
            this.deltaH = parseInt(this.deltaHInput.value);
            this.refreshSlider();
        });

        this.deltaSInput.addEventListener('input', () => {
            this.deltaS = parseInt(this.deltaSInput.value);
            this.refreshSlider();
        });

        this.deltaLInput.addEventListener('input', () => {
            this.deltaL = parseInt(this.deltaLInput.value);
            this.refreshSlider();
        });

        baseColorCard.addEventListener('colorCardChange', () => {
     //       this.baseColor = baseColorCard.color;
            this.refreshSlider();
        });

        this.refreshSlider();
    }

    addTool(aToolArea,aToolBar) {
        const img = document.createElement('img');
        img.src = sliderIcon;
        super.addTool( aToolArea,aToolBar, 'Generate Slider', img);
    }

    refreshSlider() {
        /** clear output section */
        this.toolDiv.querySelector('.toolOutput').innerHTML = '';
        /** create slider */
        const sliderArray = Color.genSlider(this.baseColor, this.sliderSize, this.deltaH, this.deltaS, this.deltaL);
        /** create slider cards */
        sliderArray.forEach((color) => {
            this.outputSection.appendChild(new ColorCard(new Color(color), ColorContext.ToolOutput));
        });
    }
}

export { SliderTool };
