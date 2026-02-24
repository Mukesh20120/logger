# base image
FROM node:20-alpine

#working directory
WORKDIR /app

#copy package file
COPY package*.json ./

#run npm install
RUN npm install

#copy the res
COPY . .

EXPOSE 5000

#default command
CMD ["npm", "run", "backend"]