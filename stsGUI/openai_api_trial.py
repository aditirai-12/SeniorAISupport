!pip install --upgrade openai wandb

%env OPENAI_API_KEY= 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

import os
import wandb
from openai import OpenAI
client = OpenAI()

gpt_assistant_prompt = "You are a tech support assistant helping seniors who are above 65 years old. Answer in 5 words"
gpt_user_prompt = input("What do you need help with? ")
gpt_prompt = gpt_assistant_prompt, gpt_user_prompt
print(gpt_prompt)

message=[{"role": "assistant", "content": gpt_assistant_prompt}, {"role": "user", "content": gpt_user_prompt}]
max_tokens=256


response = client.chat.completions.create(
    model="gpt-4",
    messages = message,
    max_tokens=max_tokens
)
print(response.choices[0].message)