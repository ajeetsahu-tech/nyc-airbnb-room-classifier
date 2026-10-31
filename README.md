# 🏠 NYC Airbnb Room Type Prediction
### End-to-End Machine Learning Web Application

A Machine Learning web application that predicts the room type of Airbnb listings in New York City based on different property attributes.

This project uses a **Random Forest Classification model** trained on 48,895 real Airbnb listings. The trained ML pipeline is integrated with a FastAPI backend and an interactive frontend, making predictions accessible through a deployed web application.

🌐 **Live Demo:** https://nyc-airbnb-room-types-classifier-1.onrender.com/

---

## 📌 Project Overview

The main objective of this project is to predict the room type of an Airbnb listing based on its property details and other relevant attributes.

The model classifies listings into three categories:

- Entire home/apt
- Private room
- Shared room

Users can enter property details through the web interface and get a predicted room type.

## 🎯 Project Objectives

- Understand and analyze real-world Airbnb data.
- Perform data cleaning and exploratory data analysis.
- Build a Machine Learning classification model.
- Create a reusable preprocessing and prediction pipeline.
- Integrate the trained model with a FastAPI backend.
- Develop an interactive frontend.
- Deploy the complete application on Render.

## 📊 Dataset

**Dataset:** NYC Airbnb Open Data

**Source:** Kaggle

**Dataset Size:** 48,895 listings

The dataset contains information about Airbnb properties in New York City, including:

- Price
- Location and neighbourhood
- Minimum nights
- Number of reviews
- Host listings
- Availability
- Neighbourhood group

## ⚙️ Machine Learning Workflow

The following steps were performed to build the Machine Learning model:

1. Data Loading and Exploratory Data Analysis (EDA)
2. Data Cleaning
3. Feature Engineering
4. Train-Test Split
5. Numerical and Categorical Feature Processing
6. StandardScaler for numerical features
7. OneHotEncoder for categorical features
8. ColumnTransformer for preprocessing
9. Random Forest Classification
10. Model Evaluation
11. Saving the trained ML Pipeline

## 🧠 Model & Technologies

| Technology | Purpose |
|---|---|
| Python | Core programming language |
| Pandas & NumPy | Data manipulation |
| Matplotlib & Seaborn | Data visualization |
| Scikit-learn | Machine Learning |
| Random Forest | Classification algorithm |
| StandardScaler | Numerical feature scaling |
| OneHotEncoder | Categorical feature encoding |
| ColumnTransformer | Feature preprocessing |
| FastAPI | Backend API |
| HTML, CSS & JavaScript | Frontend development |
| Render | Application deployment |
| Joblib / Pickle | Model pipeline serialization |

## 🖥️ Application Features

- Interactive web-based interface.
- Input form for Airbnb property details.
- Borough selection.
- Sample listings for quick testing.
- ML-based room type prediction.
- FastAPI backend integration.
- Deployed and accessible online.

## 🔄 Application Workflow

```text
User Input
    ↓
Frontend (HTML, CSS, JavaScript)
    ↓
FastAPI Backend
    ↓
Saved ML Pipeline
    ↓
Data Preprocessing
    ↓
Random Forest Classifier
    ↓
Predicted Room Type
    ↓
Result Displayed on Frontend
```

## 🚀 Live Application

Try the deployed application:

👉 https://nyc-airbnb-room-types-classifier-1.onrender.com/

## 📚 What I Learned

Through this project, I gained practical experience in:

- Working with real-world datasets.
- Data preprocessing and feature engineering.
- Building classification models using Scikit-learn.
- Creating reusable ML pipelines.
- Integrating Machine Learning models with FastAPI.
- Connecting frontend and backend components.
- Deploying a complete ML application.

## 🔮 Future Improvements

- Improve model performance through further experimentation.
- Add more interactive visualizations.
- Improve prediction insights and user experience.
- Explore additional Machine Learning models.

## 👨‍💻 Author

**Ajeet Sahu**

Aspiring AI/ML Engineer

- GitHub: [@ajeetsahu-tech](https://github.com/ajeetsahu-tech)
- LinkedIn: [Ajeet Sahu](https://linkedin.com/in/ajeetsahu-tech)

---

⭐ If you find this project interesting, feel free to explore the repository and share your feedback!

**Built with Python, Machine Learning and a passion for learning by building.** 🚀
