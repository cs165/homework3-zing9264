// TODO(you): Modify the class in whatever ways necessary to implement
// the flashcard app behavior.
//
// You may need to do things such as:
// - Changing the constructor parameters
// - Adding methods
// - Adding additional fields

class Flashcard {
    constructor(containerElement, stage) {
        this.containerElement = containerElement;

        this.originX = null;
        this.originY = null;
        this.offsetX = 0;
        this.offsetY = 0;
        this.dragStarted = false;
        this.isAnswer = false;
        this.deltaX = 0;
        this.deltaY = 0

        this.stage = stage;
        this.wordcount = 0;
        this.max_wordcount = Object.keys(FLASHCARD_DECKS[stage].words).length;
        this.rightval = 0;
        this.wrongval = 0;
        this.plus = 'null';
        this.stack=[];
        this.stacktmp=[];
        this.stackptr=0;


        for(var i=0;i< this.max_wordcount;i++){
            this.stack.push(i);
        }

        this.onDragStart = this.onDragStart.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.onDragMove = this.onDragMove.bind(this);
        this._flipCard = this._flipCard.bind(this);
        this._CreateNewCard = this._CreateNewCard.bind(this);
        this._Continued=this._Continued.bind(this);

        this._CreateNewCard();

        document.addEventListener('Continue',this._Continued);

    }

    // Creates the DOM object representing a flashcard with the given
    // |frontText| and |backText| strings to display on the front and
    // back of the card. Returns a reference to root of this DOM
    // snippet. Does not attach this to the page.
    //
    // More specifically, this creates the following HTML snippet in JS
    // as a DOM object:
    // <div class="flashcard-box show-word">
    //   <div class="flashcard word">frontText</div>
    //   <div class="flashcard definition">backText</div>
    // </div>
    // and returns a reference to the root of that snippet, i.e. the
    // <div class="flashcard-box">

    _createFlashcardDOM(frontText, backText) {
        const cardContainer = document.createElement('div');
        cardContainer.classList.add('flashcard-box');
        cardContainer.classList.add('show-word');

        const wordSide = document.createElement('div');
        wordSide.classList.add('flashcard');
        wordSide.classList.add('word');
        wordSide.textContent = frontText;

        const definitionSide = document.createElement('div');
        definitionSide.classList.add('flashcard');
        definitionSide.classList.add('definition');
        definitionSide.textContent = backText;

        cardContainer.appendChild(wordSide);
        cardContainer.appendChild(definitionSide);
        return cardContainer;
    }

    _flipCard() {
        if (this.deltaX === 0 && this.deltaY === 0) {
            this.flashcardElement.classList.toggle('show-word');
        }
    }


    onDragStart(event) {
        this.originX = event.clientX;
        this.originY = event.clientY;
        this.dragStarted = true;
        this.isAnswer = false;
        event.currentTarget.setPointerCapture(event.pointerId);
        event.currentTarget.style.transitionDuration = '0s';
        this.plus = 'null';
    }

    onDragMove(event) {
        if (!this.dragStarted) {
            return;
        }
        event.preventDefault();
        this.deltaX = event.clientX - this.originX;
        this.deltaY = event.clientY - this.originY;
        const translateX = this.offsetX + this.deltaX;
        const translateY = this.offsetY + this.deltaY;
        event.currentTarget.style.transform = 'translate(' + translateX + 'px, ' + translateY + 'px)';
        event.currentTarget.style.transform += 'rotate(' + this.deltaX * 0.2 + 'deg)';

        console.log(this.deltaX);

        if (this.deltaX >= 150 || this.deltaX <= -150) {

            if (this.isAnswer === false) {
                if (this.deltaX >= 150) {
                    this.rightval++;
                    this.plus = 'right';
                    let element = document.querySelector('.status .correct');
                    element.textContent = this.rightval + ' ';
                }
                else if (this.deltaX <= -150) {
                    this.wrongval++;
                    this.plus = 'wrong';
                    let element = document.querySelector('.status  .incorrect');
                    element.textContent = this.wrongval + ' ';
                }
            }

            this.isAnswer = true;
            document.body.style.backgroundColor = '#97b7b7';
        }
        else if (this.deltaX < 150 || this.deltaX > -150) {
            if (this.isAnswer === true) {
                if( this.plus === 'right'){
                    this.rightval--;
                    this.plus = 'null';
                    let element = document.querySelector('.status  .correct');
                    element.textContent = this.rightval + ' ';
                }
                else if( this.plus === 'wrong'){
                    this.wrongval--;
                    this.plus = 'null';
                    let element = document.querySelector('.status  .incorrect');
                    element.textContent = this.wrongval + ' ';
                }
            }

            this.isAnswer = false;
            document.body.style.backgroundColor = '#d0e6df';
        }
    }

    onDragEnd(event) {
        this.dragStarted = false;
        if (this.isAnswer) {
            document.body.style.backgroundColor = '#d0e6df'
            this.containerElement.removeChild(this.flashcardElement);

            if(this.plus==='wrong'){
                this.stacktmp.push(this.stack[this.stackptr]);
            }
            this.stackptr++;


            if (this.wordcount < this.max_wordcount) {
                this._CreateNewCard();
            }
            else {
                let popresult = new CustomEvent('popresult',{ 'detail': {
                        rightcount: this.rightval,
                        wrongcount: this.wrongval
                    } });
                this.stack=this.stacktmp.slice();
                console.log(this.stack);
                document.dispatchEvent(popresult);
            }
        }
        else {
            event.currentTarget.style.transform = 'translate(' + 0 + 'px, ' + 0 + 'px)';
            event.currentTarget.style.transitionDuration = "0.6s";
            document.body.style.backgroundColor = '#d0e6df';
            this.deltaX = 0;
            this.deltaY = 0;
        }
    }


    _CreateNewCard() {
        this.front = Object.keys(FLASHCARD_DECKS[this.stage].words)[this.stack[ this.stackptr]];
        this.back = Object.values(FLASHCARD_DECKS[this.stage].words)[this.stack[ this.stackptr]];

        console.log('array:' + Object.values(FLASHCARD_DECKS[this.stage].words));
        console.log('wordcount:' + this.max_wordcount);

        console.log('stage:' + this.front + '  and  ' + this.back);

        this.flashcardElement = this._createFlashcardDOM(this.front, this.back);
        this.containerElement.append(this.flashcardElement);

        this.flashcardElement.addEventListener('pointerup', this._flipCard);
        this.flashcardElement.addEventListener('pointerdown', this.onDragStart);
        this.flashcardElement.addEventListener('pointerup', this.onDragEnd);
        this.flashcardElement.addEventListener('pointermove', this.onDragMove);

        let element = document.querySelector('.status .correct');
        element.textContent = this.rightval;

        element = document.querySelector('.status .incorrect');
        element.textContent = this.wrongval;
        this.wordcount++;
    }

    _Continued(){
        if(this.wrongval!==0){
            this.wordcount -= this.wrongval;
            this.wrongval=0;
            this.stacktmp=[];
            this.stackptr=0;
            this._CreateNewCard();
        }
    }

}
