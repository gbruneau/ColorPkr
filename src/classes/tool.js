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
    showTool() {
        /* hide all div of parent first */
        const parent = this.toolDiv.parentNode;
        for (let i = 0; i < parent.children.length; i++) {
            parent.children[i].style.display = 'none';
        }
        /** show this tool div */
        this.toolDiv.style.display = 'block';
    }
    showButton() {
        this.buttonDiv.style.display = 'block';
    }
    hideButton() {
        this.buttonDiv.style.display = 'none';
    }
    addTool(aToolBar,aButtonHTML , aToolArea) {
        aToolBar.appendChild(this.buttonDiv);
        aToolArea.appendChild(this.toolDiv);
        this.buttonDiv.innerHTML = aButtonHTML;
    }
    addButton(aToolBar,aButtonHTML) {
        aToolBar.appendChild(this.buttonDiv)
        this.buttonDiv.innerHTML = aButtonHTML;
    }
}

export { Tool };