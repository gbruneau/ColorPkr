import './tool.css';

class Tool {
    /**
     * @param {Function} onClickToolIcon - The function to call when the tool icon is clicked
     */
    constructor(onClickToolIcon) {
        /** create 2 new instance of div element node, one name buttonDiv , the other toolDiv */
        this.buttonDiv = document.createElement('div');
        this.buttonDiv.classList.add('toolBarButton');
        this.buttonDiv.addEventListener('click', onClickToolIcon);

        this.toolDiv = document.createElement('div');
        this.toolDiv.classList.add('toolContainer');
        this.toolDiv.style.display = 'none';
    }
    /** show the tool div */
    showTool() {
        /* hide all div of parent first */
        const parent = this.toolDiv.parentNode;
        for (let i = 0; i < parent.children.length; i++) {
            parent.children[i].style.display = 'none';
        }
        /** show this tool div */
        this.toolDiv.style.display = 'flex';
    }
    /** hide the tool div */
    hideDialog() {
        this.toolDiv.style.display = 'none';
    }   
    /** show the tool div */
    showDialog() {
        this.toolDiv.style.display = 'block';
    }

    /** show the button div */
    showButton() {
        this.buttonDiv.style.display = 'block';
        this.buttonDiv.style.visibility = 'visible';
    }
    /** hide the button div */
    hideButton() {
        this.buttonDiv.style.display = 'none';
    }
    /** make the button div invisible */
    invisibleButton() {
        this.buttonDiv.style.visibility = 'hidden';
    }

    /** add the tool to the toolbar and tool area */
    /** @param {HTMLElement} aToolArea - The tool area element */
    /** @param {HTMLElement} aToolBar - The tool bar element */
    /** @param {string} hintText - The hint text for the tool */
    /** @param {HTMLElement} imgNode - The image node for the tool */
    addTool(aToolArea,aToolBar,hintText="",imgNode ) {
        aToolArea.appendChild(this.toolDiv);
        this.addButton(aToolBar,  hintText, imgNode);
    }
    /** add the tool button to the toolbar */
    addButton(aToolBar,hintText="",imgNode) {
        aToolBar.appendChild(this.buttonDiv)
        this.buttonDiv.appendChild(imgNode);
        this.buttonDiv.title = hintText;
    }
    static createSeparator(atoolBarElement) {
        const separator = document.createElement('div');
        separator.classList.add('toolSeparator');
        atoolBarElement.appendChild(separator);
        return separator;
    }
}

export { Tool };