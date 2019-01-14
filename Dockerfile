FROM node:11 as builder
WORKDIR '/app'
COPY ./client/package.json ./client/yarn.lock ./
RUN yarn install --frozen-lockfile
COPY ./client .
RUN yarn build

FROM node:11
WORKDIR "/app"
COPY ./package.json ./yarn.lock ./
RUN yarn install --frozen-lockfile --ignore-scripts

# Copy server files
COPY . .

# Copy built client
COPY --from=builder /app/build ./client/build

EXPOSE 3050

CMD ["yarn", "server"]
