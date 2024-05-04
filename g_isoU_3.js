/* constants :) */
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var totBugs = 0;
var caughtBugs = 0;
var distanceBooeyMoved=0;

var dx = 0; // ghost initial velocity
var dy = 0;
var ghostSpeed = 2;

var ghostSize = .3; 
var bgSize = .5;

var level = 0;
var levelChangeInterval = 300; // The time interval at which opacity changes (in milliseconds)
var levelMax = 4;
var levelMin = 0;   

/* load images!*/
// GHOST
var ghostImage = createImage('./art/ghost1.png');
var booeyX, booeyY;
// Set the initial x and y coordinates inside the onload event
ghostImage.onload = function() {
    booeyX = (canvas.width / 2) - ghostSize*(ghostImage.width / 2);
    booeyY = (canvas.height*.66) - ghostSize*(ghostImage.height / 2);
};
var booeyImages = [new Image(), new Image(), new Image(), new Image()];
booeyImages[0].src = './art/ghostU1.png';
booeyImages[1].src = './art/ghostU2.png';
booeyImages[2].src = './art/ghostU3.png';
booeyImages[3].src = './art/ghostU4.png';

// BG
var bg = new Image()
bg.src = './art/isoU1-bg.png';

// bugs :o
var bugimg = createImage('./art/bug.png');
var bugHL = createImage('./art/bug-HL.png');
var bugY = createImage('./art/bug-Y.png');
var bugImg = {
    "default": bugimg, 
    "highlighted": bugHL,
    "yellow": bugY
};
bugSize = 10;


var textElement, bugCounter;
function instruction() {
    instructionContainer = document.createElement("div");
    instructionContainer.id = "instruction-Container";

    textElement = document.createElement("p");
    textElement.innerHTML = "Dang, that's a lot of cockroaches. Help Booey get rid of them all! Use the up, left, right and down arrow keys to move Booey to the bugs. Press the space bar to capture the bugs.";
    textElement.style.margin = "10px";  // Add margin to the text
    instructionContainer.appendChild(textElement);
    document.body.appendChild(instructionContainer);

    bugCounter = document.createElement("p");
    bugCounter.innerHTML = caughtBugs + "/" + totBugs + " bugs caught.";
    bugCounter.style.margin = "10px";  // Add margin to the text
    instructionContainer.appendChild(bugCounter);
    document.body.appendChild(instructionContainer);
}

var numBugs;
function initializeBugs(maxBugs, bugCoords, xmin, xmax, ymin, ymax) {
    numBugs = Math.floor(Math.random() * (maxBugs) + 1);
    let x, y, rotation;
    for (let i = 0; i < numBugs; i++) {
        x = Math.random() * (xmax - xmin) + xmin; // Random x between xmin and xmax
        y = Math.random() * (ymax - ymin) + ymin; // Random y between ymin and ymax
        rotation = Math.random() * 2 * Math.PI; // Random rotation between 0 and 2π
        bugCoords.push({"x": x, "y": y, "rotation": rotation, "on": true, "HL": false});
        
    }
    totBugs += numBugs;
}

var bugHL = createImage('./art/bug-HL.png');
var bug = createImage('./art/bug.png');

function drawBugs(img, coordsArray, booeyX, booeyY) {
    let x, y, rotation;
    for (let i = 0; i <coordsArray.length; i++) {
        x = coordsArray[i]["x"];
        y = coordsArray[i]["y"];
        rotation = coordsArray[i]["rotation"];

        ctx.save(); // Save the current state of the context
        ctx.translate(x + 5, y + 5); // Move the origin of the context to the center of the image
        ctx.rotate(rotation); // Rotate the context

        // Check if booeyX and booeyY are within fifty pixels of the bug
        if (coordsArray[i]["on"]){
            if (Math.abs(booeyX - x + 100) < 50 && Math.abs(booeyY - y + 100) < 30) {
                ctx.drawImage(bugHL, -5, -5, bugSize, bugSize); // Draw the image at the new origin
                coordsArray[i]["HL"] = true;
            } else {
                ctx.drawImage(img, -5, -5, bugSize, bugSize); // Draw the image at the new origin
            }
        }

        ctx.restore(); // Restore the context to its previous state
    }
}

levelBugCoordConstraints = [
    0,
    {"x": [75, 185], "y": [325, 400]}, 
    {"x": [210, 300], "y": [215, 240]}, 
    {"x": [290, 345], "y": [330, 380]}, 
    {"x": [410, 450], "y": [275, 370]}
]
levelBugCoords = [
    0,
    [],
    [],
    [],
    []
]

for (var i = 1; i < levelBugCoords.length; i++){
    initializeBugs(10, levelBugCoords[i], levelBugCoordConstraints[i]["x"][0], levelBugCoordConstraints[i]["x"][1], levelBugCoordConstraints[i]["y"][0], levelBugCoordConstraints[i]["y"][1]);
};

function endGame(){
    
    var endGameContainer = document.createElement("div");
    endGameContainer.id = "endGame";

    var textElement = document.createElement("p");
    textElement.innerHTML = "Thanks for cleaning up the apartment! You caught " + totBugs + " bugs.";
    textElement.style.margin = "40px";  // Add margin to the text

    document.body.appendChild(endGameContainer);
    endGameContainer.appendChild(textElement);
    

}

var currentImgArray = booeyImages
var currentImg = currentImgArray[0];
instruction();
/* draw images!*/
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // canvas
    ctx.drawImage(bg, 0, canvas.height/4 - 100, canvas.width, (bg.height/bg.width)*canvas.width); //bg

    /* GHOST */     
    ctx.drawImage(currentImg, booeyX, booeyY, ghostSize*currentImg.width, ghostSize*currentImg.height);
    
    booeyX += dx; // move ghost if needed
    booeyY += dy;
     
    /* BUGS */
    for (var i = 0; i < levelBugCoords.length; i++){
        drawBugs(bugImg["yellow"], levelBugCoords[i], booeyX, booeyY);
    }

    distanceBooeyMoved += Math.abs(dx) + Math.abs(dy);
    // If the ghost has moved more than 20 pixels, change the image
    if (distanceBooeyMoved >= 20) {
        distanceBooeyMoved = 0;
        currentImg = currentImgArray[(currentImgArray.indexOf(currentImg) + 1) % currentImgArray.length];
    } 

}
setInterval(draw, 10);

/* listen for user input!*/
var keyDownTime = null;
document.onkeydown = function(e) {
    var shiftPressed = e.shiftKey; // Check if the shift key is pressed
    switch (e.keyCode) {
        case 37:
            dx = -ghostSpeed;
            dy = 0;
            break;
        case 38:
            dy = -ghostSpeed;
            break;
        case 39:
            dx = ghostSpeed;
            dy = 0;
            break;
        case 40:
                dy = ghostSpeed;
            break;
        case 32: 
            console.log("space detected!");
            for (var i = 0; i < levelBugCoords.length; i++){
                for (var j = 0; j < levelBugCoords[i].length; j++){
                    console.log("checking level " + [level] + " for highlighted bugs.");
                    if (levelBugCoords[i][j]["HL"] && levelBugCoords[i][j]["on"]){
                        console.log("highlighted bug found!");
                        levelBugCoords[i][j]["on"] = false;
                        console.log(levelBugCoords[i]);
    
                        caughtBugs += 1;
                        bugCounter.innerHTML = caughtBugs + "/" + totBugs + " bugs caught.";
                    }
                }
                
            }
            if (caughtBugs >= totBugs) {
                endGame();
            }
        }
    };


document.onkeyup = function(e) {
    dx = 0;
    dy = 0;
    keyDownTime = null;
};

function decreaseLevel() {
    if (level <= levelMin) { // If level is already at the minimum, return without changing level
        return;
    }
    if (keyDownTime !== null && level <= levelMax) {
        level -= 1;
        setTimeout(decreaseLevel, levelChangeInterval);
    }
}

function increaseLevel() {
    if (level >= levelMax) { // If level is already at the maximum, return without changing level
        return;
    }
    if (keyDownTime !== null && level >= levelMin) {
        level += 1;
        setTimeout(increaseLevel, levelChangeInterval);
    }
}

function createImage(src) {
    var img = new Image();
    img.src = src;
    return img;
}