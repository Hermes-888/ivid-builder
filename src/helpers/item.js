class Item {
  #text = {
    placeholder: {
      key: {
        'default': 'key',
        'not-correct': 'not correct key',
        'empty': 'cannot be empty',
      },
    },
  };

  constructor(item, parentType) {
    this.key = parentType === 'object' ? item.key : null;
    this.value = Item.processValue(item.value, Item.getType(item.value));
    this.type = item.type ? item.type : this.processType(Item.getType(item.value));
    this.collapsed = false;// always?
    this.placeholder = this.#text.placeholder.key.default;
    // console.log('Item:', this.key, this.value, this.type);

    /**
     * Display a color-swatch & Color Picker
     * There are multiple color values. rgb, rgba, hex
     * Always use Color in the name. ie: ButtonColor, fillColor, borderColor
     */
    if (this.type === 'string') {
      let keyString = this.type === 'string' ? this.key.toLowerCase() : '';
      if (keyString.indexOf('color') > -1) {
        this.type = 'color';
        this.visible = false;
      }
      /**
       * Display a file selector button
       */
      if (keyString.indexOf('audio') > -1) {
        this.type = 'file';
        this.asset = 'audio';
      }
      if (keyString.indexOf('video') > -1) {
        this.type = 'file';
        this.asset = 'video';
      }
      if (keyString.indexOf('image') > -1) {
        this.type = 'file';
        this.asset = 'image';
      }
      if (keyString.indexOf('file') > -1) {
        this.type = 'file';
        this.asset = 'vtt';
      }
    }
    /**
     * cueData: []
     * Display array in tabs or accordion
     */
    // if (this.key === 'cueData') {
    //   this.type = 'tabs';
    //   console.log('Item:', this.key, this.type, this.value);
    // }
  }

  static parseItem(data, parentType) {
    return Object.entries(data).map(([key, value]) => new Item({ key, value }, parentType));
  }

  static processValue(value, type) {
    switch (type) {
      case 'object':
      case 'array':
        return Item.parseItem(value, type);
      case 'transform':
        return value.toString();
      default:
        return value;
    }
  }

  static getType(object) {
    switch (Object.prototype.toString.call(object)) {
      case '[object Array]':
        return 'array';
      case '[object Object]':
        return 'object';
      case '[object Null]':
      case '[object Undefined]':
        return 'null';
      case '[object Date]':
      case '[object RegExp]':
      case '[object Function]':
        return 'transform';
      default:
        return typeof object;
    }
  }

  processType(type) {
    switch (type) {
      case 'transform':
        return 'string';
      default:
        return type;
    }
  }

  changeType() {
    switch (this.type) {
      case 'array':
      case 'object':
        this.value = [];
        break;
      case 'number':
        this.value = 0;
        this.collapsed = false;
        break;
      case 'string':
        this.value = '';
        this.collapsed = false;
        break;
      case 'boolean':
        this.value = true;
        this.collapsed = false;
        break;
      default:
        this.value = null;
        this.collapsed = false;
        break;
    }
  }

  checkKey() {
    if (this.key.length === 0) {
      this.placeholder = this.#text.placeholder.key.empty;
      return false;
    }
    if (this.key[0].match(/[a-zA-Z_]/) === null) {
      this.key = '';
      this.placeholder = this.#text.placeholder.key['not-correct'];
      return false;
    }

    this.placeholder = this.#text.placeholder.key.default;
    return true;
  }

  buildItem() {
    switch (this.type) {
      case 'array':
        return this.value.map((item) => {
          switch (item.type) {
            case 'array':
            case 'object':
              return item.buildItem();
            default:
              return item.value;
          }
        });
      case 'object':
        return Object.fromEntries(
          this.value.map((item) => {
            switch (item.type) {
              case 'array':
              case 'object':
                return [item.key, item.buildItem()];
              default:
                return [item.key, item.value];
            }
          })
        );
      default:
        return this.value;
    }
  }
}

export default Item;
