# TruthLens.AI_AI-Powered_Fake_News_Detection_Platform

<p align="center">
  <img src="Images/Banner/banner.png" alt="TruthLens AI Banner" width="100%">
</p>

<p align="center"><em>Seeing Beyond Headlines. Trusting Intelligence.</em></p>
<p align="center"><strong>An intelligent fake news detection platform powered by Machine Learning, Deep Learning, and Graph Neural Networks with a modern React web application for real-time prediction, model comparison, analytics, and explainable AI.</strong></p>


<p align="center">
  <img src="https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white"/>
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white"/>
  <img src="https://img.shields.io/badge/TensorFlow-DeepLearning-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white"/>
  <img src="https://img.shields.io/badge/PyTorch_Geometric-GNN-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white"/>
  <img src="https://img.shields.io/badge/License-MIT-success?style=for-the-badge"/>
</p>

---

## 📌 Overview

**TruthLens AI** is an AI-powered fake news detection platform that trains and compares **9 models across three paradigms** — classical Machine Learning, Deep Learning, and Graph Neural Networks — on a 44,898-article dataset (35,918 train / 8,980 test), then serves them through a real-time React web app with model comparison, analytics, and prediction history.

## ✨ Features

| | |
|---|---|
| 🧠 **9-Model Ensemble** | ML, DL & GNN models trained and benchmarked side-by-side |
| ⚡ **Real-Time Detection** | Paste any article, pick a model, get an instant Fake/Real verdict |
| ⚖️ **Model Comparison** | Run one article through all 9 models simultaneously |
| 📊 **Analytics Dashboard** | Accuracy/precision/recall/F1/ROC-AUC + training curves per model |
| 🕘 **Prediction History** | Searchable log with CSV/PDF export |
| 🌐 **Modern Web App** | React + Vite, fully responsive, dark/light theme |

## 🏗️ Architecture

<p align="center">
  <img src="Images/Architecture/architecture.png" alt="System Architecture" width="90%">
</p>

## 🔄 Workflow

<p align="center">
  <img src="Images/Workflow/workflow.png" alt="Project Workflow" width="90%">
</p>

```text
Dataset (44,898 articles) → Preprocessing → Tokenization/TF-IDF → Model Training (ML / DL / GNN)
        → Evaluation on 8,980-article test set → Saved Models → React Web App → Real-Time Prediction
```

## 🧠 AI Models & Real Test-Set Results

**Classical ML** — TF-IDF (2,000 features) → scikit-learn

| Model | Accuracy | Precision | Recall | F1-Score |
|---|---:|---:|---:|---:|
| Random Forest | **99.35%** | 99.36% | 99.25% | 99.30% |
| SVM | 98.35% | 98.08% | 98.39% | 98.24% |
| Logistic Regression | 97.45% | 96.92% | 97.64% | 97.28% |

**Deep Learning** — Embedding(64) → sequence/conv layer → Dense → TensorFlow/Keras

| Model | Accuracy | Precision | Recall | F1-Score |
|---|---:|---:|---:|---:|
| CNN | **99.88%** | ~99.9% | ~99.9% | ~99.9% |
| LSTM | 99.72% | ~99.7% | ~99.7% | ~99.7% |
| RNN | 76.0% | 77.0% | 76.0% | 76.0% |

> ⚠️ **Note:** Plain RNN noticeably underperforms LSTM (76% vs. 99.7%) on this dataset — a textbook vanishing-gradient result. LSTM's gating mechanism preserves long-range context that SimpleRNN loses, which is exactly what these two models' side-by-side numbers demonstrate.

**Graph Neural Networks** — TF-IDF(500) + k-NN graph (k=10) → PyTorch Geometric

| Model | Accuracy | Precision | Recall | F1-Score | ROC-AUC |
|---|---:|---:|---:|---:|---:|
| GraphSAGE | **95.0%** | 94.0% | 95.0% | 95.0% | 0.99 |
| GAT | 93.0% | 92.0% | 93.0% | 92.0% | 0.97 |
| GCN | 92.0% | 91.0% | 92.0% | 92.0% | 0.97 |

## 📸 Screenshots

<table>
<tr>
<td width="50%"><img src="Images/Screenshots/home.png"/><p align="center"><b>Home</b></p></td>
<td width="50%"><img src="Images/Screenshots/detect-news.png"/><p align="center"><b>Detect News</b></p></td>
</tr>
<tr>
<td><img src="Images/Screenshots/compare-models.png"/><p align="center"><b>Compare Models</b></p></td>
<td><img src="Images/Screenshots/analytics.png"/><p align="center"><b>Analytics</b></p></td>
</tr>
<tr>
<td><img src="Images/Screenshots/history.png"/><p align="center"><b>History</b></p></td>
<td><img src="Images/Screenshots/developer.png"/><p align="center"><b>Developer</b></p></td>
</tr>
</table>

## 📊 Results

**Dataset**
<p align="center">
  <img src="Images/Results/class-distribution.png" width="380"/>
  <img src="Images/Results/word-cloud.png" width="380"/>
</p>

**Classical ML — Logistic Regression, Random Forest, SVM**
<p align="center">
  <img src="Images/Results/ml-performance-matrix.png" width="420"/>
  <img src="Images/Results/ml-roc-curve.png" width="380"/>
</p>

**Graph Neural Networks — GCN, GAT, GraphSAGE**
<p align="center">
  <img src="Images/Results/gnn-performance-matrix.png" width="420"/>
  <img src="Images/Results/gnn-roc-curve.png" width="380"/>
</p>

**Deep Learning — CNN (best-performing model, 99.88% accuracy)**
<p align="center">
  <img src="Images/Results/cnn-confusion-matrix.png" width="380"/>
  <img src="Images/Results/cnn-training-accuracy.png" width="380"/>
</p>

## 🛠️ Tech Stack

**AI/ML:** Python · scikit-learn · TensorFlow/Keras · PyTorch Geometric · Pandas · NumPy · Matplotlib
**Frontend:** React · Vite · React Router · Framer Motion · Recharts · React Icons · React Hot Toast

## ⚙️ Installation

**Prerequisites:** Python 3.10+, Node.js 18+, npm, Git

```bash
git clone https://github.com/YOUR-USERNAME/TruthLens-AI.git
cd TruthLens-AI
```

**AI research (notebooks):**
```bash
cd AI-Research
pip install -r Requirements/requirements.txt
jupyter notebook
```

**Web app:**
```bash
cd Web-App/client
npm install
npm run dev        # http://localhost:5173
```

## 📂 Repository Structure

```text
TruthLens-AI/
├── AI-Research/
│   ├── Datasets/
│   ├── Machine-Learning/
│   ├── Deep-Learning/
│   ├── Graph-Neural-Network/
│   ├── Saved-Models/
│   ├── Results/
│   └── Requirements/requirements.txt
│
├── Web-App/client/          # React + Vite frontend
│
├── Images/
│   ├── Banner/  Architecture/  Workflow/
│   ├── Screenshots/          # 6 web app pages
│   └── Results/              # curated evaluation charts
│
├── README.md · CONTRIBUTING.md · CITATION.cff · LICENSE · .gitignore
```

## 🚀 Roadmap

- [x] 9-model ensemble (ML + DL + GNN)
- [x] React web app — Detect, Compare, Analytics, History, Developer
- [ ] Flask/FastAPI inference service wired to real saved models
- [ ] Investigate/improve RNN performance (bidirectional layers, gradient clipping)
- [ ] Explainable AI (SHAP/LIME) per prediction
- [ ] Docker + cloud deployment

---

## 🤝 Contributing

Contributions are welcome and greatly appreciated!

Whether you're improving AI models, enhancing the React application, fixing bugs, or refining the documentation, your contributions help make **TruthLens AI** even better.

Please read the **[Contributing Guide](CONTRIBUTING.md)** before submitting a Pull Request.

If you find a bug or have a feature request, feel free to open an Issue.

---

## 📖 Citation

If you use **TruthLens AI** in your research, academic work, or projects, please cite this repository.

Citation metadata is available in the **[CITATION.cff](CITATION.cff)** file.

```bibtex
@software{truthlens_ai,
  author = {Kankana Chakraborty},
  title = {TruthLens AI: Intelligent Fake News Detection using Machine Learning, Deep Learning, and Graph Neural Networks},
  year = {2026},
  url = {https://github.com/YOUR-USERNAME/TruthLens-AI}
}
```

---

## 📜 License

This project is licensed under the **MIT License**.

See the **[LICENSE](LICENSE)** file for more information.

---

## 👩‍💻 Author

<div align="center">

### Kankana Chakraborty

**AI/ML Engineer • Software Developer • AI Research Enthusiast**

Passionate about building intelligent systems using **Machine Learning**, **Deep Learning**, **Natural Language Processing**, **Graph Neural Networks**, and **Full-Stack Development**.

</div>

<p align="center">

<a href="https://github.com/YOUR-GITHUB-USERNAME">
<img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white"/>
</a>

<a href="https://www.linkedin.com/in/YOUR-LINKEDIN-USERNAME">
<img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white"/>
</a>

<a href="mailto:YOUR-EMAIL@gmail.com">
<img src="https://img.shields.io/badge/Email-EA4335?style=for-the-badge&logo=gmail&logoColor=white"/>
</a>

</p>

---

## 🌟 Support the Project

If you found this project useful, consider supporting it by:

⭐ Starring the repository

🍴 Forking the project

🛠️ Contributing to the codebase

🐞 Reporting bugs or suggesting improvements

📢 Sharing it with others

---

<div align="center">

### ⭐ If you like this project, don't forget to leave a Star! ⭐

**Thank you for visiting TruthLens AI. Happy Coding! 🚀**

</div>
