# Stage 1: Build SAGIR CODE BOX
FROM openjdk:11-jdk AS builder
RUN apt-get update && apt-get install -y ant git
WORKDIR /src
COPY . .
WORKDIR /src/appinventor
RUN ant

# Stage 2: Run
FROM tomcat:9-jdk11
RUN rm -rf /usr/local/tomcat/webapps/ROOT
COPY --from=builder /src/appinventor/appengine/build/war /usr/local/tomcat/webapps/ROOT
EXPOSE 8080
CMD ["catalina.sh", "run"]
