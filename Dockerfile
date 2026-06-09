FROM node:22-alpine
RUN sed -i 's/https/http/g' /etc/apk/repositories
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /opt/
COPY package.json pnpm-lock.yaml ./
RUN npm config set strict-ssl false && npm install -g pnpm@9.1.0
RUN pnpm config set strict-ssl false && \
    pnpm config set fetch-retry-maxtimeout 600000 && \
    pnpm install --frozen-lockfile
ENV PATH=/opt/node_modules/.bin:$PATH
ENV CI=true

WORKDIR /opt/app
COPY . .
RUN chown -R node:node /opt/app
USER node
EXPOSE 3001
CMD ["pnpm", "start:dev"]
