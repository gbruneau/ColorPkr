import { Tool } from '../tool.js';
import modesIcon from './darkmode.png';

const modesCssClasses = [
    'light-mode',
    'dark-mode'  
]

class ModesTool extends Tool {
    constructor() {
        super( () => this.toggleMode() );
        this.initMode();
    }
    
    addButton(aToolBar) {
        const img = document.createElement('img');
        img.src = modesIcon;
        super.addButton(aToolBar, 'Mode switcher', img);
    }
    
    toggleMode() {
         const nextMode = modesCssClasses[(modesCssClasses.indexOf(this.mode) + 1) % modesCssClasses.length];  
         this.setMode(nextMode);
    }
    setCardMode(aCard,aMode) {
        /** remove all modes from cards */
        modesCssClasses.forEach(mode => {
            if(mode !== aMode) {
                aCard.classList.remove(mode);
            }
        });
        aCard.classList.add(aMode);
    }
    setMode(aMode){
        modesCssClasses.forEach(mode => {
            if(mode !== aMode) {
                document.body.classList.remove(mode);
            }
        });
        document.body.classList.add(aMode);
         const colorCards = document.querySelectorAll('.color-card');
         colorCards.forEach(card => {
            this.setCardMode(card,aMode);
         });
         this.mode = aMode;
    }  
    initMode() {
        this.mode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark-mode' : 'light-mode';
        this.setMode(this.mode);
    }
    
}

export { ModesTool };
export default { ModesTool };
