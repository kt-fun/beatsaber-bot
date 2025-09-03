FROM mlikiowa/napcat-docker:base
ARG NAPCAT_VERSION
ARG TARGETPLATFORM
ARG TARGETARCH

ENV LINUX_QQ_DOWNLOAD_URL="https://dldir1v6.qq.com/qqfile/qq/QQNT/c773cdf7/linuxqq_3.2.19-39038_${TARGETARCH}.deb"
RUN echo "TARGETARCH=$TARGETARCH"
ENV KOISHI_BOILERPLATE_URL="https://github.com/koishijs/boilerplate/releases/download/v1.15.0/boilerplate-v1.15.0-linux-${TARGETARCH}-node20.zip"
ENV NAPCAT_VERSION=$NAPCAT_VERSION

RUN mkdir /setup
WORKDIR /setup

COPY --from=hairyhenderson/gomplate:stable /gomplate /bin/gomplate

COPY ./boot /setup/boot
COPY ./config /setup/config/template
COPY ./setup /setup/setup/

VOLUME /app/napcat/config
VOLUME /app/.config/QQ
VOLUME /app/koishi/data
VOLUME /app/status

WORKDIR /setup


RUN useradd --no-log-init -d /app napcat
RUN mkdir -p /app/status
RUN mkdir -p /app/koishi

RUN chmod +x -R /setup
RUN chown napcat:napcat -R /app
RUN chown root:root -R /setup

WORKDIR /app/koishi

# setup koishi
RUN ls /setup && /setup/setup/koishi-setup.sh

RUN mv /setup/config/template/package.json /app/koishi

# setup node
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash \
    && \. "$HOME/.nvm/nvm.sh"

RUN chmod +x -R /root/.nvm

ENV NVM_DIR=/root/.nvm
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
ENV PATH=$NVM_DIR/versions/node/v22.19.0/bin:$PATH

RUN . "$NVM_DIR/nvm.sh" && echo "Checking nvm current in a new RUN:" && nvm current
RUN . "$NVM_DIR/nvm.sh" && nvm install 22 && nvm alias default 22 && nvm use default
RUN . "$NVM_DIR/nvm.sh" && corepack enable yarn
RUN \. "$NVM_DIR/nvm.sh"  && cd /app/koishi && yarn install


# setup napcat
RUN /setup/setup/napcat-setup.sh


WORKDIR /setup
USER root
RUN chown napcat:napcat -R /app/napcat

ENTRYPOINT ["bash", "/setup/boot/boot.sh"]



EXPOSE 3001
EXPOSE 3000
EXPOSE 6099
EXPOSE 5140
