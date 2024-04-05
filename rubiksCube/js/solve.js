import { globalVars } from './global.js';
import { rotateSide } from './events.js';
export const doAlgorithm = (front, top, steps) => {
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
        if (steps[0].side < 4)
            rotateSide(750, true, sides[((frontIndex + steps[0].side) * multiplier + 4) % 4], steps[0].isClockwise);
        else if ((steps[0].side === 4 && multiplier === 1) || (steps[0].side === 5 && multiplier === -1))
            rotateSide(750, true, "white", steps[0].isClockwise);
        else
            rotateSide(750, true, "yellow", steps[0].isClockwise);
        steps.shift();
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
