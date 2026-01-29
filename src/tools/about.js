
import '../style/about.css';
import { Tool } from '../classes/tool.js';

class AboutTool extends Tool {
    constructor( ) {
        /** You can add properties or methods if needed */
        const version = import.meta.env.VITE_APP_VERSION
        const buildNumber = import.meta.env.VITE_BUILD_NUMBER


        super(() => this.showTool());
        this.buttonDiv.innerHTML = 'About';
        this.toolDiv.innerHTML =`
    <h2>About ColorPkr</h2>
    <p>Version: ${version} (Build ${buildNumber})</p>
    <p>ColorPkr is a color picker application that allows you to select and manage colors.</p>
    <h3>Guy Bruneau</h3>
    <p><a href="https://gbruneau.github.io/" target="gbGitHub">GitHub</a>&nbsp<a href="https://www.linkedin.com/in/guybruneau1964" target="gbLinkedIn">LinkedIn</a></p>

  `
    this.toolDiv.classList.add('aboutToolContainer');
    }
}

export { AboutTool };
export default { AboutTool };

