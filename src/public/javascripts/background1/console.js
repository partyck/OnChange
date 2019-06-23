class ConsoleSimulator {

  constructor() {
    this.texts = new Array();
    this.fontSize = 30;
    this.distance = 30;
    this.numerLines = height / this.distance + 1;
  }

  print() {
    fill(255);
    noStroke();
    textSize(this.fontSize);
    let totalDistance = height - 10;
    for (let index = this.texts.length; index > 0; index--) {
      let element = this.texts[index - 1];
      text(element, 10, totalDistance);
      totalDistance -= this.distance;
    }
  }

  addObj(obj) {
    let objString = JSON.stringify(obj);
    this.texts.push(objString);
  }

  addString(strng) {
    this.texts.push(strng);
    if (this.texts.length > this.numerLines ) {
      this.texts.shift();
    }
  }
}