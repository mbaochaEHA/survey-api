FROM node:16-alpine3.11
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
EXPOSE 3000
CMD ["npm","start"]
#docker run -it -p 9000:3000 survey-api
#docker build -t survey-api .

