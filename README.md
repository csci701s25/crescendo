# [Project Title]
## Middlebury College, CSCI 701 (Senior Seminar, Spring 2025)

This is your main project README which will contain instructions on how to build and run your project. You can delete and overwrite the contents of this README file at any point. We'll talk about what should be included in this file later in the semester.

This initial project template contains a few workflows (defined in `.github/workflows`) to help with your project development:

1. `checks.yml`: A workflow that runs anytime a PR is opened, or a new commit is pushed to a branch with an open PR. At some point in the semester, please modify/add steps for the checks you wish to run (e.g. adding checks for tests & style). Your repository is configured to require all status checks to pass before merging a PR.

2. `merge.yml`: A workflow that runs when a commit is pushed to the `main` branch, like when a Pull Request is merged. If you need to deploy your project, you should add some steps in this file. When this workflow succeeds, a message will be sent to your project channel in Slack.

3. `issue.yml`: A workflow that will notify your project channel in Slack that a new Issue was created.

In general, your development workflow will be to open one (or more) Issues in any given week, write the code in the coming week, and then open and merge one (or more) PRs that address the corresponding Issue(s) from the previous week. When opening an Issue & Pull Request, please complete the relevant fields in the description (the templates are defined in the `.github` directory).

Your first task is to create/review/merge a Pull Request that addresses Issue #1, which consists of creating a `CODE_OF_CONDUCT.md` file for your project.
