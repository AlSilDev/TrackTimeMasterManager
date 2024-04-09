# About Track Time Master Manager

This project is a complete solution for managing rally events. Built in collaboration with a motoring sports organization, it adheres to strict FPAK rules.
In this repository, you'll find two of the three components that are essential to the project: the Vue web app and the NodeJS websocket server.

## Quick Start - Docker

Start by cloning this repository into a directory of your choice.

Before you attempt to run the project in containers, you'll need to create a file named `.env` in the track-time-master-manager directory with the following content:

```
VITE_API_DOMAIN=http://localhost:8000
VITE_WS_CONNECTION=http://localhost:8081
```

To run this project with only a few commands, you'll need `Docker` installed in your machine. Refer to the [official documentation](https://docs.docker.com/engine/) for instructions on how to install and set it up.

Before you build and run the containers, and if you haven't already, you'll need to create a network:

```
docker network create ttmm_network
```

To build the container images and deploy a multi-group container comprising all of the components **for the first time**, run the following command in the root of the cloned repository:

```
docker compose up --build -d
```

For subsequent deploys, run this command instead:

```
docker compose up -d
```

**Congrats!** The project should now be running! Check the app at http://localhost:8081!

If you haven't already, check out the [Track Time Master Manager API](https://github.com/AlSilDev/TrackTimeMasterManagerAPI) project, where you'll find everything to get the API up and running!

## Current status of development
The project is currently **not** in development. Some features are still lacking. If you are interested in contributing to this project, feel free to fork it or get in touch with us!
