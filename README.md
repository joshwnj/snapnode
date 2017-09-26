# snapnode

_run your node in snapshot mode_

**WIP**

```
       /\
      /  \
     / _o \
    / <(\  \
   /   />`A \
  '----------`
```

## usage

- first, install: `npm install -g snapnode`
  - also `npm install -g electron` if you don't have it already
- now instead of running `node yourscript.js` run `snapnode yourscript.js`
- you'll see the output of `yourscript.js` in a window
- try changing something in `yourscript.js` to produce a different output.
- now you can see the diff!
- if the new output looks wrong, fix it. If it looks right, press the "Update" button to update the base snapshot.

### power user

- `j` and `k` move to the next and previous snapshot in the list.

- when there is a diff you can press the `\` (or `|`)  key to toggle between a unified diff and a split left/right view.

## what's next

- support multiple scripts / multiple output artifacts
- support non-text output
