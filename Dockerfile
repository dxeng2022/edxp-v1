FROM openjdk:11
ARG JAR_FILE=build/libs/app.jar
COPY ${JAR_FILE} ./app.jar
ENV TZ=Asia/Seoul
ENTRYPOINT ["java","-jar",\
"-javaagent:/pinpoint-agent/pinpoint-bootstrap-2.5.1.jar",\
"-Dpinpoint.agentId=test01","-Dpinpoint.applicationName=bootapp",\
"./app.jar"]