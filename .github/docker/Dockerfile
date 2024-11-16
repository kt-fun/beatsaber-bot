FROM node:lts-alpine
ARG TARGETPLATFORM
ARG VERSION
COPY ./boilerplate /koishi
RUN sed -i '' 's|workspace:\*|'"$VERSION"'|g' /koishi/package.json
RUN apk update && apk add chromium nss freetype harfbuzz ca-certificates ttf-freefont font-noto-cjk
RUN apk add fontconfig
RUN cd /koishi && yarn install

USER root

VOLUME ["/koishi"]
WORKDIR "/koishi"
EXPOSE 5140
CMD ["yarn", "start"]

