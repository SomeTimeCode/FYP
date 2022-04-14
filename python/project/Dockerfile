FROM continuumio/miniconda3

WORKDIR /app

# Create the environment:
COPY environment.yml .
RUN conda env create -f environment.yml

SHELL ["conda", "run", "-n", "FYP", "/bin/bash", "-c"]

# The code to run when container is started:
COPY . .
ENTRYPOINT ["conda", "run", "--no-capture-output", "-n", "FYP", "python", "app.py"]