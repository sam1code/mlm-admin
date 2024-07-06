# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/engine/reference/builder/

ARG NODE_VERSION=18.16.0

FROM node:${NODE_VERSION}-alpine as builder

# Use production node environment by default.
# ENV NODE_ENV production


WORKDIR /usr/src/app

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into

COPY package*.json ./
COPY package-lock.json ./

# into this layer.
RUN npm ci
# RUN npm ci

# Run the application as a non-root user.
# USER node

# # permissions to the node user.
# RUN chown -R node:node ${WORKDIR}

# Copy the rest of the source files into the image.
COPY . .

# Build the application.
RUN npm run build

#  Nginx will be running on port 3000.
FROM nginx:1.21.1-alpine

# Copy the nginx configuration file.
COPY nginx/nginx.conf /etc/nginx/nginx.conf


# Copy the built application to the nginx root folder.
COPY --from=builder /usr/src/app/build /usr/share/nginx/html

# Delete all the files of working directory
RUN rm -rf /usr/src/app/*
