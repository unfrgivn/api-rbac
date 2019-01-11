#Load app files and run yarn install
FROM node
WORKDIR '/app'
COPY ./app .
RUN yarn install --frozen-lockfile
RUN yarn build
