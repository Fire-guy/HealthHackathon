# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/custom-actions


# This is a simple example for a custom action which utters "Hello World!"

# from typing import Any, Text, Dict, List
#
# from rasa_sdk import Action, Tracker
# from rasa_sdk.executor import CollectingDispatcher
#
#
# class ActionHelloWorld(Action):
#
#     def name(self) -> Text:
#         return "action_hello_world"
#
#     def run(self, dispatcher: CollectingDispatcher,
#             tracker: Tracker,
#             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
#
#         dispatcher.utter_message(text="Hello World!")
#
#         return []

from typing import Dict, Text, Any, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import (
    SlotSet,
    EventType,
    ActionExecuted,
    SessionStarted,
    Restarted,
    FollowupAction,
    UserUtteranceReverted,
)
import json
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
import spacy
import re
import nlp
import requests

symptom_entities = []

class ActionSendData(Action):
    def name(self) -> Text:
        return "action_send_data"

    def is_valid_email(self, email: Text) -> bool:
        # Regular expression for a basic email validation
        email_regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        return bool(re.match(email_regex, email))

    def run(
        self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]
    ) -> List[Dict[Text, Any]]:
        name = tracker.get_slot("name")
        email = tracker.get_slot("email")

        if email and self.is_valid_email(email):
            dispatcher.utter_message("An OTP has been sent to your email address, kindly enter the 6 digit OTP")
        else:
            dispatcher.utter_message("I'm sorry, the provided email address is not valid. Please provide a valid email.")

        return []

class ActionValidOtp(Action):
    def name(self) -> Text:
        return "action_valid_otp"

    def run(
        self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]
    ) -> List[Dict[Text, Any]]:
        otp = tracker.get_slot("otp")

        if otp and len(otp) == 6:
            # Send OTP to Flask API
            # flask_api_url = "http://your-flask-api-url"
            # data = {"otp": otp}
            # response = requests.post(f"{flask_api_url}/receive_otp", json=data)

            # if response.ok:
            #     dispatcher.utter_message("OTP sent to Flask API successfully.")
            # else:
            #     dispatcher.utter_message("Error sending OTP to Flask API.")
            dispatcher.utter_message("Please enter the symptoms you are facing :")

        else:
            dispatcher.utter_message("Invalid OTP format. Please provide a 6-digit OTP.")

        return []

class ActionSendSymptom(Action):
    def name(self) -> Text:
        return "action_send_symptom"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # Extract entity from the user's input
        symptom_intent = tracker.latest_message.get('intent', {}).get('name')
        entity_mapping = {
            'tell_me_symptom_Breath': 'Breath',
            'tell_me_symptom_Taste': 'Taste',
            'tell_me_symptom_Fever': 'Fever',
            'tell_me_symptom_ChestPain': 'ChestPain',
            'tell_me_symptom_JointPainSwelling': 'JointPainSwelling',
            'tell_me_symptom_VisionProblem': 'VisionProblem',
            'tell_me_symptom_Nosebleeds': 'Nosebleeds',
            'tell_me_symptom_MemoryLoss': 'MemoryLoss',
            'tell_me_symptom_DifficultyProblemSolving': 'DifficultyProblemSolving',
            'tell_me_symptom_Disorientation': 'Disorientation',
            'tell_me_symptom_MorningStiffness': 'MorningStiffness',
            'tell_me_symptom_LossInHeight': 'LossInHeight',
            'tell_me_symptom_FragileBones': 'FragileBones',
            'tell_me_symptom_SkinColorLoss': 'SkinColorLoss',
            'tell_me_symptom_GrayingHair': 'GrayingHair',
            'tell_me_symptom_Sunburn': 'Sunburn',
            'tell_me_symptom_sore_throat': 'sore throat',
            'tell_me_symptom_WateryStools': 'WateryStools',
            'tell_me_symptom_BodyAche': 'BodyAche',
            'tell_me_symptom_Cough': 'Cough',
            'tell_me_symptom_Frequent_Urination': 'Frequent_Urination',
            'tell_me_symptom_Excessive_Thirst': 'Excessive_Thirst',
            'tell_me_symptom_Sensitivity_to_Light': 'Sensitivity_to_Light',
            'tell_me_symptom_Headache': 'Headache',
            'tell_me_symptom_Stomachache': 'Stomachache',
            'tell_me_symptom_BackPain': 'BackPain',
            'tell_me_symptom_Weakness': 'Weakness',
            'tell_me_symptom_Wheezing': 'Wheezing',
        }

        if symptom_intent in entity_mapping:
            symptom_entity = next(tracker.get_latest_entity_values(entity_mapping[symptom_intent]), None)

            if symptom_entity:
                symptom_entities.append(symptom_entity)

        if len(symptom_entities)<4 & len(symptom_entities)>0:
            # Write symptoms to a text file when the size of the list is 3
            # Write to symptoms.txt
            symptoms_text = ', '.join(symptom_entities);
            with open('symptoms.txt', 'w') as file:
                file.write(symptoms_text.lower())
            # return [ActionExecuted("action_diagnose")]
        

        return []
    

        #    if symptom_intent in entity_mapping:
        #     symptom_entity = next(tracker.get_latest_entity_values(entity_mapping[symptom_intent]), None)

        #     if symptom_entity:
        #         symptom_entities.append(symptom_entity)

        # if len(symptom_entities) == 3:
        #     # Store the comma-separated string in a slot
        #     symptom_string = ', '.join(symptom_entities)
        #     dispatcher.utter_message(text=f"Symptoms: {symptom_string}")
        #     return [SlotSet("symptom_string", symptom_string)]
        # return []
   
class ActionDiagnose(Action):
    def name(self) -> Text:
        return "action_diagnose"

    def __init__(self):
        #fk this shit
        # self.ActionSendSymptom_instance = instance_of_ActionSendSymptom

        # Load the Excel file into a DataFrame
        excel_file_path = 'diseases2.xlsx'
        df = pd.read_excel(excel_file_path)

        # Extract 'Disease' and 'Symptoms' columns
        disease_col = df['diseases']
        symptoms_cols = df[['symptom 1', 'symptom 2', 'symptom 3', 'symptom 4', 'symptom 5']]

        # Combine 'Disease' and 'Symptoms' into a new DataFrame
        result_df = pd.DataFrame({'Disease': disease_col, 'Symptoms': symptoms_cols.values.tolist()})

        self.df = result_df

        # Load spaCy model
        self.nlp = spacy.load('en_core_web_sm')

        # Preprocess the symptoms data
        self.df['Symptoms_str'] = self.df['Symptoms'].apply(lambda x: ' '.join(map(str, x)))

        # Create a TF-IDF vectorizer
        self.tfidf_vectorizer = TfidfVectorizer(stop_words='english')
        self.tfidf_matrix = self.tfidf_vectorizer.fit_transform(self.df['Symptoms_str'])

    def provide_remedies(self, dispatcher, predicted_disease):
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

    def get_symptom_suggestions(self, user_symptoms):
        suggestions = set()

        for symptom in user_symptoms:
            symptom_idx = self.df['Symptoms_str'].str.contains(symptom)
            related_diseases = self.df[symptom_idx]['Disease'].tolist()

            for disease in related_diseases:
                common_symptoms = self.df[self.df['Disease'] == disease]['Symptoms'].values[0]
                suggestions.update(common_symptoms)

        suggestions -= set(user_symptoms)
        return list(suggestions)[:2]

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain):

        # symptom_list = self.ActionSendSymptom_instance.symptom_entities
        # user_input = tracker.latest_message.get("text")
        # user_input = ', '.join(symptom_list)
        # Read user_input from symptoms.txt using file handling
        with open('symptoms.txt', 'r') as file:
            user_input = file.read()
        # user_input = ', '.join(symptom_entities)
        symptom_entities.clear()

        # Assuming the existence of the following functions
        def extract_symptoms(self, user_input):
            doc = self.nlp(user_input)  # Access nlp as self.nlp
            user_symptoms = [token.text for token in doc if token.pos_ == 'NOUN']
            return user_symptoms
        
        # Logic to predict disease and provide remedies
        user_symptoms = extract_symptoms(self,user_input)

        while len(user_symptoms) < 3:
            message = f'Current symptoms: {user_symptoms}\n'
            suggestions = self.get_symptom_suggestions(user_symptoms)
            message += f'Oh, that is very sad to hear. Do you also experience: {suggestions}\n'

            if not suggestions:
                message += "No more suggestions. Unable to identify the disease."
                dispatcher.utter_message(text=message)
                return

            # Assuming Rasa will handle the user response and extract it
            user_response = "done"  # Placeholder, replace this with the actual user response

            if user_response.lower() == 'done':
                break

            user_symptoms.extend(extract_symptoms(self,user_response))

        # Predict disease based on symptoms
        user_symptoms_str = ' '.join(map(str, user_symptoms))
        user_vector = self.tfidf_vectorizer.transform([user_symptoms_str])

        cosine_similarities = linear_kernel(user_vector, self.tfidf_matrix).flatten()
        predicted_disease_index = cosine_similarities.argmax()
        predicted_disease = self.df['Disease'][predicted_disease_index]

        message = f'According to me, you are suffering from {predicted_disease}\nDon\'t worry, here are some remedies.\n'
        dispatcher.utter_message(text=message)

        # Call the modified provide_remedies function to send remedies message
        self.provide_remedies(dispatcher, predicted_disease)

        return []



