# SymptoSmart (Submission for CodeForge24)

## Project Details

HealthBot is an AI-powered health assistant designed to streamline user interaction and provide personalized health insights. The application employs natural language processing (NLP) to understand user input, analyze symptoms, and offer recommendations. The project incorporates various technologies and a user-friendly interface for a seamless experience.

## Table of Contents

- [User Interaction](#user-interaction)
- [Symptom Analysis](#symptom-analysis)
- [Disease Identification and Recommendation](#disease-identification-and-recommendation)
- [Data Backup](#data-backup)
- [User-Friendly Interface](#user-friendly-interface)
- [Tech Stack](#tech-stack)
- [Flow Chart](#flow-chart)
- [Getting Started](#getting-started)

## User Interaction

Upon accessing the web application, users provide essential details such as name and email through text or speech. The bot sends an email verification for user authentication. Once verified, users can report symptoms, receive remedies, and view chat history stored with their email ID.

## Symptom Analysis

A model trained on a dataset containing diseases and associated symptoms is implemented using the Spacy library in Python. The model uses TF-IDF vectorization to convert symptom strings into numerical vectors for machine learning.

## Disease Identification and Recommendation

The Rasa bot, trained on the aforementioned model, identifies potential symptoms from user input. It matches symptoms with the dataset, providing disease predictions. The bot requires at least 3 symptoms for a comprehensive prediction but can make partial predictions with fewer symptoms.

## Data Backup

After user input, the Rasa bot sends chat data, including name and email, to the server for storage. Users can retrieve this information from the history section of the GUI.

## User-Friendly Interface

HealthBot's GUI is built using the MERN stack, incorporating MongoDB for chat details, Express and Node for backend connectivity, React for the user interface, and Rasa for processing user input. Flask facilitates API support connecting the frontend and backend.

## Tech Stack

- MERN Stack
- Pandas (Python Library)
- Spacy (Python Library)
- Flask API (Python Framework)
- Scikit-learn (Open Source Machine Learning Python Library)
- TfidfVectorizer
- Linear Kernel
- Rasa

## Flow Chart

<p>
<img src="https://i.imgur.com/jRLPUT5.png" width="580" height="280" hspace="10"> 
</p>

The user interacts with the frontend through a chat interface, sending messages to the Rasa bot via a Flask API. The bot uses natural language understanding (NLU) to generate responses and executes Rasa actions. The backend stores chat history, allowing users to access past conversations. Formatted responses from Rasa are relayed to the frontend for display, creating a seamless conversational experience with a history log.

## Getting Started

1. Clone the repository: `git clone https://github.com/your-repo.git`
2. Install dependencies: `npm install`
3. Start the application: `npm start`

## Contributors:

Team Name: UFOders

* [Mirga Farhaan Baig](https://github.com/fourhaan)
* [Shreyansh Karamtot](https://github.com/Fire-guy)
* [Dhruv Rastogi](https://github.com/DHRUVRastogi-123)
