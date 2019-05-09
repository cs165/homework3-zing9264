// TODO(you): Modify the class in whatever ways necessary to implement
// the flashcard app behavior.
//
// You may need to do things such as:
// - Changing the constructor parameters
// - Rewriting some of the existing methods, such as changing code in `show()`
// - Adding methods
// - Adding additional fields

class FlashcardScreen {
  constructor(containerElement) {
    this.containerElement = containerElement;

  }

  show(stage,isContinue) {
    this.containerElement.classList.remove('inactive');
    const flashcardContainer = document.querySelector('#flashcard-container');
    if(isContinue===true){
      this.card.wsptr=0;
    }
    else {
      this.card = new Flashcard(flashcardContainer, stage);
    }
  }

  hide() {
    this.containerElement.classList.add('inactive');
  }
}
