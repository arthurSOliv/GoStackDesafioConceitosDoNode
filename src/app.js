const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  const { techs } = request.query;

  const results = techs
    ? repositories.filter(repositorie => repositorie.techs.includes(techs))
    : repositories;

  return response.json(results);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repositorie = {id: uuid(), title, url, techs, likes: 0};

  repositories.push(repositorie);

  return response.json(repositorie);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const projectIndex = repositories.findIndex(repositorie => repositorie.id == id);

  if(projectIndex < 0){
      return response.status(400).json({error: 'Project not found.'});
  }

  const likes = repositories[projectIndex]['likes'];

  const repositorie = {
      id,
      title,
      url,
      techs,
      likes
  };

  repositories[projectIndex] = repositorie;

  return response.json(repositorie);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const projectIndex = repositories.findIndex(repositorie => repositorie.id == id);

  if(projectIndex < 0){
      return response.status(400).json({error: 'Project not found.'});
  }

  repositories.splice(projectIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const projectIndex = repositories.findIndex(repositorie => repositorie.id == id);

  if(projectIndex < 0){
      return response.status(400).json({error: 'Project not found.'});
  }

  const {likes, ...repo} = repositories[projectIndex];

  const repositorie = {...repo, likes: likes + 1};

  repositories.splice(projectIndex, 1, repositorie);

  return response.json(repositorie);
});

module.exports = app;
