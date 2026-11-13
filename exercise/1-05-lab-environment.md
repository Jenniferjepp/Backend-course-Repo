# 1-05 Lab environment: terminal, Git, Node.js and an editor

You install the tools the course uses and check that they work. Everyone in the course works in a **bash terminal**,
whatever the operating system, so the commands in the exercises work the same for all of us. At the end you have
Node.js, Git, `curl`, an editor and an SSH key on GitHub or GitLab.

This is what you end up with:

| Tool | Used for | Check with |
|---|---|---|
| A bash terminal | Running every command in the course | `bash --version` |
| Git | Version control, your repo | `git --version` |
| Node.js 22 or later, with npm | Running JavaScript and installing packages | `node --version`, `npm --version` |
| `curl` | Sending HTTP requests from the terminal | `curl --version` |
| An editor, for example VS Code | Writing code | |
| An account on GitHub or GitLab, with an SSH key | Pushing your repo | `ssh -T git@github.com` |

## Background: why bash

The terminal is where you start servers, run tests and use Git. Terminals speak different languages: Windows has
PowerShell and `cmd`, macOS and Linux have bash or zsh. A line like `PORT=3001 npm start` works in bash and zsh but not
in `cmd`. To keep the exercises the same for everyone, we use bash:

- **Windows**: Git Bash, which comes with Git for Windows.
- **macOS**: the Terminal app. It runs zsh, which runs the commands in this course just like bash.
- **Linux**: the terminal you already have.

If you already work in WSL on Windows, you may keep doing that; install the tools inside WSL by following the Linux
part.

Do the part for your operating system, then continue at "Configure Git".

## Install on Windows

1. **Git and Git Bash.** Download Git for Windows from https://git-scm.com/downloads/win and install it. The default
   choices are fine, with one exception: when asked about the default editor, pick one you know (for example Visual
   Studio Code or Nano) instead of Vim.
2. **Node.js.** Download the LTS installer (the `.msi`) from https://nodejs.org/ and install it with the default
   choices.
3. **The editor.** Install VS Code from https://code.visualstudio.com/.
4. **Open Git Bash** from the Start menu. Open it after the installs, so it finds the new programs.

`curl` comes with Git Bash.

To use Git Bash inside VS Code: open the Command Palette (`Ctrl+Shift+P`), choose "Terminal: Select Default Profile"
and pick "Git Bash". A new terminal in VS Code (`` Ctrl+` ``) is then a Git Bash.

## Install on macOS

1. **Git.** Open the Terminal app and run:

   ```bash
   xcode-select --install
   ```

   This installs Apple's command line tools, Git among them. If it says they are already installed, you are done.

2. **Node.js.** Download the LTS installer (the `.pkg`) from https://nodejs.org/ and install it.
3. **The editor.** Install VS Code from https://code.visualstudio.com/.

`curl` is already installed. If you use Homebrew, `brew install git node` works as well.

## Install on Linux

The Node.js in your distribution's package manager is often too old (Ubuntu 24.04 has version 18), so install Node
with nvm, the Node Version Manager.

1. **Git and curl.** On Ubuntu or Debian:

   ```bash
   sudo apt update
   sudo apt install git curl
   ```

2. **Node.js with nvm.** Follow the "Linux" tab with nvm on https://nodejs.org/en/download, which installs nvm and
   then the LTS version of Node. Close the terminal and open a new one afterwards.
3. **The editor.** Install VS Code from https://code.visualstudio.com/, or use the editor you prefer.

## Check the versions

You are in your bash terminal. Run each command and check the result:

```bash
bash --version   # any version
git --version    # any recent version
node --version   # v22 or later
npm --version    # comes with Node
curl --version   # any version
```

If a command is "not found", the tool is not installed or the terminal was opened before the install. Open a new
terminal and try again.

## Configure Git

Git puts your name and email in every commit. Set them once:

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
git config --global init.defaultBranch main
```

Use the email of your GitHub or GitLab account, so your commits are linked to you there.

## Create an SSH key and add it to GitHub or GitLab

An SSH key lets you push to your repo without typing a password. You create a key pair: the private key stays on your
computer, the public key goes to GitHub or GitLab.

1. Create an account on GitHub (https://github.com/) or GitLab (https://gitlab.com/) if you have none.
2. Check if you already have a key:

   ```bash
   ls ~/.ssh/id_ed25519.pub
   ```

   If the file exists, skip to step 4.

3. Create a key. Press Enter to accept the default file; a passphrase is optional:

   ```bash
   ssh-keygen -t ed25519 -C "you@example.com"
   ```

4. Print the public key and copy all of it, from `ssh-ed25519` to the email:

   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```

5. Add it to your account:
   - GitHub: Settings, "SSH and GPG keys", "New SSH key".
   - GitLab: Preferences (your avatar), "SSH Keys", "Add new key".

6. Test the connection. Answer `yes` the first time it asks about the host:

   ```bash
   ssh -T git@github.com    # or: ssh -T git@gitlab.com
   ```

   It greets you with your user name. That means it works, even if GitHub adds that it does not provide shell access.

## Try the tools

A short round to see that everything works together.

1. Run JavaScript directly in Node. Type `node`, then try a line, and leave with `.exit`:

   ```bash
   node
   > 1 + 2
   > [1, 2, 3].map((n) => n * 2)
   > .exit
   ```

2. Fetch a web page with `curl`, showing the status line and headers:

   ```bash
   curl -I https://nodejs.org/
   ```

3. Open the current directory in VS Code from the terminal:

   ```bash
   code .
   ```

   If `code` is not found on macOS: in VS Code, open the Command Palette and run "Shell Command: Install 'code' command
   in PATH".

### Verify

- [ ] `node --version` shows v22 or later, and `git`, `npm` and `curl` answer with a version.
- [ ] `git config --global user.name` and `user.email` show your name and email.
- [ ] `ssh -T git@github.com` (or `gitlab.com`) greets you with your user name.
- [ ] You work in a bash terminal (Git Bash on Windows), also inside your editor.

<details>
<summary><code>node: command not found</code> in Git Bash after installing Node</summary>

Git Bash was open during the install. Close all Git Bash windows and open a new one. If it still fails, restart the
computer, so Windows updates the `PATH`.

</details>

<details>
<summary><code>node --version</code> shows v18 or older</summary>

An old Node is installed and found first. On Linux, install with nvm as above and run `nvm use --lts`. On Windows and
macOS, install the LTS version from nodejs.org again; it replaces the old one.

</details>

<details>
<summary><code>Permission denied (publickey)</code> from <code>ssh -T</code></summary>

The public key is not added to your account, or you added another key than the one in `~/.ssh/id_ed25519.pub`. Print
the key again, compare it with the one in your account settings, and add it if it is missing.

</details>

## Read more

- Git Bash and Git for Windows: https://gitforwindows.org/
- Node.js downloads: https://nodejs.org/en/download
- SSH keys on GitHub: https://docs.github.com/en/authentication/connecting-to-github-with-ssh
- SSH keys on GitLab: https://docs.gitlab.com/user/ssh/
