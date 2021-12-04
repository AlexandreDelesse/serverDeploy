docker kill $(docker ps -q)
docker rm $(docker ps -a -q)
docker rmi $(docker images -q)

docker run -p 5001:5001 168078252309.dkr.ecr.eu-west-3.amazonaws.com/hakuna-api:latest