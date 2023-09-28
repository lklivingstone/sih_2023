source env/bin/activate

python3 manage.py runserver 7000 && python3 -m vllm.entrypoints.openai.api_server --model NousResearch/Nous-Hermes-llama-2-7b