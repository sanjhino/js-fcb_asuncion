
// Variables are storage of values
let board;
let score = 0;
let rows = 4;
let columns = 4;

// Declaring variable used for touch input
let startX = 0;
let startY = 0;

let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;

function setGame(){

    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    for(let r=0; r<rows; r++){
        for(let c=0; c<columns; c++){

            let tile = document.createElement("div");

            tile.id = r.toString() + "-" + c.toString();

            let num = board[r][c];

            // UpdateTile function updates the appearance of the tile based on its number value
            updateTile(tile, num);

            document.getElementById("board").append(tile);
        }
    }

    setTwo();
    setTwo();
}

function updateTile(tile, num){

    tile.innerText = "";
    tile.classList.value = "";
    tile.classList.add("tile");

    if(num > 0){
        tile.innerText = num.toString();

        if(num <= 4096){
            tile.classList.add("x"+num.toString());
        }
        else{
            tile.classList.add("x8192");
        }
    }
}

window.onload = function(){
    setGame();
}


function handleSlide(e){
    // Displays what key in the keyboard has been pressed.
    console.log(e.code);
    
    if(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.code)){
        // Prevents the default behavior of the browser, which in this case, after arrowleft, arrowright, or any arrow keys it should not scroll. 
        e.preventDefault();

        if(e.code == "ArrowLeft" && canMoveLeft() == true){
            slideLeft();
            setTwo();
        }
        else if(e.code == "ArrowRight" && canMoveRight() == true){
            slideRight();
            setTwo();
        }
        else if(e.code == "ArrowUp" && canMoveUp() == true){
            slideUp();
            setTwo();
        }
        else if(e.code == "ArrowDown" && canMoveDown() == true){
            slideDown();
            setTwo();
        }
    }

    checkWin();

    if(hasLost() == true){
        setTimeout(() => {
            alert("Game Over! You have lost the game. Game will restart");
            restartGame();
            alert("Click any arrow key to restart")
        }, 100);
    }

    document.getElementById("score").innerText = score;


}

document.addEventListener("keydown", handleSlide);

// removes the zeroes in the board, to make the merging possible
function filterZero(row){
    return row.filter(num => num != 0);
}

// merges the tile
function slide(row){
    row =  filterZero(row);

    for(let i=0; i < row.length - 1; i++ ){
        if(row[i] == row[i+1]){
            row[i] *= 2;
            row[i+1] = 0;
            score += row[i];
        }
    }

    row = filterZero(row);
    while(row.length < columns){
        row.push(0);
    }
    return row;
}

// uses slide() function to merge the tile
function slideLeft(){
    for(let r=0; r<rows; r++){

        let row = board[r];
        let originalRow = row.slice();

        row = slide(row);
        board[r] = row;

        

        for(let c=0; c<columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);

            if(originalRow[c] !== num && num !== 0){
                tile.style.animation = "slide-from-right 0.3s";

                setTimeout(()=>{
                    tile.style.animation = "";
                }, 300);
            }
        }

    }

}


function slideRight(){
    for(let r=0; r<rows; r++){
        let row = board[r];
        let originalRow = row.slice();
        row.reverse();
        row = slide(row);
        row.reverse();
        board[r] = row;

        for(let c=0; c<columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);

            if(originalRow[c] !== num && num !== 0){
                tile.style.animation = "slide-from-left 0.3s";

                setTimeout(()=>{
                    tile.style.animation = "";
                }, 300);
            }
        }
    }
}

function slideUp(){
    for(let c=0; c<columns; c++){
        let col = [board[0][c], board[1][c], board[2][c], board[3][c]];

        let originalCol = col.slice();
        col = slide(col);

        changedIndices = [];

        for(let r=0; r<rows; r++){
            if(originalCol[r] !== col[r]){
                changedIndices.push(r)
            }
        }

        // this loop is to update the appearance of the tiles after merging
        for(let r=0; r<rows; r++){
            board[r][c] = col[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);

            if(changedIndices.includes(r) && num !== 0){
                tile.style.animation = "slide-from-bottom 0.3s";
                setTimeout(() => {
                    tile.style.animation = ""
                }, 300);
            }
        }


    }
}


function slideDown(){
    for(let c=0; c<columns; c++){
        let col = [board[0][c], board[1][c], board[2][c], board[3][c]];

        let originalCol = col.slice();

        col.reverse();
        col = slide(col);
        col.reverse();

        changedIndices = [];

        for(let r=0; r<rows; r++){
            if(originalCol[r] !== col[r]){
                changedIndices.push(r)
            }
        }
        
        // this loop is to update the appearance of the tiles after merging
        for(let r=0; r<rows; r++){
            board[r][c] = col[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);

            if(changedIndices.includes(r) && num !== 0){
                tile.style.animation = "slide-from-top 0.3s";
                setTimeout(() => {
                    tile.style.animation = ""
                }, 300);
            }
        }
    }
}


// This is to check if the board has an empty tile / vacant space
function hasEmptyTile(){
    for(let r=0; r<rows; r++){
        for(let c=0; c<columns; c++){
            if(board[r][c] == 0){
                return true;
            }
        }
    }
    return false;
}


function setTwo(){
    // if there is no empty tile / vacant space
    if(!hasEmptyTile()){
        return;
    }

    let found = false;

    while(!found){
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);

        if(board[r][c] == 0){
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2");
            found = true;
        }
    }
}


function checkWin(){
    for(let r=0; r<rows; r++){
        for(let c=0; c<columns; c++){
            if(board[r][c] === 2048 && is2048Exist == false ){
                alert("You Win! You got DekaMaster!");
                is2048Exist = true;
            }
            else if(board[r][c] === 4096 && is4096Exist == false ){
                alert("Unstoppable, even Signalman can't  stop you!");
                is4096Exist = true;
            }
            else if(board[r][c] === 8192 && is8192Exist == false ){
                alert("Victory! You got Zenkaiger! Get a life bro lmao!");
                is8192Exist = true;
            }
        }
    }
}

function hasLost(){

    for(let r=0; r<rows; r++){
        for(let c=0; c<columns; c++){

            if(board[r][c]==0){
                return false;
            }

            const currentTile = board[r][c];

            if (
                r > 0 && board[r - 1][c] === currentTile ||
                r < rows - 1 && board[r + 1][c] === currentTile ||
                c > 0 && board[r][c - 1] === currentTile ||
                c < columns - 1 && board[r][c + 1] === currentTile
            ) {
                // Found adjacent cells with the same value, user has not lost
                return false;
            }
        }
    }

    return true;
}


function restartGame(){
    for(let r=0; r<rows; r++){
        for(let c=0; c<columns; c++){
            board[r][c]=0;
        }
    }
    score = 0;
    setTwo();
}

// This will listen to when we touch as screen and assigns the x coordinates of that touch // input to the startX variable and the y coordinates to startY variable 
document.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});

//  This will check for where you touch your screen and prevents scrolling if your touch // input targets any element that includes the word tile in their class names
document.addEventListener('touchmove', (e) => {

    if(!e.target.className.includes("tile")){
        return
    }

    e.preventDefault(); // This line disables scrolling
}, { passive: false }); // Use passive: false to make preventDefault() work

// Listen for the 'touchend' event on the entire document
document.addEventListener('touchend', (e) => {
    
    // Check if the element that triggered the event has a class name containing "tile"
    if (!e.target.className.includes("tile")) {
        return; // If not, exit the function
    }
    
    // Calculate the horizontal and vertical differences between the initial touch position and the final touch position
    let diffX = startX - e.changedTouches[0].clientX;
    let diffY = startY - e.changedTouches[0].clientY;

    // Check if the horizontal swipe is greater in magnitude than the vertical swipe
    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (diffX > 0) {
            slideLeft(); // Call a function for sliding left
            setTwo(); // Call a function named "setTwo"
        } else {
            slideRight(); // Call a function for sliding right
            setTwo(); // Call a function named "setTwo"
        }
    } else {
        // Vertical swipe
        if (diffY > 0) {
            slideUp(); // Call a function for sliding up
            setTwo(); // Call a function named "setTwo"
        } else {
            slideDown(); // Call a function for sliding down
            setTwo(); // Call a function named "setTwo"
        }
    }

    document.getElementById("score").innerText = score;
        
    checkWin();

    // Call hasLost() to check for game over conditions
    if (hasLost()) {
        // Use setTimeout to delay the alert
        setTimeout(() => {
        alert("Game Over! You suck at the game. Game will restart");
        restartGame();
        alert("Click any key to restart");
        // You may want to reset the game or perform other actions when the user loses.
        }, 100); // Adjust the delay time (in milliseconds) as needed
    }
})


document.addEventListener("touchmove", (e) => {
	if(!e.target.className.includes("tile")) {
		return;
	}

	e.preventDefault(); //This line prevents the defult behavior. disables shaking
}, {passive: false});


function canMoveLeft(){
	for(let r=0; r<rows; r++){
		for(let c=0; c<columns; c++){
			if(board[r][c] !== 0){
				if(board[r][c-1] === 0 || board[r][c-1] === board[r][c]){
					return true;
				}
			}
		}
	}
	return false;
}


function canMoveRight(){
	for(let r=0; r<rows; r++){
		for(let c=0; c<columns; c++){
			if(board[r][c] !== 0){
				if(board[r][c+1] === 0 || board[r][c+1] === board[r][c]){
					return true;
				}
			}
		}
	}
	return false;
}


function canMoveUp(){
	for(let c=0; c<columns; c++){
		for(let r=1; r<rows; r++){
			if(board[r][c] !== 0){
				if(board[r-1][c] === 0 || board[r-1][c] === board[r][c]){
					return true;
				}
			}
		}
	}
	return false;
}


function canMoveDown(){
	for(let c=0; c<columns; c++){
		for(let r=0; r<rows-1; r++){
			if(board[r][c] !== 0){
				if(board[r+1][c] === 0 || board[r+1][c] === board[r][c]){
					return true;
				}
			}
		}
	}
	return false;
}
