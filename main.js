var Game = function(startButton) {
	this.initialScreenSize = window.innerHeight;
	startButton.style.display = 'none';
	this.input = document.createElement('textarea');
	this.canvas = document.createElement('canvas');
	this.ctx = this.canvas.getContext('2d');
	this.nextBtn = document.querySelector('.next');
	this.endBtn = document.querySelector('.finish');
	this.turns = [];
	this.inputArea = document.getElementById('user-input');
	this.displayArea = document.getElementById('display-area');
	this.displayArea.innerHTML = '';
	this.nextBtn.style.display = 'inline';
	this.nextClick = this.nextClick.bind(this);
	this.nextBtn.addEventListener('click', this.nextClick);
	this.endGame = this.endGame.bind(this);
	this.endBtn.style.display = 'inline';
	this.endBtn.addEventListener('click', this.endGame);
	this.startNewTurn();
}

Game.prototype.nextClick = function(e) {
	e.preventDefault();
	this.recordValue();
	this.startNewTurn();
}
Game.prototype.recordValue = function() {
	if ((this.turns.length-1) % 2) {
		var dataURL = this.canvas.toDataURL()
		this.currentTurn.setValue(dataURL);
	} else {
		this.currentTurn.setValue(this.input.value);
	}
}
Game.prototype.startNewTurn = function() {
	this.input.value = '';
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	this.currentTurn = new Turn(this.turns.length, this);
	this.turns.push(this.currentTurn);
	return this.currentTurn;
}
Game.prototype.showPreviousUserInput = function() {
	this.displayArea.innerHTML = '';
	var lastTurn = this.turns[this.turns.length-1];
	this.displayArea.appendChild(lastTurn.el);
}
Game.prototype.endGame = function(e) {
	e.preventDefault();
	this.recordValue();
	document.querySelector('.start').style.display = 'inline';
	this.nextBtn.style.display = 'none';
	this.nextBtn.removeEventListener('click', this.nextClick);
	this.endBtn.style.display = 'none';
	this.endBtn.removeEventListener('click', this.endGame);
	this.displayArea.classList.add('finished')
	this.displayEndOfGame();
}
Game.prototype.displayEndOfGame = function() {
	this.displayArea.innerHTML = '';
	this.inputArea.innerHTML = '';
	this.turns.forEach(turn => {
		this.displayArea.appendChild(turn.el);
	})
}


Game.prototype.setUpCanvas = function(ctx) {
	function move(e) {
		e.preventDefault();
		var x = e.offsetX;
		var y = e.offsetY;
		if (e.type === 'touchmove') {
			x = e.targetTouches[0].clientX - e.target.offsetLeft;
			y = e.targetTouches[0].clientY - e.target.offsetTop;
		}
		ctx.lineTo(x, y);
		ctx.stroke();
	}
	function start(e) {
		e.preventDefault();
		ctx.strokeStyle = "#1C2C34";
		ctx.lineJoin = "round";
		ctx.lineWidth = 2;
		if (this.width !== this.clientWidth || this.height !== this.clientHeight) {
			this.width = this.clientWidth;
			this.height = this.clientHeight;
		}
		var x = e.offsetX;
		var y = e.offsetY;
		if (e.type === 'touchstart') {
			x = e.targetTouches[0].clientX - e.target.offsetLeft;
			y = e.targetTouches[0].clientY - e.target.offsetTop;
		}
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.canvas.addEventListener('mousemove', move);
		ctx.canvas.addEventListener('touchmove', move);
	}
	function stop(e) {
		ctx.canvas.removeEventListener('mousemove', move);
		ctx.canvas.removeEventListener('touchmove', move);
		ctx.closePath();
	}
	ctx.canvas.addEventListener('mousedown', start);
	ctx.canvas.addEventListener('mouseup', stop);
	ctx.canvas.addEventListener('mouseleave', stop);
	ctx.canvas.addEventListener('touchstart', start);
	ctx.canvas.addEventListener('touchend', stop);
}

var Turn = function(n, game) {
	game.inputArea.innerHTML = '';
	if (n % 2) {
		this.type = 'img';
		this.el = document.createElement('img');
		game.inputArea.appendChild(game.canvas);
		game.setUpCanvas(game.ctx)
	} else {
		this.type = 'h2';
		this.el = document.createElement('h2');
		game.input.placeholder = n === 0 ?
			'Write any sentence you like!' :
			'Write a sentence that goes with the above picture'
		game.inputArea.appendChild(game.input);
	}
	if (n !== 0) {
		game.showPreviousUserInput();
	}
}

Turn.prototype.setValue = function(val) {
	this.value = val;
	if (this.type === 'h2') {
		this.el.innerHTML = val;
	} else {
		this.el.src = val;
	}
}

var game;



document.querySelector('input').addEventListener('click', function(e) {
	e.preventDefault();
	game = new Game(this);
	window.addEventListener('resize', function(e) {
		var shiftY = game.initialScreenSize - e.target.innerHeight
		console.log(shiftY);
		if (shiftY > 0 && game.displayArea.innerHTML !== '') {
			document.body.style.height = 'calc(100vh + ' + shiftY + 'px)'
			document.body.style.overflowY = 'scroll'
			document.body.style.transform = 'translateY(-'+shiftY+'px)'
		} else {
			document.body.style.height = '100vh'
			document.body.style.transform = 'none'
		}
	})
})
