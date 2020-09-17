//HTML Elements
const turnDiv = document.querySelector('.status');
const cellDivs = document.querySelectorAll('.game-cell');
const statusText = document.getElementById('status-text');
const resetButton = document.getElementById('reset-button');

//resetButton.addEventListener('click', handleResetClick);


//Variables
let playerNum = 0;

//Init Sock
const socket = io();

//Socket ON's
socket.on('player-number', num =>
{
    symbols = {0 : "X",1 : "O"}
    playerNum = parseInt(num);
    console.log(num);
    turnDiv.innerHTML = `You are ${symbols[playerNum]}`;
    if (parseInt(num) === -1)
    {
        turnDiv.innerHTML = "Room is full.";
    }
})

socket.on('player-connected-disconnected', str =>
{
    console.log(str);
    statusText.innerHTML = str;
})

socket.on('fill-cell', (cellId, playerNum) =>
{
    if(playerNum == 0)
    {
        cellDivs[cellId].classList.add('x');
    }
    else if (playerNum == 1)
    {
        cellDivs[cellId].classList.add('o');
    }
});

socket.on('highlight-cells', (cellAray, color) =>
{
    cellDivs[cellAray[0]].style.backgroundColor = color;
    cellDivs[cellAray[1]].style.backgroundColor = color;
    cellDivs[cellAray[2]].style.backgroundColor = color;
})

socket.on('clear-table', function()
{
    clearTable();
})

//Event Handlers
function handleCellClick(e)
{
    if (playerNum == 0 || playerNum == 1)
    {
        cellId = e.target.classList[1];
        socket.emit('cell-click', cellId, playerNum);
        console.log(`Clicked on ID ${cellId}`);
    }
}
/*
function handleResetClick(e)
{
    if (playerNum == 0 || playerNum == 1)
    {
        clearTable();
        socket.emit('reset-click');
        //Not working, will fix maybe one day idk probably not
    }
}
*/
//Functions
function clearTable()
{
    for (i = 0; i < cellDivs.length; i++)
    {
        cellDivs[i].classList.remove('x');
        cellDivs[i].classList.remove('o');
    }
}

//Event Adders
for (i = 0; i < cellDivs.length; i++)
{
    cellDivs[i].addEventListener('click', handleCellClick);
    cellDivs[i].classList.add(i);
}