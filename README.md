# postcss-value-parser

transforms css values into the tree

# Usage

```js
var parser = require('postcss-value-parser');

/*{
    nodes: [
      type: 'function',
      value: 'rgba',
      nodes: [
        { type: 'word', value: '233' },
        { type: 'div', value: ',', before: '', after: ' ' },
        { type: 'word', value: '45' },
        { type: 'div', value: ',', before: '', after: ' ' },
        { type: 'word', value: '66' },
        { type: 'div', value: ',', before: ' ', after: '' },
        { type: 'word', value: '.5' }
      ]
    ]
  }*/
parser('rgba(233, 45, 66 ,.5)')
  .walk('rgba', function (fn) {
    var color = fn.filter(function (node) {
      return node.type === 'word';
    }); // [233, 45, 66, .5]
    fn.type = 'word';
    fn.value = convertToHex(color);
  })
  .toString();
  // #E92D42
```

## API

```
var parser = require('postcss-value-parser');
```

### parser.unit(value)

Returns parsed value

```js
// .2rem
{
  number: '.2',
  unit: 'rem'
}
```

### var p = parser(value)

Returns parsed tree

### p.nodes

Root nodes list

### p.toString()

Stringify tree to the value

### p.walk([name, ]cb[, reverse])

- `name` value filter
- `cb(node, index, nodes)`
- `reverse` walk to the deepest functions firstly

# License

MIT © [Bogdan Chadkin](mailto:trysound@yandex.ru)