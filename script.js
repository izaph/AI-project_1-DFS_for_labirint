// Global variables (Ensure they are declared only once)
let maze = [];
let rows = 0, cols = 0;
let start = [], exit = [];

// DFS direction order: Up → Right → Down → Left
const directions = [
    [-1, 0],  // Up
    [0, 1],   // Right
    [1, 0],   // Down
    [0, -1]   // Left
];

// ✅ Prevent negative values
function validateInput(input) {
    if (input.value < 0) input.value = 0;
}

// ✅ Prevent start and exit from exceeding maze bounds
function validatePosition(inputId, limitId) {
    const input = document.getElementById(inputId);
    const limit = document.getElementById(limitId).value;

    if (limit) {
        const maxLimit = parseInt(limit) - 1;
        if (input.value > maxLimit) input.value = maxLimit;
    }

    if (input.value < 0) input.value = 0;
}

// ✅ Ensure wall count does not exceed available spaces
function validateWalls() {
    const rows = document.getElementById("rows").value;
    const cols = document.getElementById("cols").value;
    const walls = document.getElementById("walls");

    if (rows && cols) {
        const maxWalls = Math.floor(rows * cols * 0.4); // Max 40% of grid
        if (walls.value > maxWalls) walls.value = maxWalls;
    }

    if (walls.value < 0) walls.value = 0;
}

// ✅ Generate an empty maze
function generateMaze() {
    rows = parseInt(document.getElementById("rows").value);
    cols = parseInt(document.getElementById("cols").value);
    let startX = parseInt(document.getElementById("startX").value);
    let startY = parseInt(document.getElementById("startY").value);
    let exitX = parseInt(document.getElementById("exitX").value);
    let exitY = parseInt(document.getElementById("exitY").value);
    let wallCount = parseInt(document.getElementById("walls").value);

    if (isNaN(rows) || isNaN(cols) || rows <= 0 || cols <= 0) {
        alert("Enter valid maze size!");
        return;
    }

    start = [startX, startY];
    exit = [exitX, exitY];

    // Create empty maze
    maze = Array.from({ length: rows }, () => Array(cols).fill(0));

    // ✅ Place walls randomly
    let count = 0;
    while (count < wallCount) {
        let x = Math.floor(Math.random() * rows);
        let y = Math.floor(Math.random() * cols);
        if ((x !== startX || y !== startY) && (x !== exitX || y !== exitY) && maze[x][y] === 0) {
            maze[x][y] = 1;
            count++;
        }
    }

    renderMaze();
}

// ✅ Solve the maze using DFS
function solveMaze() {
    console.log("Solve button clicked!");

    if (!maze || maze.length === 0) {
        console.error("Maze is not generated!");
        alert("Please generate a maze first!");
        return;
    }

    console.log("Starting DFS Algorithm...");

    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    let correctPath = [];
    let foundPath = false; // Track if we reached the exit

    function dfs(x, y, path) {
        if (x < 0 || y < 0 || x >= rows || y >= cols || maze[x][y] === 1 || visited[x][y] || foundPath) {
            return false;
        }

        visited[x][y] = true;
        path.push([x, y]);

        if (x === exit[0] && y === exit[1]) {
            correctPath = [...path]; // Store only the final path
            foundPath = true; // Stop searching further
            return true;
        }

        // Explore directions in Up → Right → Down → Left order
        for (let [dx, dy] of directions) {
            if (dfs(x + dx, y + dy, path)) return true;
        }

        path.pop();  // Remove incorrect paths (backtracking)
        return false;
    }

    dfs(start[0], start[1], []);

    if (correctPath.length > 0) {
        console.log("DFS Completed Successfully");
        drawPath(correctPath);  // ✅ Draw only the correct path
        displayPath(correctPath); // ✅ Display path in the UI
    } else {
        console.error("No path found!");
        alert("No valid path found!");
    }
}

function displayPath(path) {
    const pathText = path.map(([x, y]) => `(${x},${y})`).join(" → "); // Format path
    document.getElementById("path-output").innerHTML = `<strong>Path found:</strong> ${pathText}`;
}



// ✅ Render the Maze
function renderMaze() {
    const mazeContainer = document.getElementById("maze-container");
    mazeContainer.innerHTML = "";  // Clear previous maze

    mazeContainer.style.gridTemplateColumns = `repeat(${cols}, 30px)`;
    mazeContainer.style.gridTemplateRows = `repeat(${rows}, 30px)`;

    for (let x = 0; x < rows; x++) {
        for (let y = 0; y < cols; y++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");

            if (maze[x][y] === 1) {
                cell.classList.add("wall");  // Walls
            } else if (x === start[0] && y === start[1]) {
                cell.classList.add("start");
                cell.textContent = "S";  // Start point
            } else if (x === exit[0] && y === exit[1]) {
                cell.classList.add("exit");
                cell.textContent = "E";  // Exit point
            } else {
                cell.classList.add("empty");
            }

            mazeContainer.appendChild(cell);
        }
    }
}

// ✅ Highlight the DFS path
function drawPath(path) {
    console.log("Drawing correct path:", path);  // Debugging log

    const cells = document.querySelectorAll(".cell");

    // ✅ Reset all non-wall cells before drawing the path
    cells.forEach(cell => {
        if (!cell.classList.contains("wall") && !cell.classList.contains("start") && !cell.classList.contains("exit")) {
            cell.classList.remove("path");
            cell.style.backgroundColor = "white";  // Reset empty cells
        }
    });

    // ✅ Highlight only the correct path
    path.forEach(([x, y]) => {
        const index = x * cols + y;
        if (cells[index] && !cells[index].classList.contains("start") && !cells[index].classList.contains("exit")) {
            cells[index].classList.add("path");
            cells[index].style.backgroundColor = "green";  // ✅ Highlight only the correct path
        }
    });
}
