let squareSelected = -1, numButtonSelected = -1
let isPencil = false, isToggleMode = false, isNewGameMenu = false
let cells = Array(81).fill(0)
let mistakes = 0
let time = 0

function cellClicked(i){
    let cell = $("#cell" + i)
    if (numButtonSelected != -1){
        unselect()
        setCell(cell, i, numButtonSelected)
    }else{
        unHighlightNums()
        select(i)
        if (cell.innerHTML != '')
            highlightNums(cell.innerHTML)
    }
}
function numButtonClicked(i){
    if (squareSelected == -1){
        unHighlightNums()
        selectNumButton(i)
        highlightNums(numButtonSelected)
    }else{
        unselect()
        setCell($("#cell" + squareSelected), squareSelected, i)
    }
}

function select(i){
    unselect()
    $("#cell"+i).classList.replace("unselected","selected")
    squareSelected = i
}
function unselect(){
    if (squareSelected != -1)
        $("#cell"+squareSelected).classList.replace("selected","unselected")
    if (numButtonSelected != -1 && !isToggleMode)
        $("#button"+numButtonSelected).classList.replace("selected", "unselected")
}
function setCell(cell, i ,num){
    if (cells[i] != num){
        if (!isPencil){
            if (!cell.classList.contains("locked")){
                for (let i2 = 0; i2 < 81; i2++)
                    if (cells[i2] > 0)
                        board[i2] = cells[i2] + 10
                    else
                        board[i2] = 0
                cell.innerHTML = num
                if (!isValid(i, num, board)){
                    cell.className = "cell incorrect unselected noPencil notHighlighted"
                    cells[i] = 0
                    squareSelected = -1
                    if (!isToggleMode)
                        numButtonSelected = -1
                    setMistakes(mistakes + 1)
                    return
                }
                cells[i] = num
                if (getSolved([])){
                    cell.className = "cell correct unselected noPencil notHighlighted" 
                    let row = Math.floor(i / 9)
                    let col = i % 9
                    for (let i2 = 0; i2 < 9; i2++){
                        if ($("#cell"+(row * 9 + i2)).classList.contains("pencil"))
                            $(`#cell${row * 9 + i2}-${num}`).innerHTML = ''
                        if ($("#cell"+(i2 * 9 + col)).classList.contains("pencil"))
                            $(`#cell${i2 * 9 + col}-${num}`).innerHTML = ''
                    }
                    let x = Math.floor(col / 3) * 3
                    let y = Math.floor(row / 3) * 3
                    for (let row2 = y; row2 < y + 3; row2++)
                        for (let col2 = x; col2 < x + 3; col2++)
                            if ($("#cell"+(row2 * 9 + col2)).classList.contains("pencil"))
                                $(`#cell${row2 * 9 + col2}-${num}`).innerHTML = ''
                }else{
                    cell.className = "cell incorrect unselected noPencil notHighlighted"
                    setMistakes(mistakes + 1)
                    cells[i] = 0
                }
            }
        }else{
            if (isValid(i, num, cells)){
                cell = $("#cell"+i)
                if (cell.classList.contains("pencil")){
                    let cell2 = $(`#cell${i}-${num}`)
                    if (cell2.innerHTML == '')
                        cell2.innerHTML = num
                    else cell2.innerHTML = ''
                }else if (cell.innerHTML == ''){
                    cell.classList.replace("noPencil", "pencil")
                    for (let i2 = 1; i2 <= 9; i2++)
                        if (i2 == num)
                            cell.innerHTML += `<div id="cell${i}-${i2}">${num}</div>`
                        else 
                            cell.innerHTML += `<div id="cell${i}-${i2}"></div>`
                }
            }
        }
    }
    squareSelected = -1
    if (!isToggleMode){
        numButtonSelected = -1
        unHighlightNums()
    }else{
        unHighlightNums()
        highlightNums(numButtonSelected)
    }
}
function selectNumButton(i){
    if (numButtonSelected != -1)
        $("#button"+numButtonSelected).classList.replace("selected", "unselected")
    if (i != numButtonSelected){
        $("#button"+i).classList.replace("unselected", "selected")
        numButtonSelected = i
    }else
        numButtonSelected = -1
}
function getPossible(i, board){
    let possible = []
    for (let i2 = 1; i2 <= 9; i2++)
        if (isValid(i,i2,board))
            possible.push(i2)
    return possible
}
function getSolved(board){
    for (let i = 0; i < 81; i++)
        if (cells[i] > 0)
            board[i] = cells[i] + 10
        else
            board[i] = 0
    let i = 0, a = 0
    while (i < 81){
        if (i < 0 || a > 200000)  
            return false
        while (board[i] > 9 && i < 81)   
            i++
        for (let i2 = board[i]; i2 <= 10; i2++){
            if (i2 > 9){
                board[i] = 0
                i--
                while (board[i] > 9)
                    if (i > 0)     
                        i--
                    else            
                        return false
                break
            }else if (isValid(i, i2, board)){
                board[i] = i2
                i++
                break
            }
        }
        a++
    }
    return true
}
function isValid(i, tryValue, board){
    let row = Math.floor(i / 9)
    let col = i % 9
    for (let i2 = 0; i2 < 9; i2++){
        if ((tryValue == board[row * 9 + i2] % 10)/* && (row * 9 + i2 != i)*/)
            return false
        //console.log((row*9+i2)+' '+i)
        if ((tryValue == board[i2 * 9 + col] % 10)/* && (i2 * 9 + col != i)*/)
            return false
    }
    let x = Math.floor(col / 3) * 3
    let y = Math.floor(row / 3) * 3
    for (let row2 = y; row2 < y + 3; row2++)
        for (let col2 = x; col2 < x + 3; col2++)
            if ((tryValue == board[row2 * 9 + col2] % 10)/* && (row2 * 9 + col2 != i)*/)
                return false
    return true
}

function solve(){
    let newBoard = []
    getSolved(newBoard)
    for (let y = 0; y < 9; y++){
        for (let x = 0; x < 9; x++){
            let cell = $("#cell"+(y*9+x))
            if (newBoard[y*9+x] < 10){
                cells[y*9+x] = newBoard[y*9+x]
                cell.innerHTML = newBoard[y*9+x]
                cell.className = "cell correct unselected noPencil notHighlighted"
            }
        }
    }
}
function hint(){
    if (squareSelected != -1){
        let newBoard = []
        getSolved(newBoard)
        setCell($("#cell"+squareSelected), squareSelected, newBoard[squareSelected])
    }
}

function togglePencil(){
    if (isPencil){
        isPencil = false
        $("#pencilButton").className = "button label off"
    }else{
        isPencil = true
        $("#pencilButton").className = "button label on"
    }
}
function fastPencil(){
    unselect()
    isPencil = true
    for (let i = 0; i < 81; i++)
        for (let i2 = 1; i2 <= 9; i2++)
            setCell($("#cell"+i), i, i2)
    isPencil = false
}
function toggleMode(){
    if (isToggleMode){
        isToggleMode = false
        $("#toggleModeButton").className = "button label off"
        if (numButtonSelected != -1)
            $("#button"+numButtonSelected).classList.replace("selected", "unselected")
        unHighlightNums()
    }else{
        isToggleMode = true
        $("#toggleModeButton").className = "button label on"
        if (numButtonSelected != -1)
            $("#button"+numButtonSelected).classList.replace("selected", "unselected")
        unHighlightNums()
    }
    unselect()
    numButtonSelected = -1
    squareSelected = -1
}
function erase(){
    if (squareSelected != -1){
        let cell = $("#cell" + squareSelected)
        cell.innerHTML = ''
        cell.className = "cell unselected noPencil notHighlighted"
        cells[squareSelected] = 0
        squareSelected = -1
    }
}
function clearBoard(){
    for (let i = 0; i < 81; i++){
        let cell = $("#cell" + i)
        cell.innerHTML = ''
        cell.className = "cell unselected noPencil notHighlighted"
        cells[i] = 0
        squareSelected = -1
        if (numButtonSelected != -1 && !isToggleMode)
            $("#button"+numButtonSelected).classList.replace("selected", "unselected")
        numButtonSelected = -1
    }
    setMistakes(0)
    resetTime()
}
function newGame(numOfCells){
    if (isToggleMode)
        toggleMode()
    clearBoard()
    let i = 0
    while (i < numOfCells){
        index = Math.floor(Math.random() * 81)
        num = Math.floor(Math.random() * 9) + 1
        if (isValid(index, num, cells) && cells[index] == 0){
            cells[index] = num + 10
            if (getSolved([])){
                let cell = $("#cell" + index)
                cell.innerHTML = num
                cell.className = "cell locked unselected noPencil notHighlighted"
                i++
            }else
                cells[index] = 0
        }
    }
    if (isNewGameMenu){
        isNewGameMenu = false
        let menu = $("#newGameMenu")
        menu.className = ''
        menu.innerHTML = ''
    }
}
function newGameMenu(){
    let menu = $("#newGameMenu")
    if (isNewGameMenu){
        isNewGameMenu = false
        menu.className = ''
        menu.innerHTML = ''
    }else{
        isNewGameMenu = true
        menu.className = "showNewGameMenu"
        menu.innerHTML = `
            <div class="difficultyButton" onClick="newGame(20)">difficulty 1</div>
            <div class="difficultyButton" onClick="newGame(10)">difficulty 2</div>
        `
    }
}
function setMistakes(num){
    mistakes = num
    $("#mistakes").innerHTML = `mistakes: ${num}`
}

function highlightNums(num){
    for (let i = 0; i < 81; i++){
        if (cells[i] % 10 == num){
            let cell = $("#cell" + i)
            if (!( cell.classList.contains("selected"))){
                cell.classList.replace("notHighlighted", "highlighted")
            }
        }
    }
}
function unHighlightNums(){
    for (let i = 0; i < 81; i++){
        let cell = $("#cell" + i)
        cell.classList.replace("highlighted", "notHighlighted")
    }
}   
