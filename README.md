# survey-api

Libraries Used
Express : web application framework
Morgan : logging
Cors:cors
lowDb: persisting data to disk in JSON format
SwaggerUI & SwaggerJsDoc:  for documentation
Fs & path : persisting logs to file
Docker: containerization
jest & supertest for unit and integration testing


How to Setup
1. The command bellow will pull the images from docker hub and execute locally. Subsequently running the command will execute from locally downloaded docker image 
    docker run -it -p 9000:3000 survey-api 9096543/survey-api

