import json
from typing import Union
from difflib import get_close_matches

def load_file(file_path: str) -> dict:
    with open(file_path, 'r') as file:
        data = json.load(file)
    return data

def save_into_file(file_path: str, data: dict):
    with open(file_path, 'w') as file:
        json.dump(data, file, indent=2)

def find_best_match(user_question: str, questions: list[str]) -> Union[str, None]:
    match = get_close_matches(user_question, questions, n=1, cutoff=0.6)
    return match[0] if match else None

def get_answer(question: str, base: dict) -> Union[str, None]:
    for q in base["questions"]:
        if q["questions"] == question:
            return q["answer"]



def chatbot():
    base = load_file('testFile.json')

    while True:
        userInput = input('You: ')

        if userInput.lower() == 'quit':
            print('Bot: Good Bye!')
            break

        bestMatch = find_best_match(userInput, [q["questions"] for q in base["questions"]])

        if bestMatch:
            answer = get_answer(bestMatch, base)
            print(f'Bot: {answer}')
        else:
            print('Bot: I don\'t know the answer. Can you teach me?')
            newAnswer = input('Type the answer or "skip" to skip: ')

            if newAnswer.lower() != 'skip':
                base["questions"].append({"questions": userInput, "answer": newAnswer})
                save_into_file('testFile.json', base)
                print('Bot: Thank you. I learned a new response :)')

if __name__ == '__main__':
    chatbot()
            