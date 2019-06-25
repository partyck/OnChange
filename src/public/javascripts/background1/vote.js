class Vote {
  constructor(a, y) {
    this.answers = a;
    this.result = a[0];
    this.totalVotes = 0;
    this.counter1 = 0;
    this.counter2 = 0;
    this.a1X = width / 8;
    this.a2X = this.a1X * 5;
    this.tY = y + 60;
    this.vY = y + 90;
    this.voteWidth = width / 4;
  }

  push(option) {
    if (option === 0) {
      this.counter1++;
    } else {
      this.counter2++;
    }
    this.totalVotes++;
    if (this.counter1 > this.counter2) {
      this.result = this.answers[0];
    } else {
      this.result = this.answers[1];
    }
  }

  printVote() {
    let percent1 = map(this.counter1 * 100 / this.totalVotes, 0, 100, 0, 300);
    let percent2 = map(this.counter2 * 100 / this.totalVotes, 0, 100, 0, 300);
    this.printAnswersLabels();

    fill(100);
    rect(this.a1X - 20, this.vY, 300, 30);
    rect(this.a2X - 20, this.vY, 300, 30);

    fill(204, 255, 51);
    rect(this.a1X - 20, this.vY, percent1, 30);

    fill(255, 102, 153);
    rect(this.a2X - 20, this.vY, percent2, 30);
  }

  printAnswersLabels() {
    fill(255);
    noStroke();
    textSize(25);
    textAlign(CENTER, CENTER);
    text(this.answers[0], this.a1X, this.tY);
    text(this.answers[1], this.a2X, this.tY)
  }
}

