FROM mlikiowa/napcat-docker:base
ARG NAPCAT_VERSION
ARG KOISHI_BOILERPLATE_URL
ARG LINUX_QQ_DOWNLOAD_URL
RUN mkdir /setup

WORKDIR /setup

COPY ./boot /setup/boot
COPY ./config /setup/config/template
COPY ./setup /setup/setup/

VOLUME /app/napcat/config
VOLUME /app/.config/QQ
VOLUME /koishi

WORKDIR /app
WORKDIR /setup

RUN export KOISHI_BOILERPLATE_URL=$KOISHI_BOILERPLATE_URL
RUN export NAPCAT_VERSION=$NAPCAT_VERSION
RUN export LINUX_QQ_DOWNLOAD_URL=$LINUX_QQ_DOWNLOAD_URL


RUN mkdir -p "/koishi"
RUN chmod +x -R /setup

RUN useradd --no-log-init -d /app napcat

RUN ls /setup && /setup/setup/koishi-setup.sh

WORKDIR /koishi

# setup node
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash \
    && \. "$HOME/.nvm/nvm.sh" \
    && nvm install 22 \
    && node -v \
    && nvm current \
    && corepack enable yarn \
    && yarn -v \
    && nvm alias default 22 \
    && nvm use default \
    && corepack enable yarn \
    && echo "--- Checking Yarn version during build ---"\
    && yarn --version

RUN mv /setup/config/template/package.json /koishi

RUN \. "$HOME/.nvm/nvm.sh"  && cd /koishi \
    && yarn add typeid-js@1.2.0 beatsaber-bot-core@0.3.0-rc.34 \
    && yarn install


ENV NVM_DIR=/root/.nvm
ENV PATH=$NVM_DIR/versions/node/v22.19.0/bin:$PATH

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

RUN . "$NVM_DIR/nvm.sh" && echo "Checking nvm current in a new RUN:" && nvm current
RUN . "$NVM_DIR/nvm.sh" && nvm install 22
RUN . "$NVM_DIR/nvm.sh" && corepack enable yarn

RUN /setup/setup/napcat-setup.sh

WORKDIR /napcat

WORKDIR /setup

ENTRYPOINT ["bash", "/setup/boot/boot.sh"]

EXPOSE 3001
EXPOSE 3000
EXPOSE 6099
EXPOSE 5140
