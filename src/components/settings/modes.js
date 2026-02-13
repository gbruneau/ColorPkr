import { Tool } from '../tool.js';
import modesIcon from './darkmode.png';

const modesCssClasses = [
    'light-mode',
    'dark-mode' ,
    'grey-mode'  
]

class ModesTool extends Tool {
    constructor() {
        super( () => this.toggleMode() );
        this.mode = modesCssClasses[0];
        this.setBodyMode(this.mode);
    }
    
    addButton(aToolBar) {
        const img = document.createElement('img');
        img.src = modesIcon;
        super.addButton(aToolBar, 'Mode switcher', img);
    }
    
    toggleMode() {
        /** for all the cards, display next mode */
         const colorCards = document.querySelectorAll('.color-card');
         /** get next mode cycling to mode list */
         const nextMode = modesCssClasses[(modesCssClasses.indexOf(this.mode) + 1) % modesCssClasses.length];  
         colorCards.forEach(card => {
            this.setCardMode(card,nextMode);
         });
        this.mode = nextMode;
        this.setBodyMode(nextMode);
    }
    setCardMode(aCard,aMode) {
        /** remove all modes from cards */
        modesCssClasses.forEach(mode => {
            aCard.classList.remove(mode);
        });
        aCard.classList.add(aMode);
    }
    setBodyMode(aMode){
        modesCssClasses.forEach(mode => {
            document.body.classList.remove(mode);
        });
        document.body.classList.add(aMode);
    }  
}

export { ModesTool };
export default { ModesTool };
