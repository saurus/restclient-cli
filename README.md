# restclient-cli
Just a quick test for a command line version of vscode-restclient

### How to prepare source code

clone this repo and `vscode-restclient` repo on the same base directory:

```bash
cd <somedir>
git clone https://github.com/saurus/restclient-cli.git
git clone -b vscode-independence https://github.com/saurus/vscode-restclient.git
cd restclient-cli
```

Now you need to copy some source files from `vscode-restclient/src` to `restclient-cli/src`. 

If you are on a modern unix (so you have bash, grep, sed, realpath...), you can simply run

```bash
./findDeps.sh
```

This script will extract references from `import` and `require` directives, and copy missing files from `vscode-resclient` directory.

The script will not automatically get the dependencies of the newly copied files, so simply run it a few times, until you get an empty output.

If you can't use the script, the list of files needed can be found on `add_files.txt` file. Those files should be copied to the `src` directory.

### How to build

```bash
npm install
tsc
```

### How to run

```bash
node dist/main.js <some .http file>
```

