FROM python:3.11.3
ENV PYTHONUNBUFFERED True
ENV SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5YW9pd2JjZWR5Y3poZG9waGFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5NjYyMTUsImV4cCI6MjA1NDU0MjIxNX0.SqopNxuZaa6xnAZckCpsZ6GRNCh4yPKKlpqojDmb3HM"
ENV SUPABASE_URL="https://cyaoiwbcedyczhdophas.supabase.co"
ENV PYTHONPATH="backend"
ENV OPENROUTER_API_KEY="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"
ENV TOGETHER_API_KEY="894166a1c703a30bce86b2ccb13078c046a8e765e4f6a208a1ec95ba7cedfd5b"
ENV JUDGMENT_API_KEY="67937778-0ad5-4e88-8c7c-880e572fa88e"
# COPY Pipfile /
# RUN pip install --upgrade pip
# COPY requirements.txt .
# RUN pip install --no-cache-dir -r  requirements.txt

# ENV APP_HOME /root
# WORKDIR $APP_HOME
# COPY /app $APP_HOME/app

COPY Pipfile /app/Pipfile
COPY Pipfile.lock /app/Pipfile.lock

WORKDIR /app
RUN pip install pipenv && pipenv install --system --deploy

COPY . /app

EXPOSE 8000
CMD ["uvicorn", "server.main:app", "--host", "0.0.0.0", "--port", "8000"]