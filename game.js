const { promisify } = require('util')
const sleep = promisify(setTimeout)

function Game()
{
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
      ];

    let filledX = [];
    let filledO = [];

    let xTurn = true;
    var gameLive = true;

    this.start = function()
    {
        console.log("Game started!");
    }

    end = function()
    {
        console.log("Game ended, clear table!");
        filledX = [];
        filledO = [];
        xTurn = true;
    }

    function checkForWinner()
    {
        let winningCells = [];
        winningCombinations.forEach(winningCombos => 
        {
            let cell1 = winningCombos[0];
            let cell2 = winningCombos[1];
            let cell3 = winningCombos[2];
            if (filledX.includes(cell1) && filledX.includes(cell2) && filledX.includes(cell3))
            {
                console.log('x won');
                gameLive = false;
                winningCells = [cell1, cell2, cell3];
            }
            else if (filledO.includes(cell1) && filledO.includes(cell2) && filledO.includes(cell3))
            {
                console.log('o won');
                gameLive = false;
                winningCells = [cell1, cell2, cell3];
            }
        })
        return winningCells;
    }

    module.exports = function(io)
    {
        io.on('connection', socket =>
        {
            //PlayerNum (0 = X, 1 = O)
            socket.on('cell-click', (cellId, playerNum) =>
            {
                if (filledX.includes(cellId) || filledO.includes(cellId))
                    return;

                if (playerNum < 0 || playerNum > 1)
                    return;

                // If Player is X and the cell is empty
                if (playerNum === 0 && xTurn && !filledX.includes(cellId) && !filledO.includes(cellId))
                {
                    filledX.push(parseInt(cellId));
                    xTurn = false;
                    io.emit('fill-cell', cellId, playerNum);
                }
                // If Player is O and the cell is empty
                else if (playerNum === 1 && !xTurn && !filledX.includes(cellId) && !filledO.includes(cellId))
                {
                    filledO.push(parseInt(cellId));
                    xTurn = true;
                    io.emit('fill-cell', cellId, playerNum);
                }
                console.log(filledX, filledO);
                checkForWinner()
                if (!gameLive)
                {
                    //Hightlight cells and pause for 2 seconds
                    let array = checkForWinner();
                    io.emit('highlight-cells', array, "#e6496b");
                    sleep(1000).then(() => 
                    {
                        io.emit('clear-table');
                        io.emit('highlight-cells', array, "#ea728c");
                    })
                    console.log('test');
                    end();
                    gameLive = true;
                }

                socket.on('disconnect', function()
                {
                    if (playerNum == 1 || playerNum == 0)
                    {
                        end();
                        io.emit('clear-table');
                    }
                })
            });
        })
    }
}

module.exports = Game;