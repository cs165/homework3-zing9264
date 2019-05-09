// TODO(you): Modify the class in whatever ways necessary to implement
// the flashcard app behavior.
//
// You may need to do things such as:
// - Changing the constructor parameters
// - Changing the code in the constructor
// - Adding methods
// - Adding additional fields

class App {
  constructor() {

    this.SwitchToFlashCard=this.SwitchToFlashCard.bind(this);
    this.SwitchToResultSchreen=this.SwitchToResultSchreen.bind(this);
    this.SwitchToMenuSchreen=this.SwitchToMenuSchreen.bind(this);
    this.SwitchToContinue=this.SwitchToContinue.bind(this);


    const menuElement = document.querySelector('#menu');
    this.menu = new MenuScreen(menuElement);
    document.addEventListener('Start', this.SwitchToFlashCard);

    const mainElement = document.querySelector('#main');
    this.flashcards = new FlashcardScreen(mainElement);

    const resultElement = document.querySelector('#results');
    this.results = new ResultsScreen(resultElement);
    document.addEventListener('popresult', this.SwitchToResultSchreen);
    document.addEventListener('reload', this.SwitchToMenuSchreen);
    document.addEventListener('Continue',this.SwitchToContinue);


    // Uncomment this pair of lines to see the "flashcard" screen:
   // this.menu.hide();
   // this.flashcards.show();

    // Uncomment this pair of lines to see the "results" screen:
   //  this.menu.hide();
   //  this.results.show();
  }

  SwitchToFlashCard(event){
    const titleSelector=this.menu.getStage();
    console.log(titleSelector);
    this.flashcards.show(titleSelector,false);
  }

  SwitchToResultSchreen(event){
      this.menu.hide();
      this.flashcards.hide();

      let rightcount = Object.values(event.detail)[0];
      let wrongcount = Object.values(event.detail)[1];
      console.log(event);
      console.log( Object.values(event.detail)[0] +' and '+  Object.values(event.detail)[1]);

      this.results.show(rightcount,wrongcount);

  }

  SwitchToMenuSchreen(event){
      window.location.reload()
  }

  SwitchToContinue(event){
      const titleSelector=this.menu.getStage();
      this.flashcards.show(titleSelector,true);
      this.results.hide();
  }


}
