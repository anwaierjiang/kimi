FROM node:22-slim
LABEL "language"="nodejs"
WORKDIR /src
COPY . .
RUN npm install
EXPOSE 3000  
CMD ["npm", "run", "start"]
