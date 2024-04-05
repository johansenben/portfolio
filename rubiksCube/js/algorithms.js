import { globalVars } from './global.js';
import { rotateSide } from './events.js';
export const doAlgorithm = (speed, front, top, steps) => {
    let sides = ["red", "blue", "orange", "green"];
    let multiplier = top === "white" ? 1 : -1;
    let frontIndex = 0; //index number from sides
    for (let i = 0; i < 4; i++) {
        if (sides[i] === front) {
            frontIndex = i;
            break;
        }
    }
    let totalSteps = steps.length;
    globalVars.isRotateAllowed = false;
    for (let i = 0; i < totalSteps; i++) {
        if (steps[i].side < 4)
            rotateSide(speed, true, sides[((frontIndex + steps[i].side) * multiplier + 4) % 4], steps[i].isClockwise);
        else if ((steps[i].side === 4 && multiplier === 1) || (steps[i].side === 5 && multiplier === -1))
            rotateSide(speed, true, "white", steps[i].isClockwise);
        else
            rotateSide(speed, true, "yellow", steps[i].isClockwise);
        //steps.shift();
    }
};
const newStep = (side, isClockwise = true) => { return { side: side, isClockwise: isClockwise }; };
const algorithms = [
    [
        newStep(1), newStep(3, false),
        newStep(0), newStep(2, false),
        newStep(4), newStep(5, false),
        newStep(1), newStep(3, false)
    ],
    [
        newStep(0), newStep(0),
        newStep(2), newStep(2),
        newStep(1), newStep(1),
        newStep(3), newStep(3),
        newStep(4), newStep(4),
        newStep(5), newStep(5)
    ],
    [
        newStep(1), newStep(1),
        newStep(3, false), newStep(5),
        newStep(0), newStep(0),
        newStep(1, false), newStep(5, false),
        newStep(1, false), newStep(3),
        newStep(4, false), newStep(5),
        newStep(1), newStep(5),
        newStep(2), newStep(2),
        newStep(1, false), newStep(4),
        newStep(5), newStep(5)
    ],
    [
        newStep(0), newStep(3),
        newStep(0), newStep(4, false),
        newStep(1), newStep(4),
        newStep(0), newStep(0),
        newStep(3), newStep(3),
        newStep(4, false), newStep(3, false),
        newStep(2), newStep(5, false),
        newStep(2, false), newStep(3),
        newStep(3), newStep(4)
    ],
    [
        newStep(4, false), newStep(3, false),
        newStep(4, false), newStep(0, false),
        newStep(1), newStep(1),
        newStep(2, false), newStep(1),
        newStep(0), newStep(4),
        newStep(2), newStep(2),
        newStep(4), newStep(2, false),
        newStep(3), newStep(4, false),
        newStep(0), newStep(4),
        newStep(1), newStep(0, false)
    ],
    [
        newStep(1), newStep(3),
        newStep(0), newStep(2),
        newStep(1), newStep(3),
        newStep(0), newStep(2),
        newStep(1), newStep(3),
        newStep(0), newStep(2)
    ],
    [
        newStep(0), newStep(0),
        newStep(2), newStep(2),
        newStep(4), newStep(5, false),
        newStep(1), newStep(1),
        newStep(3), newStep(3),
        newStep(4), newStep(5, false)
    ],
    [
        newStep(1), newStep(3),
        newStep(0), newStep(2),
        newStep(1), newStep(3),
        newStep(0), newStep(2),
        newStep(1), newStep(3),
        newStep(0), newStep(2),
        newStep(0), newStep(2),
        newStep(1), newStep(3),
        newStep(0), newStep(2),
        newStep(1), newStep(3),
        newStep(0), newStep(2),
        newStep(1), newStep(3)
    ],
    [
        newStep(1), newStep(1),
        newStep(3), newStep(3),
        newStep(4), newStep(4),
        newStep(1), newStep(1),
        newStep(3), newStep(3),
        newStep(5), newStep(5)
    ],
    [
        newStep(4), newStep(4),
        newStep(5), newStep(5),
        newStep(1), newStep(1),
        newStep(4), newStep(4),
        newStep(5), newStep(5),
        newStep(3), newStep(3)
    ],
];
export const algorithmEvent = (algorithmNum) => {
    const reverse = (algorithm) => {
        let newAlgorithm = [];
        for (let i = algorithm.length - 1; i >= 0; i--)
            newAlgorithm.push({ side: algorithm[i].side, isClockwise: !algorithm[i].isClockwise });
        return newAlgorithm;
    };
    if (algorithmNum < algorithms.length) {
        let speed = parseInt(document.querySelector(".speed-slider input").value) * 250;
        let isReverse = document.querySelector(".is-reverse-switch :checked") !== null ? true : false;
        let top = document.querySelector(".top-radio-btns").querySelector(":checked").getAttribute("radio-color");
        let front = document.querySelector(".front-radio-btns").querySelector(":checked").getAttribute("radio-color");
        if (!isReverse)
            doAlgorithm(speed, front, top, algorithms[algorithmNum]);
        else {
            doAlgorithm(speed, front, top, reverse(algorithms[algorithmNum]));
            document.querySelector(".is-reverse-switch :checked").click();
        }
    }
};
//export const solve = () => {
/*const whiteCross = () => {
    let topMiddlePieces = [19, 23, 25, 21];
    let brk = false;
    for (let i = 0; i < 4 && !brk; i++){
        if (globalVars.pieces[topMiddlePieces[i]].top == "white"){
            let sideColor = globalVars.pieces[topMiddlePieces[i]].hasSideColor();
            let sideColors = ["orange", "blue", "red", "green"];
            for (let i2 = 0; i2 < 4; i2++){
                if (sideColor === sideColors[(i + i2) % 4]){
                    brk = true;
                    break;
                }else{
                    rotateSide(750, true, "white");
                }
            }
        }
    }
}*/
/*   const whiteCross = () => {
       let correctPieces:number[] = [];

       let topMiddlePieces = [19, 23, 25, 21];
       let bottomMiddlePieces = [1, 5, 7, 3];
       let brk = false;
       while (true) {
           if (!globalVars.isTurnIntRunning){
               brk = false;
               for (let i = 0; i < 4 && !brk; i++){
                   let alreadyFound = false;
                   for (let index = 0; index < correctPieces.length; index++){
                       if (topMiddlePieces[i] === correctPieces[index]){
                           alreadyFound = true;
                           break;
                       }
                   }
                   if (alreadyFound)
                       continue;
                   if (globalVars.pieces[topMiddlePieces[i]].top == "white"){
                       let sideColor = globalVars.pieces[topMiddlePieces[i]].hasSideColor();
                       let sideColors = ["orange", "blue", "red", "green"];
                       if (sideColor === sideColors[i]){
                           correctPieces.push(topMiddlePieces[i]);
                           break;
                       }
                       rotateSide(0, true, sideColors[i]);
                       rotateSide(0, true, sideColors[i]);
                       let i2 = 0;
                       while (i2 < 4) {
                           if (sideColor === sideColors[(i + i2) % 4]){
                               brk = true;
                               break;
                           }else{
                               rotateSide(750, true, "yellow", false);
                           }
                           i2++;
                       }
                       rotateSide(0, true, sideColors[(i + i2) % 4]);
                       rotateSide(0, true, sideColors[(i + i2) % 4]);
                       correctPieces.push(topMiddlePieces[(i + i2) % 4]);
                   }
               }
               if (!brk)//if it broke out of for loop without finding a white piece
                   break;
           }
       }
   }

   whiteCross();
}*/ 
