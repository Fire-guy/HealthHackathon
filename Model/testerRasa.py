import json
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
import spacy

# Assuming this is part of a Rasa custom action
def provide_remedies(dispatcher, predicted_disease):
    file_path = 'cures.json'

    # Open the file and load the JSON data into a variable
    with open(file_path, 'r') as file:
        data = json.load(file)

    # Check if the predicted disease is in the data
    if 'diseases' in data and predicted_disease in data['diseases']:
        # Retrieve remedies for the predicted disease
        remedies = data['diseases'][predicted_disease].get('cures', [])

        # Prepare and send the message for Rasa to utter
        message = f"Remedies for {predicted_disease}:\n"
        for remedy in remedies:
            message += f"- {remedy}\n"

        dispatcher.utter_message(text=message)
    else:
        dispatcher.utter_message(text=f"No information found for {predicted_disease}")

# Assuming this is part of a Rasa custom action
def predict_disease(dispatcher, user_input):
    user_symptoms = extract_symptoms(user_input)

    while len(user_symptoms) < 3:
        message = f'Current symptoms: {user_symptoms}\n'
        suggestions = get_symptom_suggestions(user_symptoms)
        message += f'Oh, that is very sad to hear. Do you also experience: {suggestions}\n'

        if not suggestions:
            message += "No more suggestions. Unable to identify the disease."
            dispatcher.utter_message(text=message)
            return

        # Assuming Rasa will handle the user response and extract it
        user_response = "done"  # Placeholder, replace this with the actual user response

        if user_response.lower() == 'done':
            break

        user_symptoms.extend(extract_symptoms(user_response))

    # Predict disease based on symptoms
    user_symptoms_str = ' '.join(user_symptoms)
    user_vector = tfidf_vectorizer.transform([user_symptoms_str])

    cosine_similarities = linear_kernel(user_vector, tfidf_matrix).flatten()
    predicted_disease_index = cosine_similarities.argmax()
    predicted_disease = df['Disease'][predicted_disease_index]

    message = f'According to me, you are suffering from {predicted_disease}\nDon\'t worry, here are some remedies.\n'
    dispatcher.utter_message(text=message)

    # Call the modified provide_remedies function to send remedies message
    provide_remedies(dispatcher, predicted_disease)

# Assuming this is part of a Rasa custom action
def get_symptom_suggestions(user_symptoms):
    suggestions = set()

    for symptom in user_symptoms:
        symptom_idx = df['Symptoms_str'].str.contains(symptom)
        related_diseases = df[symptom_idx]['Disease'].tolist()

        for disease in related_diseases:
            common_symptoms = df[df['Disease'] == disease]['Symptoms'].values[0]
            suggestions.update(common_symptoms)

    suggestions -= set(user_symptoms)
    return list(suggestions)[:2]