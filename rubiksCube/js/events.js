import { Piece, globalVars, setup } from './global.js';
import { algorithmEvent } from './algorithms.js';
const refreshCube = () => {
    globalVars.cube.innerHTML = '';
    for (let i = 0; i < 27; i++) {
        globalVars.cube.innerHTML += /*html*/ `
            <cube-piece class="${globalVars.pieces[i].animateClass}"
                style="--rotate-deg:${globalVars.pieces[i].animateDeg}deg"
                bg-top="${globalVars.pieces[i].top}" bg-bottom="${globalVars.pieces[i].bottom}" 
                bg-left="${globalVars.pieces[i].left}" bg-right="${globalVars.pieces[i].right}"
                bg-front="${globalVars.pieces[i].front}" bg-back="${globalVars.pieces[i].back}"
            ></cube-piece>
        `;
    }
};
const removeAnimations = () => {
    for (let i = 0; i < 27; i++) {
        globalVars.pieces[i].animateClass = '';
    }
    refreshCube();
};
let moveQuery = [];
let turnInterval;
let rotateSpeed = 750;
//let isTurnIntRunning = false;
function delay(time) {
    setTimeout(() => { }, 5000);
}
export const rotateSide = (timeout, addToHistory, sideColor, isClockwise = true) => {
    const rotateKey = {
        "white": [18, 19, 20, 21, 22, 23, 24, 25, 26],
        "yellow": [6, 7, 8, 3, 4, 5, 0, 1, 2],
        "red": [24, 25, 26, 15, 16, 17, 6, 7, 8],
        "orange": [20, 19, 18, 11, 10, 9, 2, 1, 0],
        "green": [18, 21, 24, 9, 12, 15, 0, 3, 6],
        "blue": [26, 23, 20, 17, 14, 11, 8, 5, 2]
    };
    const rotate3x3 = (side, isClockwise = true) => {
        if (isClockwise) {
            return [side[6], side[3], side[0], side[7], side[4], side[1], side[8], side[5], side[2]];
        }
        else {
            return [side[2], side[5], side[8], side[1], side[4], side[7], side[0], side[3], side[6]];
        }
    };
    const rotatePiece = (piece, sideColor, isClockwise = true) => {
        if (isClockwise) {
            switch (sideColor) {
                case "white":
                    return new Piece({ top: piece.top, front: piece.right, back: piece.left, left: piece.front, right: piece.back, animateClass: "rotate-white", animateDeg: 90 });
                case "yellow":
                    return new Piece({ bottom: piece.bottom, front: piece.left, back: piece.right, left: piece.back, right: piece.front, animateClass: "rotate-yellow", animateDeg: -90 });
                case "red":
                    return new Piece({ top: piece.left, bottom: piece.right, front: piece.front, left: piece.bottom, right: piece.top, animateClass: "rotate-red", animateDeg: -90 });
                case "orange":
                    return new Piece({ top: piece.right, bottom: piece.left, back: piece.back, left: piece.top, right: piece.bottom, animateClass: "rotate-orange", animateDeg: 90 });
                case "green":
                    return new Piece({ top: piece.back, bottom: piece.front, front: piece.top, back: piece.bottom, left: piece.left, animateClass: "rotate-blue", animateDeg: 90 });
                case "blue":
                    return new Piece({ top: piece.front, bottom: piece.back, front: piece.bottom, back: piece.top, right: piece.right, animateClass: "rotate-green", animateDeg: -90 });
            }
        }
        else {
            switch (sideColor) {
                case "white":
                    return new Piece({ top: piece.top, front: piece.left, back: piece.right, left: piece.back, right: piece.front, animateClass: "rotate-white", animateDeg: -90 });
                case "yellow":
                    return new Piece({ bottom: piece.bottom, front: piece.right, back: piece.left, left: piece.front, right: piece.back, animateClass: "rotate-yellow", animateDeg: 90 });
                case "red":
                    return new Piece({ top: piece.right, bottom: piece.left, front: piece.front, left: piece.top, right: piece.bottom, animateClass: "rotate-red", animateDeg: 90 });
                case "orange":
                    return new Piece({ top: piece.left, bottom: piece.right, back: piece.back, left: piece.bottom, right: piece.top, animateClass: "rotate-orange", animateDeg: -90 });
                case "green":
                    return new Piece({ top: piece.front, bottom: piece.back, front: piece.bottom, back: piece.top, left: piece.left, animateClass: "rotate-blue", animateDeg: -90 });
                case "blue":
                    return new Piece({ top: piece.back, bottom: piece.front, front: piece.top, back: piece.bottom, right: piece.right, animateClass: "rotate-green", animateDeg: 90 });
            }
        }
    };
    const turnIntervalFn = (resetSpeed = true) => {
        if (moveQuery.length === 0) {
            clearInterval(turnInterval);
            globalVars.isTurnIntRunning = false;
            globalVars.isRotateAllowed = true;
            return;
        }
        if (rotateSpeed !== moveQuery[0].speed) {
            rotateSpeed = moveQuery[0].speed;
            document.querySelector("#rubiks-cube").style.setProperty("--rotate-speed", (rotateSpeed / 1000) + 's');
            if (resetSpeed) {
                clearInterval(turnInterval);
                turnInterval = setInterval(turnIntervalFn, rotateSpeed);
            }
        }
        removeAnimations();
        let side = [];
        for (let i = 0; i < 9; i++) {
            side.push(rotatePiece(globalVars.pieces[rotateKey[moveQuery[0].side][i]], moveQuery[0].side, moveQuery[0].isClockwise));
        }
        side = rotate3x3(side, moveQuery[0].isClockwise);
        for (let i = 0; i < 9; i++) {
            globalVars.pieces[rotateKey[moveQuery[0].side][i]] = side[i];
        }
        refreshCube();
        if (moveQuery[0].addToHistory)
            globalVars.moveHistory.push({ sideColor: moveQuery[0].side, isClockwise: moveQuery[0].isClockwise });
        moveQuery.shift();
    };
    let totalMoves = moveQuery.length;
    moveQuery.push({ side: sideColor, isClockwise: isClockwise, speed: timeout, addToHistory: addToHistory });
    if (totalMoves === 0 && !globalVars.isTurnIntRunning) {
        turnIntervalFn(false);
        globalVars.isTurnIntRunning = true;
        turnInterval = setInterval(turnIntervalFn, rotateSpeed);
    }
    /*let int:number;
    function turnIntervalFn (addToHistory:boolean) {
        if (rotateSpeed !== moveQuery[0].speed){
            rotateSpeed = moveQuery[0].speed;
            (document.querySelector("#rubiks-cube") as HTMLElement).style.setProperty("--rotate-speed", (rotateSpeed / 1000) + 's');
        }
        removeAnimations();
        let side:Piece[] = [];
        for (let i = 0; i < 9; i++){
            side.push(
                rotatePiece(globalVars.pieces[rotateKey[moveQuery[0].side][i]], moveQuery[0].side, moveQuery[0].isClockwise)!
            );
        }
        side = rotate3x3(side, moveQuery[0].isClockwise);
        for (let i = 0; i < 9; i++){
            globalVars.pieces[rotateKey[moveQuery[0].side][i]] = side[i];
        }
        refreshCube();
        if (addToHistory)
            globalVars.moveHistory.push({sideColor:moveQuery[0].side, isClockwise:moveQuery[0].isClockwise});
        moveQuery.shift();
        clearInterval(int)
        //delay(rotateSpeed);console.log(1)
    }
    moveQuery.push({side:sideColor,isClockwise:isClockwise,speed:timeout, addToHistory:addToHistory});
    if (!isTurnIntRunning){
        isTurnIntRunning = true;
        if (globalVars.isRotateAllowed)
            while (moveQuery.length > 0){
                globalVars.isRotateAllowed = false;
                int = setInterval( turnIntervalFn, 5000, moveQuery[0].addToHistory);
            }
        isTurnIntRunning = false;
        globalVars.isRotateAllowed = true;
    }*/
};
export const rotateSideButton = (timeout, addToHistory, sideColor, isClockwise = true) => {
    if (globalVars.isRotateAllowed)
        rotateSide(timeout, addToHistory, sideColor, isClockwise);
};
export const randomizeCube = () => {
    if (globalVars.isRotateAllowed) {
        let sides = ["white", "yellow", "red", "orange", "blue", "green"];
        globalVars.isRotateAllowed = false;
        for (let i = 0; i < 20; i++) {
            rotateSide(250, true, sides[Math.floor(Math.random() * 6)]);
        }
    }
};
export const reset = () => {
    globalVars.cube.innerHTML = '';
    globalVars.pieces = [];
    globalVars.moveHistory = [];
    moveQuery = [];
    setup();
};
export const undo = () => {
    if (globalVars.isRotateAllowed) {
        let i = globalVars.moveHistory.length - 1;
        if (i >= 0) {
            globalVars.isRotateAllowed = false;
            rotateSide(750, false, globalVars.moveHistory[i].sideColor, !globalVars.moveHistory[i].isClockwise);
            globalVars.moveHistory.pop();
        }
    }
    globalVars.isRotateAllowed = true;
};
export const undoAll = () => {
    if (globalVars.isRotateAllowed) {
        if (globalVars.moveHistory.length !== 0) {
            globalVars.isRotateAllowed = false;
            for (let i = globalVars.moveHistory.length - 1; i >= 0; i--) {
                rotateSide(250, false, globalVars.moveHistory[i].sideColor, !globalVars.moveHistory[i].isClockwise);
                globalVars.moveHistory.pop();
            }
        }
    }
};
let rotateStateH = 0;
export const rotateX = (increment) => {
    rotateStateH = (rotateStateH + increment + 4) % 4;
    document.querySelector("#rubiks-cube").style.setProperty("--r-x", (rotateStateH * 90 + 45) + "deg");
};
export const rotateY = () => {
    let toggle = document.querySelector(".rotate-y .toggle");
    let state = toggle.getAttribute("state");
    if (state == "top-view") {
        toggle.setAttribute("state", "bottom-view");
        document.querySelector("#rubiks-cube").style.setProperty("--r-y", (45) + "deg");
    }
    else {
        toggle.setAttribute("state", "top-view");
        document.querySelector("#rubiks-cube").style.setProperty("--r-y", (-45) + "deg");
    }
};
export const setupEventListeners = () => {
    let controls = document.querySelector(".controls");
    controls.querySelector(".rotate-x .left").addEventListener("click", (e) => { rotateX(-1); });
    controls.querySelector(".rotate-x .right").addEventListener("click", (e) => { rotateX(1); });
    controls.querySelector(".rotate-y .toggle").addEventListener("click", (e) => { rotateY(); });
    let rotateButtons = [...controls.querySelectorAll(".rotate-buttons *")];
    rotateButtons[0].addEventListener("click", (e) => { rotateSideButton(750, true, 'white'); });
    rotateButtons[1].addEventListener("click", (e) => { rotateSideButton(750, true, 'yellow'); });
    rotateButtons[2].addEventListener("click", (e) => { rotateSideButton(750, true, 'red'); });
    rotateButtons[3].addEventListener("click", (e) => { rotateSideButton(750, true, 'white', false); });
    rotateButtons[4].addEventListener("click", (e) => { rotateSideButton(750, true, 'yellow', false); });
    rotateButtons[5].addEventListener("click", (e) => { rotateSideButton(750, true, 'red', false); });
    rotateButtons[6].addEventListener("click", (e) => { rotateSideButton(750, true, 'orange'); });
    rotateButtons[7].addEventListener("click", (e) => { rotateSideButton(750, true, 'blue'); });
    rotateButtons[8].addEventListener("click", (e) => { rotateSideButton(750, true, 'green'); });
    rotateButtons[9].addEventListener("click", (e) => { rotateSideButton(750, true, 'orange', false); });
    rotateButtons[10].addEventListener("click", (e) => { rotateSideButton(750, true, 'blue', false); });
    rotateButtons[11].addEventListener("click", (e) => { rotateSideButton(750, true, 'green', false); });
    controls.querySelector(".button.randomize").addEventListener("click", (e) => { randomizeCube(); });
    controls.querySelector(".button.reset").addEventListener("click", (e) => { reset(); });
    controls.querySelector(".button.undo").addEventListener("click", (e) => { undo(); });
    controls.querySelector(".button.undo-all").addEventListener("click", (e) => { undoAll(); });
    let algorithms = [...controls.querySelectorAll(".algorithms .algorithm")];
    for (let i = 0; i < algorithms.length; i++)
        algorithms[i].addEventListener("click", (e) => { algorithmEvent(i); });
};
