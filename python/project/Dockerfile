FROM continuumio/miniconda3

WORKDIR /app

# Create the environment:
COPY freeze.yml .
RUN conda env create -f freeze.yml

SHELL ["conda", "run", "-n", "myenv", "/bin/bash", "-c"]

RUN echo "Make sure flask is installed:"
RUN python -c "import flask"

# The code to run when container is started:
COPY run.py .
ENTRYPOINT ["conda", "run", "--no-capture-output", "-n", "myenv", "python", "app.py"]