export type Difficulty = {
    easy: number;
    medium: number;
    hard: number;
};

export default class SudokuBoard {
    board: number[][];
    startingBoard: number[][];
    static _DIFICULTIES: Difficulty = {
        easy: 1,
        medium: 2,
        hard: 3,
    };

    constructor() {
        this.board = Array.from({ length: 9 }, () => Array(9).fill(0));
        this.startingBoard = [];
    }

    fillBoard(): boolean {
        const [row, col] = this.findEmpty();

        if (row === undefined || col === undefined) return true;

        const nums = Array.from({ length: 9 }, (_, i) => i + 1);
        this.shuffle(nums);

        for (const num of nums) {
            if (this.isValid(row, col, num)) {
                this.board[row][col] = num;
                if (this.fillBoard()) return true;
                this.board[row][col] = 0;
            }
        }
        return false;
    }

    findEmpty(): (number | undefined)[] {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.board[i][j] === 0) {
                    return [i, j];
                }
            }
        }
        return [undefined, undefined];
    }

    shuffle(nums: number[]) {
        for (let i = nums.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [nums[i], nums[j]] = [nums[j], nums[i]];
        }
    }

    isValid(row: number, col: number, num: number) {
        for (let i = 0; i < 9; i++) {
            if (this.board[row][i] === num) return false;
        }

        for (let i = 0; i < 9; i++) {
            if (this.board[i][col] === num) return false;
        }

        const startRow = 3 * Math.floor(row / 3);
        const startCol = 3 * Math.floor(col / 3);
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.board[startRow + i][startCol + j] === num)
                    return false;
            }
        }

        return true;
    }

    getBoard(): number[][] {
        return this.startingBoard.slice();
    }

    getFullBoard(): number[][] {
        return this.board.slice();
    }

    makeBoard(difficulty: keyof Difficulty) {
        const holes: number = 16 * SudokuBoard._DIFICULTIES[difficulty];
        let removedHoles = 0;
        this.startingBoard = this.board.map((a) => a.slice());

        while (removedHoles < holes) {
            const val = Math.floor(Math.random() * 81);
            const rowIndex = Math.floor(val / 9);
            const colIndex = val % 9;

            if (this.startingBoard[rowIndex][colIndex] == 0) continue;

            const temp = this.startingBoard[rowIndex][colIndex];

            this.startingBoard[rowIndex][colIndex] = 0;

            if (this.countSolution() != 1)
                this.startingBoard[rowIndex][colIndex] = temp;
            else removedHoles++;
        }
    }

    countSolution() {
        const [row, col] = this.findEmpty();
        if (row === undefined || col === undefined) return 1;
        let count = 0;

        for (let i = 1; i <= 9; i++) {
            if (this.isValid(row, col, i)) {
                this.startingBoard[row][col] = i;
                count += this.countSolution();
                if (count > 1) break;
                this.startingBoard[row][col] = 0;
            }
        }
        return count;
    }

    static check(playerBoard: number[][], fullBoard: number[][]): boolean {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (playerBoard[i][j] !== fullBoard[i][j]) return false;
            }
        }
        return true;
    }
}
