
import './asset/about.css';
import { Tool } from '../tool.js';
import aboutIcon from './asset/about.png';
import appIcon from '../../asset/ColorPkrIcon.svg';


class AboutTool extends Tool {
    constructor() {
        /** You can add properties or methods if needed */
        const version = import.meta.env.VITE_APP_VERSION
        const buildNumber = import.meta.env.VITE_BUILD_NUMBER


        super(() => this.showDialog());
        this.toolDiv.innerHTML = `
           <div class="dialogTool" id="aboutTool">
           <img src="${appIcon}" alt="ColorPkr Icon" />
    <h2>About ColorPkr</h2>
    <p>Version: ${version} (Build ${buildNumber})</p>
    <p>A cool color Manager and Picker</p>
    <h3>Guy Bruneau</h3>
    <p><a href="https://gbruneau.github.io/" target="gbGitHub">GitHub</a>&nbsp<a href="https://www.linkedin.com/in/guybruneau1964" target="gbLinkedIn">LinkedIn</a></p>
    <div>
        <input type="button" id="btCloseAbout" value="OK" />
    </div>
</div>
  `
        this.toolDiv.classList.add('aboutToolContainer');
       
        const btCloseAbout = this.toolDiv.querySelector('#btCloseAbout');
        btCloseAbout.addEventListener('click', () => {
            this.hideDialog();
        });
    }
    addButton(aToolBar) {
        const img = document.createElement('img');
        img.src = aboutIcon;
        super.addButton(aToolBar, 'About ColorPkr', img);
    }

}

export { AboutTool };
export default { AboutTool };

