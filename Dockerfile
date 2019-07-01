# Build React front-end
FROM node:11 as builder

ENV NODE_ENV=production

WORKDIR  /app

# Install NPM packages
COPY ./client/package.json ./client/yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy the remaining files and build
COPY ./client .
RUN yarn build

# Build Feathersjs app
FROM node:11

ENV NODE_ENV=production

WORKDIR  /app

# Install NPM packages
COPY ./package.json ./yarn.lock ./
RUN yarn install --frozen-lockfile --ignore-scripts

# Copy remaining files
COPY . .

# Copy built client
COPY --from=builder /app/build ./client/build

EXPOSE 3050

CMD ["yarn", "server"]
