// 回溯写法
// dfs那里是或者，然后把res return
// if那里不能直接return 
/**
 * @param {character[][]} board
 * @param {string} word
 * @return {boolean}
 */
var exist = function(board, word) {
    let row = board.length;
    let col = board[0].length;
    let hash = {};
    function dfs(i, j, k) {
        if (
            i < 0 ||
            j < 0 ||
            i >= row ||
            j >= col ||
            board[i][j] !== word[k] ||
            hash[i + "-" + j]
        ) {
            return false;
        }
        if (k === word.length - 1) {
            return true;
        }
        hash[i + "-" + j] = 1;
        let res =
            dfs(i - 1, j, k + 1) ||
            dfs(i + 1, j, k + 1) ||
            dfs(i, j - 1, k + 1) ||
            dfs(i, j + 1, k + 1);
        hash[i + "-" + j] = 0;
        return res;
    }
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {
            if (dfs(i, j, 0)) {
                return true;
            }
        }
    }
    return false;
};
