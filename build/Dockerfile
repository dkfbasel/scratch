# USE ALPINE LINUX AS BASE IMAGE (TO ALLOW BASH NAVIGATION)
FROM alpine:3.5

MAINTAINER DKF-Basel <info@dkfbasel.ch>
LABEL copyright="Departement Klinische Forschung, Basel, Switzerland. 2017"

# ADD ROOT CERTIFICATE PROVIDERS FOR SSL CONNECTIONS
RUN apk add --no-cache ca-certificates

RUN mkdir /dkfbasel

# COPY THE REQUIRED FILES INTO THE CONTAINER
ADD bin /dkfbasel/bin
ADD templates /dkfbasel/templates
ADD public /dkfbasel/public

# ADD VOLUMES FROM THE HOST
# VOLUME [""]

# ALLOW ACCESS ON PORT 80
EXPOSE 80

# SET THE CURRENT WORKING DIRECTORY
WORKDIR /dkfbasel

# START THE APPLICATION WITH THE CONTAINER
# TODO: add the name of the binary to start
CMD ["/dkfbasel/bind/[NAME OF THE BINARY]"]
