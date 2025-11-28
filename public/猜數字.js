//宣告:從html找
const guessSubmit = document.querySelector(".guessSubmit");//btn
const guessField = document.querySelector(".guessField");//no.
const result = document.querySelector(".result");
const count = document.querySelector(".count");
const guesses = document.querySelector(".guesses");
const restartBtn = document.querySelector(".restartBtn");

let countNum =0;
let randomNumber = Math.floor(Math.random()*100);
console.log("觀察隨機的數字：", randomNumber);

//主程式
function checkGuess() {
    countNum++; //++=+1
    count.textContent = "猜測次數：" +countNum ;
    const userGuess = Number(guessField.value);  //取得欄位值，並轉為數字
    // guessField.focus();       //游標焦點預設在輸入欄位裡

    //猜測結果
    if  (  userGuess === randomNumber ) {
        result.textContent = "猜測結果：Congratulations!" ;
    }
    else if ( userGuess  < randomNumber ) {
        result.textContent = "猜測結果：數字太小!" ;
    }
    else if ( userGuess  >  randomNumber ) {
        result.textContent = "猜測結果：數字太大!";
    }
    guesses.textContent += userGuess + " ";
    
    //偵測猜測數字>10 → 結束遊戲
    if (countNum === 10){
    result.textContent += "遊戲結束";
    result.style.backgroundColor="red";
    alert("遊戲結束");
    setGameOver();
}
}
guessSubmit.addEventListener("click", checkGuess);

// 遊戲結束
function setGameOver() {
    guessField.disabled = true; //停止輸入功能
    guessSubmit.disabled = true;    //停止按鈕功能
}
// 初始化遊戲
function initGame() {
    countNum =0;
    randomNumber = Math.floor(Math.random()*100);
    guessField.disabled = false;
    guessSubmit.disabled = false;
    result.textContent = "猜測結果：";
    result.style.backgroundColor="";
    guesses.textContent ="猜測歷程：";
}
restartBtn.addEventListener("click", initGame);