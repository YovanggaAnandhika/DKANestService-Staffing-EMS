# Get Image From docker Hub
FROM alpine:3.20
# Add Author Info
LABEL maintainer="Yovangga Anandhika <dka.tech.dev@gmail.com>"
# install SSL Certificate
RUN apk add --no-cache openssl
RUN apk add --no-cache nodejs
RUN apk add --no-cache npm
RUN npm install --global yarn
# install general requirements
RUN apk add --no-cache curl
RUN apk add --no-cache bash
RUN apk add --no-cache nano
RUN apk add --no-cache iputils-ping
RUN apk add --no-cache ca-certificates
RUN apk add --no-cache tzdata
# -----------------------------------------------------------------
RUN apk add --no-cache openssh
COPY .config/ssh /etc/ssh
# -----------------------------------------------------------------
RUN rm -rf /var/cache/apk/*
# add Env Default
# -----------------------------------------------------------------
# adding timezone
ENV TZ=Asia/Makassar
# -----------------------------------------------------------------
# set Working Directory
WORKDIR /home/app
# copy app source to workdir
COPY . /home/app
# Show Directory Content
RUN ls -lah
# Install dependencies using Yarn workspaces
RUN yarn install
# Build the project (if needed for production)
RUN yarn build
# Delete SRC Folder
RUN rm -rf src
RUN rm -rf .config
# Show Directory Content
RUN ls -lah
# Expose Port
EXPOSE 80 22
# Copy entrypoint script to /usr/local/bin
COPY .config/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh
# Set the entrypoint script as the default command
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]