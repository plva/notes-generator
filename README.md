# Info
Tools for generating notes packages/directories

G_d_: Used to indicate that the variable has a default value.
G_r_: Used to indicate that the variable is required.
G_o_: Used to indicate that the variable is optional.
G_i_: Used to indicate that the variable is an input parameter, to be input from standard input, one at a time, using the standard parameter-getter prompt.


## development
Try running

```bash
slides test.md
```

## generating single markdown files
(make sure to include spaces between includes)
in `generated/*/main.md`
```
include `path/to/markdownFile.md`

include `path/to/markdownFile.md`
```

Build and save to file
```
m > test.md
```

glow test.md
