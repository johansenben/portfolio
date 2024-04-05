export class Piece {
    top;
    bottom;
    front;
    back;
    left;
    right;
    animateClass;
    animateDeg;
    constructor({ top = "black", bottom = "black", front = "black", back = "black", left = "black", right = "black", animateClass = '', animateDeg = 0 }) {
        this.top = top;
        this.bottom = bottom;
        this.front = front;
        this.back = back;
        this.left = left;
        this.right = right;
        this.animateClass = animateClass;
        this.animateDeg = animateDeg;
    }
    hasSideColor = () => {
        if (this.front != "black")
            return this.front;
        if (this.back != "black")
            return this.back;
        if (this.left != "black")
            return this.left;
        if (this.right != "black")
            return this.right;
    };
}
customElements.define("cube-piece", class Cube extends HTMLElement {
    constructor() {
        super();
        let top = this.getAttribute("bg-top") || "black";
        let bottom = this.getAttribute("bg-bottom") || "black";
        let front = this.getAttribute("bg-front") || "black";
        let back = this.getAttribute("bg-back") || "black";
        let left = this.getAttribute("bg-left") || "black";
        let right = this.getAttribute("bg-right") || "black";
        this.innerHTML = /*html*/ `
            <div class="side top" style="--bg-top:${top}"></div>
            <div class="side bottom" style="--bg-bottom:${bottom}"></div>
            <div class="side left" style="--bg-left:${left}"></div>
            <div class="side right" style="--bg-right:${right}"></div>
            <div class="side front" style="--bg-front:${front}"></div>
            <div class="side back" style="--bg-back:${back}"></div>
        `;
    }
});
export let globalVars = {
    cube: document.querySelector("#rubiks-cube"),
    pieces: [],
    moveHistory: [],
    isRotateAllowed: true,
    isTurnIntRunning: false
};
export const setup = () => {
    for (let i = 0; i < 27; i++) {
        let colors = new Piece({ top: "black", bottom: "black", front: "black", back: "black", left: "black", right: "black" });
        if (i >= 18)
            colors.top = "white";
        else if (i < 9)
            colors.bottom = "yellow";
        if (i % 9 < 3)
            colors.back = "orange";
        else if (i % 9 >= 6)
            colors.front = "red";
        if ((i + 1) % 3 == 0)
            colors.right = "blue";
        else if (i % 3 == 0)
            colors.left = "green";
        globalVars.cube.innerHTML += /*html*/ `
            <cube-piece 
                bg-top="${colors.top}" bg-bottom="${colors.bottom}" 
                bg-left="${colors.left}" bg-right="${colors.right}"
                bg-front="${colors.front}" bg-back="${colors.back}"
            ></cube-piece>
        `;
        globalVars.pieces.push(colors);
    }
};
