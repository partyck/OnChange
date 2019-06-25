class Vote {
  constructor(a) {
    this.answers = a;
    this.result;
    this.totalVotes = 0;
    this.counter = new Array();
    a.forEach((element, i) => {
      this.counter[i] = 0;
    });
  }

  addAnswers(a) {
    this.answers = a;
  }

  push(option) {
    this.counter[option]++;
    this.totalVotes++;
  }

  printVote() {
    let percents = new Array();
    this.counter.forEach((optionCounter, i) => {
      percents[i] = optionCounter * 100 / this.totalVotes;
    });
    let distance = 0;
    percents.forEach((element) => {
      let length = map(element, 0, 100, 0, width);
      fill(map(distance,0,));
      rect(distance, 10, distance + length, 10);
      distance += length;
    });
  }
}