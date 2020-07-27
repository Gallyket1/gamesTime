export default class textMessage {ù
  constructor(text, color, emoji){
    this._text = text;
    this._color = color;
    this._emoji = emoji;
  }

  get text() {
    return this._text;
  }

  set text(value) {
    this._text = value;
  }

  get color() {
    return this._color;
  }

  set color(value) {
    this._color = value;
  }

  get emoji() {
    return this._emoji;
  }

  set emoji(value) {
    this._emoji = value;
  }
}
