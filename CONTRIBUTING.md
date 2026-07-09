# Contributing to TruthLens AI

Thanks for your interest in improving TruthLens AI — an ensemble fake news
detector spanning classical ML, deep learning, and graph neural networks.
Contributions of any size are welcome.

## Ways to contribute

- 🐛 Report bugs in the web app or inconsistencies in a notebook
- ✨ Propose new features (e.g. a new model, a new dashboard chart)
- 📝 Improve documentation (README, notebook comments, code docstrings)
- 🎨 UI/UX improvements to the `client/` React app

## Project structure

TruthLens-AI/
├── notebooks/     # model training notebooks (ML, RNN, LSTM, CNN, GNNs)
├── saved_models/  # trained artifacts produced by the notebooks
├── ai-service/    # (planned) Python inference API
├── server/        # (planned) Express API layer
└── client/        # React + Vite frontend

## Development setup

### Web app (client/)
```bash
cd client
npm install
npm run dev          # starts dev server at http://localhost:5173
npm run build         # production build — must pass before opening a PR
```

### Notebooks
```bash
pip install -r requirements.txt
```
Each notebook loads the dataset via `pd.read_csv(...)` near the top — update
that path to point at your local copy of the
[Kaggle fake-news dataset](https://www.kaggle.com/datasets/kankanachakraborty/fake-news)
before running all cells.

## Making a change

1. Fork the repository and clone your fork
2. Create a branch: `git checkout -b feature/your-feature-name`
3. Make your changes, keeping the diff focused on one thing
4. For frontend changes: run `npm run build` inside `client/` and confirm it
   completes with no errors
5. For notebook changes: run all cells top-to-bottom and confirm no cell
   throws an error before committing
6. Commit with a clear message: `git commit -m "Add: short description"`
7. Push and open a Pull Request against `main`

## Pull request checklist

- [ ] Change is scoped to a single feature/fix
- [ ] `client/` builds successfully (`npm run build`), if frontend changed
- [ ] Notebook runs end-to-end without errors, if a notebook changed
- [ ] PR description explains **what** changed and **why**
- [ ] Screenshots included for any UI changes

## Reporting bugs

Please include:
- Steps to reproduce
- Expected behavior vs. what actually happened
- Screenshots (for UI bugs) or the full error/traceback (for notebook bugs)
- Your environment (OS, Node version for client issues; Python/package
  versions for notebook issues)

## Code style

- **Frontend:** functional React components, hooks over classes, keep
  component files under ~300 lines where reasonable
- **Notebooks:** keep the existing cell structure (imports → preprocessing →
  model → training → evaluation → save artifacts) so all 5 notebooks stay
  consistent with each other

## Code of Conduct

Be respectful and constructive. Assume good intent, disagree on ideas rather
than people, and keep feedback focused on the code/content, not the
contributor.

***Thank You ❤️***

Thank you for helping improve TruthLens AI.

Your contributions support the development of reliable, explainable, and scalable AI solutions for fake news detection. Every contribution, no matter how small, helps make the project better.

***Happy Coding! 🚀***
