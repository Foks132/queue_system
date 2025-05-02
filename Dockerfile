FROM node:22-alpine AS base

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma

RUN npm install
RUN npx prisma generate

COPY . .

# RUN npx prisma migrate deploy