// --- TIMER ---
const timer = document.getElementById('timer');
let min = 0;
let sec = 0;
let finalTime;

const count = function() {
	sec++;

	if (sec >= 60) {
		sec = 0;
		min++;
	}

	timer.textContent = (min ? (min > 9 ? min : '0' + min) : '00') + ':' + (sec ? (sec > 9 ? sec : '0' + sec) : '00');
};

const countTime = function() {
	time = setInterval(count, 1000);
};

const stopTime = function() {
	clearInterval(time);
	finalTime = timer.textContent;
	min = 0;
	sec = 0;
};

// --- GAME MECHANICS ---
/**
Deal Cards Randomly
1. Create a fragment
2. Create an array of needed class names for the cards (Font Awesome Icons)
3. Loop through the icons array to create randomly dealt set of cards
- find random index number
- create a div element (the card) and a span element (the icon)
- store the future icon classes (use the index to assign random one from the array)
- assign needed classes to div and span
- append span to div (to create complete card)
- append div to the fragment
- splice the array on current index becuase this "card" has now been used
4. Append the fragment with randomized cards to the existing DOM
5. Reset counters
*/

const game = document.querySelector('.game');
let moves = 0;
let openedCards = 0;
let matches = 0;

const dealCards = function() {
	game.innerHTML = '';
	const session = document.createDocumentFragment();
	const icons = [
		'img/1.png',
		'img/1.png',
		'img/2.png',
		'img/2.png',
		'img/3.png',
		'img/3.png',
		'img/4.png',
		'img/4.png',
		'img/5.png',
		'img/5.png',
		'img/6.png',
		'img/6.png',
		'img/7.png',
		'img/7.png',
		'img/8.png',
		'img/8.png'
	];
	const iconCount = icons.length;
	
	for (let i=iconCount; i > 0; i--) {
		const index = Math.floor(Math.random() * i);
		const el = document.createElement('div');
		const icon = document.createElement('img');
		el.className = 'card';
		icon.className ='icon closed';
		icon.setAttribute('src', icons[index]);
		el.appendChild(icon);
		session.appendChild(el);
		icons.splice(index, 1);
	}

	game.appendChild(session);
	moves = 0;
	openedCards = 0;
	matches = 0;
	countMoves();
	checkStars();
	countTime();
};

// Update Move Counter
const moveCount = document.querySelector('.moves');

const countMoves = function() {
	if (moves === 1) {
		moveCount.textContent = moves + ' move';
	} else {
		moveCount.textContent = moves + ' moves';
	}
};

// Uodate Star Score
const starTwo = document.querySelector('.two');
const starThree = document.querySelector('.three');

const checkStars = function() {
	if (moves === 0) {
		starTwo.classList.remove('away');
		starTwo.classList.add('here');
		starThree.classList.remove('away');
		starThree.classList.add('here');
	} else if (moves === 14) {
		starThree.classList.remove('here');
		starThree.classList.add('away');
	} else if (moves === 20) {
		starTwo.classList.remove('here');
		starTwo.classList.add('away');
	}
};

// Play a Card
let first;
let second;

const playCard = function(target) {
	if (openedCards === 0) {
		openedCards++;
		first = target.firstChild;
		first.classList.remove('closed');
		first.classList.add('open');
		first.parentElement.classList.add('open');
	} else if (openedCards === 1) {
		openedCards++;
		second = target.firstChild;
		second.classList.remove('closed');
		second.classList.add('open');
		second.parentElement.classList.add('open');

		setTimeout(function evaluate() {
			if (first.getAttribute('src') === second.getAttribute('src')) {
				first.classList.remove('open');
				first.classList.add('match');
				second.classList.remove('open');
				second.classList.add('match');
				openedCards = 0;
				moves++;
				countMoves();
				checkStars();
				matches++;

				if (matches === 8) {
					stopTime();
					giveGrats();
					document.querySelector('.cg-screen').classList.add('show');
				}
			} else {
				first.classList.remove('open');
				first.classList.add('closed');
				first.parentElement.classList.remove('open');
				second.classList.remove('open');
				second.classList.add('closed');
				second.parentElement.classList.remove('open');
				openedCards = 0;
				moves++;
				countMoves();
				checkStars();
			}
		}, 1000);
	}
};

// Update the congrats board
const cg = document.querySelector('.gratulation');
const cgStats = document.querySelector('.stats');

const giveGrats = function() {
	if (starThree.classList.contains('here')) {	
		cgStats.textContent = moves + ' moves | ★★★ | ' + finalTime;
		cg.textContent = 'Dear Heavens and Hells! You are great at this and I bet there is an amazing future waiting for you. Still, you can try again just to be sure it was not a mistake.';
	} else if (starTwo.classList.contains('here') && starThree.classList.contains('away')) {
		cgStats.textContent = moves + ' moves | ★★ | ' + finalTime;
		cg.textContent = 'Getting close! Add just a pinch of prior meditation, maybe some multivitamin, and play more to see your concentration powers skyrocketing.';	
	} else if (starTwo.classList.contains('away')) {
		cgStats.textContent = moves + ' moves | ★ | ' + finalTime;
		cg.textContent = 'No worries, it is not lost yet! Give it a round of positive affirmations, work out to start the fires, and try again!';
		
	}
};

// --- LISTENERS ---
// Start new game from info box 
document.querySelector('#start').addEventListener('click', function() {
	document.querySelector('.info-screen').classList.remove('show');
	dealCards();
});

// Turn the cards by clicking them
const openCount = document.getElementsByClassName('open').length;

document.querySelector('.game').addEventListener('click', function(evt) {
	if (openCount >= 2) {
		return false;
	} else {
		if (evt.target.className === 'card') {
			playCard(evt.target);
		}
	}
});

// Start new game by clicking restart
document.querySelector('.restart').addEventListener('click', function() {
	stopTime();
	dealCards();
});

// Start new game from congratulations box
document.querySelector('#start-again').addEventListener('click', function() {
		document.querySelector('.cg-screen').classList.remove('show');
		dealCards();
});