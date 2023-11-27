function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
        rectangle2.position.x &&
        rectangle1.attackBox.position.x <=
        rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
        rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
}

function determineWinner({ player1, player2 }) {
    let messageElement = document.querySelector(".message");
    messageElement.style.display = "flex";
    if (player1.health === player2.health) {
        messageElement.innerHTML = "Draw";
    } else if (player1.health > player2.health) {
        messageElement.innerHTML = "Player 1 Wins";
    } else if (player2.health > player1.health) {
        messageElement.innerHTML = "Player 2 Wins";
    }
    clearTimeout(timerId);
}

function decreaseTimer() {
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000);
        timer--;
        document.querySelector(".timer").innerHTML = timer;
    } else {
        determineWinner({ player1, player2, timerId });
    }
}
