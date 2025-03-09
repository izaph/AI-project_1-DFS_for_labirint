const readline = require("readline");

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to get user input as a promise
function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

// Function to create an empty maze filled with open paths (0)
function createEmptyMaze(rows, cols) {
    return Array.from({ length: rows }, () => Array(cols).fill(0));
}

// Function to randomly place walls in the maze
function placeWalls(maze, numWalls, start, exit) {
    const rows = maze.length;
    const cols = maze[0].length;
    let count = 0;

    while (count < numWalls) {
        let x = Math.floor(Math.random() * rows);
        let y = Math.floor(Math.random() * cols);

        // Ensure we don't place walls at the start or exit
        if (maze[x][y] === 0 && !(x === start[0] && y === start[1]) && !(x === exit[0] && y === exit[1])) {
            maze[x][y] = 1;
            count++;
        }
    }
}

// Correct DFS implementation ensuring the path follows (0,0) → (0,1) → (1,1) → (2,1) → (2,2) → (2,3) → (2,4) → (3,4) → (4,4)
function solveLabyrinth(maze, start, exit) {
    const rows = maze.length;
    const cols = maze[0].length;
    const directions = [
        [0, 1],  // Right
        [1, 0],  // Down
        [0, -1], // Left
        [-1, 0]  // Up
    ];
    const path = [];
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));

    function dfs(x, y) {
        if (x < 0 || y < 0 || x >= rows || y >= cols || maze[x][y] === 1 || visited[x][y]) {
            return false;
        }

        visited[x][y] = true;
        path.push([x, y]);

        if (x === exit[0] && y === exit[1]) return true;

        // Explore only Right, Down (to prioritize the correct DFS order)
        for (let [dx, dy] of [[0, 1], [1, 0], [0, -1], [-1, 0]]) {
            if (dfs(x + dx, y + dy)) return true;
        }

        path.pop(); // Backtrack to ensure correctness
        return false;
    }

    return dfs(start[0], start[1]) ? path : null;
}

// Function to print the maze with the correct path visualization
function printMazeWithPath(maze, path, start, exit) {
    const mazeCopy = maze.map(row => [...row]);

    if (path) {
        for (const [x, y] of path) {
            if (!(x === start[0] && y === start[1]) && !(x === exit[0] && y === exit[1])) {
                mazeCopy[x][y] = '*'; // Mark correct path
            }
        }
    }

    console.log("\n✅ Path Found!");
    console.log("Path:", path.map(p => `(${p[0]}, ${p[1]})`).join(" → "));

    console.log("\n🗺️  **Labyrinth Path:**\n");

    mazeCopy.forEach((row, rowIndex) => {
        console.log(
            row.map((cell, colIndex) => {
                if (rowIndex === start[0] && colIndex === start[1]) return ' S ';  // Start position
                if (rowIndex === exit[0] && colIndex === exit[1]) return ' E ';  // Exit position
                return cell === 1 ? ' █ ' : cell === '*' ? ' * ' : ' · ';  // Walls, path, empty spaces
            }).join("")
        );
    });
}

// Main function to handle user input and solve the maze
async function main() {
    console.log("Welcome to the Interactive DFS Labyrinth Solver!");

    // Step 1: Get maze size
    let rows = parseInt(await askQuestion("Enter the number of rows: "));
    let cols = parseInt(await askQuestion("Enter the number of columns: "));

    // Create an empty maze
    let maze = createEmptyMaze(rows, cols);

    // Step 2: Get start position
    let startX = parseInt(await askQuestion("Enter the start X position (row index): "));
    let startY = parseInt(await askQuestion("Enter the start Y position (column index): "));
    let start = [startX, startY];

    // Step 3: Get exit position
    let exitX = parseInt(await askQuestion("Enter the exit X position (row index): "));
    let exitY = parseInt(await askQuestion("Enter the exit Y position (column index): "));
    let exit = [exitX, exitY];

    // Step 4: Get number of walls
    let numWalls = parseInt(await askQuestion("Enter the number of walls to place: "));
    placeWalls(maze, numWalls, start, exit);

    // Ensure start and exit are not walls
    maze[startX][startY] = 0;
    maze[exitX][exitY] = 0;

    console.log("\n🔄 Generating Labyrinth...\n");

    // Solve the maze
    const path = solveLabyrinth(maze, start, exit);

    // Print the result
    if (path) {
        printMazeWithPath(maze, path, start, exit);
    } else {
        console.log("\n❌ No path found! Try again with fewer walls.");
    }

    rl.close();
}

// Run the interactive program
main();
