# bolt
Misfit Bolt javascript Interface

- At this stage, entirely inspired by [fayep's Python implementation](https://github.com/fayep/bolt)
- PRs welcomed!

## Setup

```bash
npm install
```


## Example

```javascript
Bolt.discover(function(bolt) {
  var i = 0;
  var colors = ["pink", "orange", "silver", "magenta", "green"];
  setInterval(function(){
    bolt[colors[i++ % colors.length]]();
  }, 500);
})
```

## TODO
- cleanup
- colors from HEX / RGB
- brightness control
- tests
- npm package
