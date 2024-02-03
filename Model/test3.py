import json
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
import spacy



# Load the Excel file into a DataFrame
excel_file_path = 'diseases2.xlsx'
df = pd.read_excel(excel_file_path)

# Extract 'disease' and symptoms columns
disease_col = df['diseases']
symptoms_cols = df[['symptom 1', 'symptom 2', 'symptom 3', 'symptom 4', 'symptom 5']]

symptoms_cols = symptoms_cols.applymap(lambda x: '' if pd.isna(x) else x)

# Combine 'disease' and symptoms into a new DataFrame
result_df = pd.DataFrame({'Disease': disease_col, 'Symptoms': symptoms_cols.values.tolist()})

print(result_df)

df = result_df

# Load spaCy model
nlp = spacy.load('en_core_web_sm')

# Preprocess the symptoms data
df['Symptoms_str'] = df['Symptoms'].apply(lambda x: ' '.join(x))

# Create a TF-IDF vectorizer
tfidf_vectorizer = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf_vectorizer.fit_transform(df['Symptoms_str'])

# Function to extract symptoms from user input
def extract_symptoms(user_input):
    doc = nlp(user_input)
    user_symptoms = [token.text for token in doc if token.pos_ == 'NOUN']

    return user_symptoms

def provide_remedies(predicted_disease):
    file_path = 'cures.json'

    # Open the file and load the JSON data into a variable
    with open(file_path, 'r') as file:
        data = json.load(file)

    # Check if the predicted disease is in the data
    if 'diseases' in data and predicted_disease in data['diseases']:
        # Retrieve remedies for the predicted disease
        remedies = data['diseases'][predicted_disease].get('cures', [])

        # Print the remedies
        print(f"Remedies for {predicted_disease}:")
        for remedy in remedies:
            print(f"- {remedy}")
    else:
        print(f"No information found for {predicted_disease}")


def predict_disease(user_input):
    user_symptoms = extract_symptoms(user_input)

    while len(user_symptoms) < 3:
        print(f'Current symptoms: {user_symptoms}')
        suggestions = get_symptom_suggestions(user_symptoms)
        print(f'Oh that is very sad to hear. Do you also experience: {suggestions}')

        if not suggestions:
            print("No more suggestions. Unable to identify the disease.")
            return

        user_response = input("Enter additional symptoms (or type 'done' if no more symptoms): ")

        if user_response.lower() == 'done':
            break

        user_symptoms.extend(extract_symptoms(user_response))

    # Predict disease based on symptoms
    user_symptoms_str = ' '.join(user_symptoms)
    user_vector = tfidf_vectorizer.transform([user_symptoms_str])

    cosine_similarities = linear_kernel(user_vector, tfidf_matrix).flatten()
    predicted_disease_index = cosine_similarities.argmax()
    predicted_disease = df['Disease'][predicted_disease_index]

    print(f'According to me you are suffering from {predicted_disease}\nDont worry here are the some remedies.\n')
    provide_remedies(predicted_disease)



# Function to suggest additional symptoms based on user input
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

# Example usage
user_input = input("Enter your symptoms: ")
predict_disease(user_input)
