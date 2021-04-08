FROM catchdigital/node-sass as builder

WORKDIR /
COPY ./package.json ./package.json
RUN npm install --loglevel=error

COPY ./public ./public
COPY ./src ./src

RUN npm run build

FROM zzswang/docker-nginx-react:latest
COPY --from=builder /build /app