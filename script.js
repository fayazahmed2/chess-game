document.addEventListener("DOMContentLoaded", function() {
    const board = document.getElementById("board");
    let selectedPiece = null;
    let currentTurn = "white";

    // Chess Unicode symbols
    const pieceSymbols = {
        p: "♟", r: "♜", n: "♞", b: "♝", q: "♛", k: "♚",
        P: "♙", R: "♖", N: "♘", B: "♗", Q: "♕", K: "♔"
    };

    // Initial chess board setup
    const initialBoard = [
        ["r", "n", "b", "q", "k", "b", "n", "r"],
        ["p", "p", "p", "p", "p", "p", "p", "p"],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["P", "P", "P", "P", "P", "P", "P", "P"],
        ["R", "N", "B", "Q", "K", "B", "N", "R"]
    ];

    // Create board
    function createBoard() {
        board.innerHTML = ""; // Clear board
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement("div");
                square.classList.add("square", (row + col) % 2 === 0 ? "light" : "dark");
                square.dataset.row = row;
                square.dataset.col = col;

                if (initialBoard[row][col]) {
                    const piece = document.createElement("span");
                    piece.textContent = pieceSymbols[initialBoard[row][col]];
                    piece.classList.add("piece", initialBoard[row][col] === initialBoard[row][col].toUpperCase() ? "white" : "black");
                    piece.dataset.piece = initialBoard[row][col];
                    piece.dataset.row = row;
                    piece.dataset.col = col;
                    piece.addEventListener("click", selectPiece);
                    square.appendChild(piece);
                }

                square.addEventListener("click", movePiece);
                board.appendChild(square);
            }
        }
    }

    // Select a piece
    function selectPiece(event) {
        const piece = event.target;

        if ((currentTurn === "white" && piece.classList.contains("black")) || 
            (currentTurn === "black" && piece.classList.contains("white"))) {
            console.log("Not your turn!");
            return;
        }

        if (selectedPiece) {
            selectedPiece.classList.remove("selected");
        }
        selectedPiece = piece;
        selectedPiece.classList.add("selected");
        console.log("Selected piece:", piece.textContent);
    }

    // Move a piece
    function movePiece(event) {
        if (!selectedPiece) return;

        const targetSquare = event.target;
        const parentSquare = targetSquare.classList.contains("square") ? targetSquare : targetSquare.parentElement;

        const oldRow = parseInt(selectedPiece.dataset.row);
        const oldCol = parseInt(selectedPiece.dataset.col);
        const newRow = parseInt(parentSquare.dataset.row);
        const newCol = parseInt(parentSquare.dataset.col);

        // Prevent moving onto own piece
        if (parentSquare.firstChild && parentSquare.firstChild.classList.contains(currentTurn)) {
            console.log("Invalid move: Cannot capture your own piece.");
            return;
        }

        // Move the piece
        parentSquare.innerHTML = "";
        parentSquare.appendChild(selectedPiece);
        selectedPiece.dataset.row = newRow;
        selectedPiece.dataset.col = newCol;
        selectedPiece.classList.remove("selected");

        // Update board state
        initialBoard[oldRow][oldCol] = "";
        initialBoard[newRow][newCol] = selectedPiece.dataset.piece;

        // Switch turns
        currentTurn = currentTurn === "white" ? "black" : "white";
        document.getElementById("turn-indicator").textContent = `Turn: ${currentTurn.charAt(0).toUpperCase() + currentTurn.slice(1)}`;

        selectedPiece = null;
    }

    // Initialize board
    createBoard();
});
