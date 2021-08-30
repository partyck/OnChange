class Vote {
  constructor(a, y, sc) {
    this.scene = sc;
    this.answers = a;
    this.result = a[0];
    this.totalVotes = 0;
    this.counter1 = 0;
    this.counter2 = 0;
    this.a1X = width / 8;
    this.a2X = this.a1X * 5;
    if (this.scene == 2) {
      this.tY = y + 60;
      this.vY = y + 100;
    } else {
      this.tY = y + 100;
      this.vY = y + 140;
    }
    this.finale = false;
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
    // this.printSmartphoneIcon();

    fill(100);
    rect(this.a1X, this.vY, 300, 30);
    rect(this.a2X, this.vY, 300, 30);

    fill(204, 255, 51); // verde
    rect(this.a1X, this.vY, percent1, 30);

    fill(255, 102, 153); // fucsia
    rect(this.a2X, this.vY, percent2, 30);
  }

  printAnswersLabels() {
    if (this.scene == 2) {
      fill(255);
      noStroke();
      textSize(25);
      textAlign(LEFT, CENTER);
    } else {
      fill(204, 255, 51); //verde
      noStroke();
      let cWidth = textWidth(this.answers[0]);
      rect(this.a1X, this.tY, cWidth, 40);
      fill(255, 102, 153); // fucsia
      textSize(40);
      cWidth = textWidth(this.answers[1]);
      rect(this.a2X, this.tY, cWidth, 40);
      fill(0);
      textAlign(LEFT, TOP);
      textStyle(BOLD);
    }
    text(this.answers[0], this.a1X, this.tY);
    text(this.answers[1], this.a2X, this.tY)
  }

  coverVote() {
    fill(0);
    rect(0, this.tY - 20, width, 100);
  }

  getResult() {
    if (this.finale) {
      return this.answers[1];
    } else {
      return this.result;
    }
  }

  isFinale() {
    this.finale = true;
  }
}

