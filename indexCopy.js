const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const app = express();

app.use(bodyparser.json());
app.use(cors());
function valid(board, k, i, j){
    for(let row=0;row<9;row++){
        if(board[row][j]==k && row!=i)
        return false;
    }
    for(let col=0;col<9;col++){
        if(board[i][col]==k && col!=j)
        return false;
    }
    let row=Math.floor(i/3)+1;
    let col=Math.floor(j/3)+1;
    for(let r=row*3-3;r<row*3;r++){
        for(let c=col*3-3;c<col*3;c++){
            if(board[r][c]==k && r!=i && c!=j)
            return false;
        }
    }
    return true;
}
function solve(board){
    for(let i=0;i<9;i++){
        for(let j=0;j<9;j++){
            if(board[i][j]=='.'){
                for(let k='1';k<='9';k++){
                    if(valid(board,k,i,j)){
                        board[i][j]=k;
                        if(solve(board))
                        return true;
                    }
                }
                board[i][j]='.';
                return false;
            }
        }
    }
    return true;
}
function validate(req, res, next){
    const board = req.body.grid;
    const set = new Set();
    let c=0;
    for(let i=0;i<9;i++){
        for(let j=0;j<9;j++){
            if(board[i][j]!='.'){
                let k="";
                k="("+board[i][j]+")";
                set.add(i+k);
                set.add(k+j);
                set.add(Math.floor(i/3)+k+Math.floor(j/3));
                c+=3;
            }
        }
    }
    if(c!=set.size)
    res.send("false"); 
    next();
}
app.post("/solve",validate, (req,res)=>{
    const grid = req.body.grid;
    if(solve(grid)){
        res.json({grid});   
    }
});

app.post("/validate", validate, (req,res)=>{
    res.send("true");   
});
app.listen(9999);

