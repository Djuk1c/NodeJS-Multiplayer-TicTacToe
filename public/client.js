//HTML Elements
const turnDiv = document.querySelector('.status');
const cellDivs = document.querySelectorAll('.game-cell');
const statusText = document.getElementById('status-text');

//Variables
let playerNum = 0;

//Init Sock
const socket = io();

//Socket ON's
socket.on('player-number', num =>
{
    symbols = {0 : "X",1 : "O"}
    if (num === -1)
    {
        turnDiv.innerHTML = "Table is full.";
    }
    else
    {
        playerNum = parseInt(num);
    }
    turnDiv.innerHTML = `You are ${symbols[playerNum]}`;
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

socket.on('clear-table', function()
{
    clearTable();
})

//Event Handlers
function handleCellClick(e)
{
    cellId = e.target.classList[1];
    socket.emit('cell-click', cellId, playerNum);
    console.log(`Clicked on ID ${cellId}`);
}

//Functions
function clearTable()
{
    for (i = 0; i < cellDivs.length; i++)
    {
        cellDivs[i].classList.remove('x');
        cellDivs[i].classList.remove('o');
    }
}

for (i = 0; i < cellDivs.length; i++)
{
    cellDivs[i].addEventListener('click', handleCellClick)
    cellDivs[i].classList.add(i);
}