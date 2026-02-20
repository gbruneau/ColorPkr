import { Tool } from '../tool.js';
import { Color,ColorCard, ColorContext } from '../colorCard/colorCard.js';
import lockIcon from './lock.png';
import './lock.css';

class LockTool extends Tool {
    constructor() {
        super(() => this.showTool());
        this.toolDiv.id = 'lockTool';
       
        this.inputSection = document.createElement('section');
        this.inputSection.className = 'toolInput';
        this.outputSection = document.createElement('section');
        this.outputSection.className = 'toolOutput';

        const toolName = document.createElement('h2');
        toolName.textContent = 'Lock Tool';
        
        this.mainSection = document.createElement('main');
        this.inputSection.appendChild(toolName);
        this.inputSection.appendChild(this.mainSection);

        this.refColorCard = new ColorCard(new Color(Color.genRandomColor()), ColorContext.ToolInput);
        this.refColorHex = this.refColorCard.color.hex;

        this.inputColorCardArrayDiv = document.createElement('div');
        this.inputColorCardArrayDiv.className = 'colorCardArray';
        this.inputColorCardArrayDiv.id = 'lockInputColorCardArray';

        this.outputColorCardArrayDiv = document.createElement('div');
        this.outputColorCardArrayDiv.className = 'colorCardArray';
        this.outputColorCardArrayDiv.id = 'lockOutputColorCardArray';

        this.inputControlsDiv = document.createElement('div');
        this.inputControlsDiv.className = 'inputControls';
        this.inputControlsDiv.id = 'lockInputControls';

        this.mainSection.appendChild(this.refColorCard);
        this.mainSection.appendChild(this.inputColorCardArrayDiv);
        this.mainSection.appendChild(this.inputControlsDiv);

        /* in  inputColorCardArrayDiv , creat 9 color cards */
        for (let i = 0; i < 9; i++) {
            const colorCard = new ColorCard(new Color(Color.genRandomColor()), ColorContext.ToolInput);
            this.inputColorCardArrayDiv.appendChild(colorCard);
        }
       
        
       /* Build input controls using JavaScript */
        this.buildInputControls();


        /** handle ref color changes */
        this.refColorCard.addEventListener('colorCardChange', () => {
            this.refreshOutput();
        });

        /** handle inputColorCardArrayDiv color changes */
        this.inputColorCardArrayDiv.addEventListener('colorCardChange', () => {
            this.refreshOutput();
        });


        this.outputSection.appendChild(this.outputColorCardArrayDiv);
        

        
        this.toolDiv.appendChild(this.inputSection);
        this.toolDiv.appendChild(this.outputSection);

        this.refreshOutput();
    }
    
    buildInputControls() {
        // Create HSL controls container
        const hslContainer = document.createElement('div');
        hslContainer.className = 'control-group';
        
        // Create RGB controls container
        const rgbContainer = document.createElement('div');
        rgbContainer.className = 'control-group';
        
        // HSL controls
        const hslControls = [
            { label: 'H', id: 'lockInputH' ,checked: false},
            { label: 'S', id: 'lockInputS' ,checked: true},
            { label: 'L', id: 'lockInputL' ,checked: true}
        ];
        
        // RGB controls
        const rgbControls = [
            { label: 'R', id: 'lockInputR' ,checked: false},
            { label: 'G', id: 'lockInputG' ,checked: false},
            { label: 'B', id: 'lockInputB' ,checked: false}
        ];
        
        // Create HSL checkboxes
        hslControls.forEach(control => {
            const controlDiv = document.createElement('div');
            const label = document.createElement('label');
            label.setAttribute('for', control.id);
            label.textContent = control.label;
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = control.id;
            checkbox.checked = control.checked;
            
            controlDiv.appendChild(label);
            controlDiv.appendChild(checkbox);
            hslContainer.appendChild(controlDiv);
        });
        
        // Create RGB checkboxes
        rgbControls.forEach(control => {
            const controlDiv = document.createElement('div');
            const label = document.createElement('label');
            label.setAttribute('for', control.id);
            label.textContent = control.label;
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = control.id;
            checkbox.checked = control.checked;
            
            controlDiv.appendChild(label);
            controlDiv.appendChild(checkbox);
            rgbContainer.appendChild(controlDiv);
        });
        
        // Add both containers to input controls div
        this.inputControlsDiv.appendChild(hslContainer);
        this.inputControlsDiv.appendChild(rgbContainer);

        /** handle checkbox changes */
        this.inputControlsDiv.addEventListener('change', () => {
            this.refreshOutput();
        });

    }

    
    addTool(aToolArea,aToolBar) {
        const img = document.createElement('img');
        img.src = lockIcon;
        super.addTool( aToolArea,aToolBar, 'Lock Tool', img);
    }
    refreshOutput() {
        this.outputColorCardArrayDiv.innerHTML = "";
        /**  populate with color lockColorPropery  based on inputs  */
        const refColor = this.refColorCard.color.hex;
        const lockH = this.inputControlsDiv.querySelector('#lockInputH').checked;
        const lockS = this.inputControlsDiv.querySelector('#lockInputS').checked;
        const lockL = this.inputControlsDiv.querySelector('#lockInputL').checked;
        const lockR = this.inputControlsDiv.querySelector('#lockInputR').checked;
        const lockG = this.inputControlsDiv.querySelector('#lockInputG').checked;
        const lockB = this.inputControlsDiv.querySelector('#lockInputB').checked;
        /** loop through input  color cards  array and output the locked color for each one */
        const inColorCards=this.inputColorCardArrayDiv.querySelectorAll('.color-card');  
        inColorCards.forEach(card => {
            const newHex = Color.lockColorPropery(refColor, card._color._hex, lockH, lockS, lockL, lockR, lockG, lockB);
            const newColor = new Color(newHex);
            const newCard = new ColorCard(newColor,ColorContext.ToolOutput);
            this.outputColorCardArrayDiv.appendChild(newCard);
        });
    }

}

export default LockTool;
export { LockTool };
