FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

FROM node:20-alpine AS runner
WORKDIR /app

RUN npm i -g serve

COPY --from=builder /app/build /app/build

EXPOSE 80
CMD ["serve", "-s", "/app/build", "-l", "80"]
