# Getting Started

## Team 3

- Steven Capleton
- Landon Dyken
- Karen Horton
- Eric Latham
- Brittany Latham
- Laura Thompson

### Connect to UAB VPN

Refer to [this page](https://www.uab.edu/it/home/tech-solutions/network/vpn).

### Sign into GitLab

- Sign into [the UAB CS department's GitLab](https://gitlab.cs.uab.edu/) with your BlazerID and password

### Make Your GitLab Email Public

This will be helpful later on when we set up [Shortcut](#shortcut)

- Go to your user settings in the top right corner of the screen
- Under "Public email", select your UAB email address
- Scroll down and click "Update profile settings"

### Clone Project Repository

- In the terminal, create a CS499 folder wherever you want the project files to be stored
  - For example, enter `mkdir CS499` in the directory where you want the new directory to live
- `cd` into the CS499 directory you made
  - For example, enter `cd CS499`
- Enter `git clone git@gitlab.cs.uab.edu:499/project.git`
  - The URL `git@gitlab.cs.uab.edu:499/project.git` can also be found and copied from the "Clone" -> "Clone with SSH" button on the [repository page](https://gitlab.cs.uab.edu/499/project)
  - If `git` is not installed, you will need to install `git` first
- `cd` into the cloned project 1 repository
  - Enter `cd project`

### Development Tools

We will use Python, React, and Markdown extensively for this project

Please complete the following instructions on a unix-based system

#### Git

The following are commands you will enter into your terminal while inside the `project` directory

##### `git pull`

_Download changes from other users_

##### `git add <new or edited file in repo>`

_Add your own local changes to be committed to the repo_

- Example: `git add report.md`

##### `git commit -m "<commit message explaining what you added/changed>"`

_Declare your changes before uploading them_

- Example: `git commit -m "Write the project report"`

##### `git push`

_Upload your committed changes_

#### Python

To install Python 3.9, look [here](https://www.python.org/downloads/)

#### Visual Studio Code

To install Visual Studio Code, look [here](https://code.visualstudio.com/Download)

##### Python Support

Install the following plug-ins in Visual Studio Code:

- `ms-python.python`
- `ms-python.vscode-pylance`

##### React Support

Install the following plug-ins in Visual Studio Code:

- `dbaeumer.vscode-eslint`
- `esbenp.prettier-vscode`

##### Markdown Support

Install the following plug-ins in Visual Studio Code:

- `DavidAnson.vscode-markdownlint`
- `yzane.markdown-pdf`

For info on using Markdown in Visual Studio Code, look [here](https://code.visualstudio.com/docs/languages/markdown)

#### PDM

To install PDM, look [here](https://pdm.fming.dev/#installation)

To enable Visual Studio Code to detect local dependencies installed with PDM, look [here](https://pdm.fming.dev/#installation)

Visual Studio Code `settings.json` should include the following:

```json
{
  ...
  "python.autoComplete.extraPaths": ["__pypackages__/3.9/lib"],
  "python.analysis.extraPaths": ["__pypackages__/3.9/lib"]
}
```

#### Shortcut

Shortcut (PKA Clubhouse) is a great product for tracking agile software development projects like ours

- Go [here](https://app.shortcut.com/invite-link/612e6097-4c0e-4a0b-a830-f2ddba5d4b26) and sign up (you can sign up with your Google account)
- Explore the "Epics" and "Stories" already written in the team workspace
- We will use Shortcut to assign, document, track, and collaborate on tasks throughout the project lifecycle

### Additional Resources

#### [LucidChart](https://lucid.app/folder/invitations/accept/inv_54ef0729-0f14-4b97-8435-e4e01f496e0c)

We will use this for making diagrams and prototypes
