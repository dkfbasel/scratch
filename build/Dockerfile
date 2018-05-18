# USE ALPINE LINUX AS BASE IMAGE (TO ALLOW BASH NAVIGATION)
FROM alpine:3.7

MAINTAINER DKF-Basel <info@dkfbasel.ch>
LABEL copyright="Departement Klinische Forschung, Basel, Switzerland. 2018"

# ADD ROOT CERTIFICATE PROVIDERS FOR SSL CONNECTIONS
RUN apk add --no-cache ca-certificates

RUN mkdir /app

# COPY THE REQUIRED FILES INTO THE CONTAINER
ADD bin /app/bin
ADD templates /app/templates
ADD public /app/public

# ADD VOLUMES FROM THE HOST
# VOLUME [""]

# ALLOW ACCESS ON PORT 80
EXPOSE 80

# SET THE CURRENT WORKING DIRECTORY
WORKDIR /app

# START THE APPLICATION WITH THE CONTAINER
# TODO: add the name of the binary to start
CMD ["/app/bin/[NAME OF THE BINARY]"]
