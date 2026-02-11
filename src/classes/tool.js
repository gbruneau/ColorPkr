import '../style/tool.css';

class Tool {
    constructor(onClickFunction) {
        /** create 2 new instance of div element node, one name buttonDiv , the other toolDiv */
        this.buttonDiv = document.createElement('div');
        this.buttonDiv.classList.add('toolBarButton');
        this.buttonDiv.addEventListener('click', onClickFunction);

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
        this.toolDiv.style.display = 'block';
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
    addTool(aToolBar,aButtonHTML , aToolArea,hintText="") {
        aToolBar.appendChild(this.buttonDiv);
        aToolArea.appendChild(this.toolDiv);
        this.buttonDiv.innerHTML = aButtonHTML;
        this.buttonDiv.title = hintText;
    }
    /** add the tool button to the toolbar */
    addButton(aToolBar,aButtonHTML,hintText="") {
        aToolBar.appendChild(this.buttonDiv)
        this.buttonDiv.innerHTML = aButtonHTML;
        this.buttonDiv.title = hintText;
    }
}

export { Tool };