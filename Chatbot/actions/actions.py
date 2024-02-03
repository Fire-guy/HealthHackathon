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
import re
import requests

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
            dispatcher.utter_message(f"OTP = {otp} successfully verified")

        else:
            dispatcher.utter_message("Invalid OTP format. Please provide a 6-digit OTP.")

        return []


