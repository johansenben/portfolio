let board = $("#board")
for (let y = 0; y < 9; y++){
    if (y % 3 == 0){
        for (let i = 0; i < 9; i++){
            if (i % 3 == 0)
                board.innerHTML += `<div class="line"></div>`
            board.innerHTML += `<div class="line"></div>`
        }
        board.innerHTML += `<div class="line"></div>`
    }
    for (let x = 0; x < 9; x++){
        if (x % 3 == 0)
            board.innerHTML += `<div class="line"></div>`
        board.innerHTML += `<div class="cell unselected noPencil notHighlighted" id=cell${y*9+x} onclick="cellClicked(${y*9+x})"></div>`
    }
    board.innerHTML += `<div class="line"></div>`
}
for (let i = 0; i < 9; i++){
    if (i % 3 == 0)
        board.innerHTML += `<div class="line"></div>`
    board.innerHTML += `<div class="line"></div>`
}
board.innerHTML += `<div class="line"></div>`

let numButtons = $("#numberButtons")
for (let i = 1; i <= 9; i++){
    if ((i - 1) % 3 == 0)
        numButtons.innerHTML += "<div></div>"
    numButtons.innerHTML += `<div class="numberButton unselected" id="button${i}" onclick="numButtonClicked(${i})">${i}</div>`
}
document.addEventListener('keydown', (event) => {
    try{
        let num = parseInt(event.key) 
        if (num > 0 && num <= 9)
            numButtonClicked(num)
    }catch{}
}, false)

let timer = setInterval(() => timeInterval(), 1000)
function timeInterval(){
    time++
    $("#timer").innerHTML = `${numAtLeast2Digits(parseInt(time / 60))}:${numAtLeast2Digits(time % 60)}`
}
function numAtLeast2Digits(num){
    return num > 9 ? num : '0' + num
}
function resetTime(){
    time = 0
    clearInterval(timer)
    timer = setInterval(() => timeInterval(), 1000)
    $("#timer").innerHTML = `${numAtLeast2Digits(parseInt(time / 60))}:${numAtLeast2Digits(time % 60)}`
}

function $(selector){
    return document.querySelector(selector)
}