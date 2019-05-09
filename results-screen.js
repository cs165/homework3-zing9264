// TODO(you): Modify the class in whatever ways necessary to implement
// the flashcard app behavior.
//
// You may need to do things such as:
// - Changing the constructor parameters
// - Adding methods
// - Adding additional fields

class ResultsScreen {
    constructor(containerElement) {
        this.containerElement = containerElement;
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
        this._backToMenu = this._backToMenu.bind(this);
        this._continue=this._continue.bind(this);



        this.toMenu = this.containerElement.querySelector('.to-menu');
        this.toMenu.addEventListener('click', this._backToMenu);

        this.continue = this.containerElement.querySelector('.continue');
        this.continue.addEventListener('click', this._continue);

        this.state = 'null';

    }

    show(numberCorrect, numberWrong) {

        let percent = this.containerElement.querySelector('.percent');
        let correct = this.containerElement.querySelector('.correct');
        let incorrect = this.containerElement.querySelector('.incorrect');

        percent.textContent = numberCorrect / (numberWrong + numberCorrect) * 100;
        correct.textContent = numberCorrect;
        incorrect.textContent = numberWrong;

        if (numberCorrect / (numberWrong + numberCorrect) * 100 === 100) {
            this.continue.textContent = 'Start over?'
            this.state = 'Start over?'
        }
        else {
            this.continue.textContent = 'Continue'
            this.state = 'Continue'
        }

        this.containerElement.classList.remove('inactive');


    }

    hide() {
        this.containerElement.classList.add('inactive');
    }

    _backToMenu() {
        this.hide();
        let reload = new CustomEvent('reload');
        document.dispatchEvent(reload);
    }

    _continue() {

        this.hide();
        if (this.state === 'Start over?') {
            let Start = new CustomEvent('Start');
            document.dispatchEvent(Start);
        }
        else if(this.state=== 'Continue'){
            let Continue = new CustomEvent('Continue');
            document.dispatchEvent(Continue);
        }
    }
}
