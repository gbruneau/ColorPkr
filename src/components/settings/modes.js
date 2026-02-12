import { Tool } from '../tool.js';
import modesIcon from './darkmode.png';

class ModesTool extends Tool {
    constructor() {
        super( () => this.toggleMode() );
    }
    
    addButton(aToolBar) {
        const img = document.createElement('img');
        img.src = modesIcon;
        super.addButton(aToolBar, 'Mode switcher', img);
    }
    
    toggleMode() {
        document.body.classList.toggle('dark-mode');
        /** for all color-card elements */
        const colorCards = document.querySelectorAll('.color-card');
        colorCards.forEach(card => {
            card.classList.toggle('dark-mode');
        });
    }
}

export { ModesTool };
export default { ModesTool };
